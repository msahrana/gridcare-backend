import httpStatus from 'http-status';

import { Prisma } from '../../../generated/prisma/browser';
import {
    PaymentGateway,
    PaymentStatus,
    SubscriptionStatus,
} from '../../../generated/prisma/enums';

import config from '../../config';
import { AppError } from '../../errors/AppError';
import { getBKashIdToken } from '../../lib/bkash';
import { prisma } from '../../lib/prisma';

import {
    BKashStatus,
    IBKashCreateResponse,
    IBKashPaymentResponse,
    ICreateSubscriptionPaymentPayload,
    IQuery,
} from './subscriptionPayment.interface';

const toJson = (data: unknown): Prisma.InputJsonValue => {
    return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
};

const generateMerchantInvoiceNumber = (): string => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();

    return `SUB-${Date.now()}-${random}`;
};

const normalizeBKashStatus = (status?: string): BKashStatus => {
    switch (status?.trim().toUpperCase()) {
        case 'COMPLETED':
        case 'SUCCESS':
            return 'COMPLETED';

        case 'FAILED':
        case 'FAILURE':
        case 'DECLINED':
            return 'FAILED';

        case 'CANCELLED':
        case 'CANCELED':
        case 'CANCEL':
            return 'CANCELLED';

        case 'INITIATED':
        case 'PROCESSING':
        case 'PENDING':
            return 'PENDING';

        default:
            return 'UNKNOWN';
    }
};

const getBKashHeaders = (token: string) => ({
    'Content-Type': 'application/json',
    Accept: 'application/json',
    Authorization: token,
    'X-App-Key': config.bkash_app_key,
});

const parseBKashResponse = async (
    response: globalThis.Response,
): Promise<IBKashPaymentResponse> => {
    const text = await response.text();

    let data: IBKashPaymentResponse = {};

    try {
        data = text ? (JSON.parse(text) as IBKashPaymentResponse) : {};
    } catch {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            `Invalid response received from bKash. HTTP Status: ${response.status}`,
        );
    }

    if (!response.ok) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            data.statusMessage ||
                data.errorMessage ||
                `bKash API request failed. HTTP Status: ${response.status}`,
        );
    }

    if (data.statusCode && data.statusCode !== '0000') {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            data.statusMessage ||
                data.errorMessage ||
                `bKash transaction failed. Status Code: ${data.statusCode}`,
        );
    }

    return data;
};

const createBKashPayment = async (payload: {
    amount: string;
    merchantInvoiceNumber: string;
    callbackURL: string;
    payerReference: string;
}): Promise<IBKashCreateResponse> => {
    const token = await getBKashIdToken();

    if (!token) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'Unable to get bKash authentication token',
        );
    }

    const response = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/create`,
        {
            method: 'POST',
            headers: getBKashHeaders(token),
            body: JSON.stringify({
                mode: '0011',
                payerReference: payload.payerReference,
                callbackURL: payload.callbackURL,
                amount: payload.amount,
                currency: 'BDT',
                intent: 'sale',
                merchantInvoiceNumber: payload.merchantInvoiceNumber,
            }),
        },
    );

    return parseBKashResponse(response);
};

const executeBKashPayment = async (
    paymentID: string,
): Promise<IBKashPaymentResponse> => {
    const token = await getBKashIdToken();

    if (!token) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'Unable to obtain bKash ID token',
        );
    }

    const response = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/execute`,
        {
            method: 'POST',
            headers: getBKashHeaders(token),
            body: JSON.stringify({
                paymentID,
            }),
        },
    );

    return parseBKashResponse(response);
};

const queryBKashPayment = async (
    paymentID: string,
): Promise<IBKashPaymentResponse> => {
    const token = await getBKashIdToken();

    if (!token) {
        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'Unable to obtain bKash ID token',
        );
    }

    const response = await fetch(
        `${config.bkash_base_url}/tokenized/checkout/payment/status`,
        {
            method: 'POST',
            headers: getBKashHeaders(token),
            body: JSON.stringify({
                paymentID,
            }),
        },
    );

    return parseBKashResponse(response);
};

const getCheckoutURL = (gatewayResponse: unknown): string | null => {
    if (!gatewayResponse || typeof gatewayResponse !== 'object') {
        return null;
    }

    const data = gatewayResponse as Record<string, unknown>;

    if (typeof data.bkashURL === 'string') {
        return data.bkashURL;
    }

    if (typeof data.paymentURL === 'string') {
        return data.paymentURL;
    }

    return null;
};

const activateSubscriptionAfterPayment = async (
    paymentId: string,
    gatewayResponse: IBKashPaymentResponse,
) => {
    return prisma.$transaction(async (tx) => {
        const payment = await tx.subscriptionPayment.findUnique({
            where: {
                id: paymentId,
            },
            include: {
                subscription: {
                    include: {
                        plan: true,
                    },
                },
            },
        });

        if (!payment) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Subscription payment not found',
            );
        }

        // Idempotency
        if (payment.status === PaymentStatus.PAID) {
            return payment;
        }

        const subscription = payment.subscription;

        if (!subscription) {
            throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
        }

        const plan = subscription.plan;

        if (!plan) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Subscription plan not found',
            );
        }

        // Verify amount
        const gatewayAmount = Number(gatewayResponse.amount);
        const localAmount = Number(payment.amount);

        if (Number.isNaN(gatewayAmount) || gatewayAmount !== localAmount) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'Payment amount mismatch',
            );
        }

        // Verify merchant invoice
        if (
            gatewayResponse.merchantInvoiceNumber &&
            gatewayResponse.merchantInvoiceNumber !==
                payment.merchantInvoiceNumber
        ) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'Merchant invoice number mismatch',
            );
        }

        const now = new Date();

        const endDate = new Date(now);
        endDate.setDate(endDate.getDate() + plan.durationDays);

        const updatedPayment = await tx.subscriptionPayment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.PAID,
                bkashTrxId: gatewayResponse.trxID ?? payment.bkashTrxId,
                paidAt: now,
                gatewayResponse: toJson(gatewayResponse),
            },
        });

        await tx.subscription.update({
            where: {
                id: subscription.id,
            },
            data: {
                status: SubscriptionStatus.ACTIVE,
                startDate: now,
                endDate,
            },
        });

        return updatedPayment;
    });
};

const updateLocalPaymentStatus = async (
    paymentId: string,
    status: PaymentStatus,
    gatewayResponse?: unknown,
) => {
    return prisma.subscriptionPayment.update({
        where: {
            id: paymentId,
        },
        data: {
            status,
            gatewayResponse: gatewayResponse
                ? toJson(gatewayResponse)
                : undefined,
            ...(status === PaymentStatus.PAID && {
                paidAt: new Date(),
            }),
        },
    });
};

const processBKashResult = async (
    paymentId: string,
    result: IBKashPaymentResponse,
) => {
    const status = normalizeBKashStatus(result.transactionStatus);

    switch (status) {
        case 'COMPLETED':
            return {
                status,
                payment: await activateSubscriptionAfterPayment(
                    paymentId,
                    result,
                ),
            };

        case 'FAILED':
            return {
                status,
                payment: await updateLocalPaymentStatus(
                    paymentId,
                    PaymentStatus.FAILED,
                    result,
                ),
            };

        case 'CANCELLED':
            return {
                status,
                payment: await updateLocalPaymentStatus(
                    paymentId,
                    PaymentStatus.CANCELLED,
                    result,
                ),
            };

        case 'PENDING':
        case 'UNKNOWN':
        default:
            return {
                status: 'PENDING' as const,
                payment: await updateLocalPaymentStatus(
                    paymentId,
                    PaymentStatus.PENDING,
                    result,
                ),
            };
    }
};

const createSubscriptionPaymentIntoDB = async (
    userId: string,
    payload: ICreateSubscriptionPaymentPayload,
) => {
    const paymentGateway = payload.paymentGateway ?? PaymentGateway.BKASH;

    if (paymentGateway !== PaymentGateway.BKASH) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `${paymentGateway} payment gateway is not implemented yet`,
        );
    }

    const subscription = await prisma.subscription.findFirst({
        where: {
            id: payload.subscriptionId,
            userId,
        },
        include: {
            plan: true,
        },
    });

    if (!subscription) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
    }

    const plan = subscription.plan;

    if (!plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription plan not found');
    }

    if (plan.status !== 'ACTIVE') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Subscription plan is not active',
        );
    }

    // Prevent duplicate successful payment
    const paidPayment = await prisma.subscriptionPayment.findFirst({
        where: {
            subscriptionId: subscription.id,
            userId,
            status: PaymentStatus.PAID,
        },
    });

    if (paidPayment) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This subscription has already been paid',
        );
    }

    // Reuse existing pending bKash payment
    const existingPayment = await prisma.subscriptionPayment.findFirst({
        where: {
            subscriptionId: subscription.id,
            userId,
            status: PaymentStatus.PENDING,
            paymentGateway: PaymentGateway.BKASH,
        },
    });

    if (existingPayment?.bkashPaymentId) {
        return {
            payment: existingPayment,
            paymentId: existingPayment.bkashPaymentId,
            bkashURL: getCheckoutURL(existingPayment.gatewayResponse),
            reused: true,
        };
    }

    const merchantInvoiceNumber = generateMerchantInvoiceNumber();

    // Create local payment first
    const payment = await prisma.subscriptionPayment.create({
        data: {
            userId,
            subscriptionId: subscription.id,
            amount: plan.price,
            currency: 'BDT',
            paymentGateway: PaymentGateway.BKASH,
            status: PaymentStatus.PENDING,
            merchantInvoiceNumber,
        },
    });

    try {
        const callbackURL = `${config.backend_url}/api/v1/subscription-payment/bkash/callback`;

        const bkashResponse = await createBKashPayment({
            amount: String(plan.price),
            merchantInvoiceNumber,
            callbackURL,
            payerReference: userId,
        });

        if (!bkashResponse.paymentID) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'bKash payment ID was not returned',
            );
        }

        const bkashURL =
            bkashResponse.bkashURL ?? bkashResponse.paymentURL ?? null;

        if (!bkashURL) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'bKash checkout URL was not returned',
            );
        }

        const updatedPayment = await prisma.subscriptionPayment.update({
            where: {
                id: payment.id,
            },
            data: {
                bkashPaymentId: bkashResponse.paymentID,
                gatewayResponse: toJson(bkashResponse),
            },
        });

        return {
            payment: updatedPayment,
            paymentId: bkashResponse.paymentID,
            bkashURL,
            reused: false,
        };
    } catch (error) {
        await prisma.subscriptionPayment.update({
            where: {
                id: payment.id,
            },
            data: {
                status: PaymentStatus.FAILED,
            },
        });

        throw error;
    }
};

const handleBKashCallbackIntoDB = async (
    paymentID: string,
    callbackStatus?: string,
) => {
    const payment = await prisma.subscriptionPayment.findFirst({
        where: {
            bkashPaymentId: paymentID,
        },
    });

    if (!payment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Payment not found for this bKash payment ID',
        );
    }

    // Idempotency
    if (payment.status === PaymentStatus.PAID) {
        return {
            status: 'COMPLETED' as const,
            payment,
        };
    }

    const normalizedCallbackStatus = normalizeBKashStatus(callbackStatus);

    // Customer cancelled payment
    if (normalizedCallbackStatus === 'CANCELLED') {
        return {
            status: 'CANCELLED' as const,
            payment: await updateLocalPaymentStatus(
                payment.id,
                PaymentStatus.CANCELLED,
                {
                    callbackStatus,
                    paymentID,
                },
            ),
        };
    }

    // bKash explicitly reported failure
    if (normalizedCallbackStatus === 'FAILED') {
        return {
            status: 'FAILED' as const,
            payment: await updateLocalPaymentStatus(
                payment.id,
                PaymentStatus.FAILED,
                {
                    callbackStatus,
                    paymentID,
                },
            ),
        };
    }

    // Execute payment after successful checkout
    try {
        const executeResult = await executeBKashPayment(paymentID);

        const executeStatus = normalizeBKashStatus(
            executeResult.transactionStatus,
        );

        if (executeStatus !== 'PENDING' && executeStatus !== 'UNKNOWN') {
            return processBKashResult(payment.id, executeResult);
        }
    } catch (error) {
        console.error(
            'bKash execute error:',
            error instanceof Error ? error.message : error,
        );
    }

    // Query payment as fallback
    const queryResult = await queryBKashPayment(paymentID);

    return processBKashResult(payment.id, queryResult);
};

const buildPaymentWhere = (
    userId: string | undefined,
    query: IQuery,
): Prisma.SubscriptionPaymentWhereInput => {
    const search = query.search?.trim();

    return {
        ...(userId && {
            userId,
        }),

        ...(query.status && {
            status: query.status,
        }),

        ...(query.paymentGateway && {
            paymentGateway: query.paymentGateway,
        }),

        ...(search && {
            OR: [
                {
                    merchantInvoiceNumber: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    bkashPaymentId: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    bkashTrxId: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        }),
    };
};

const getPagination = (query: IQuery) => {
    const page = Math.max(Number(query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

    return {
        page,
        limit,
        skip: (page - 1) * limit,
    };
};

const getSort = (query: IQuery) => {
    const allowedSortFields = [
        'createdAt',
        'updatedAt',
        'amount',
        'paidAt',
        'status',
    ];

    const sortBy =
        query.sortBy && allowedSortFields.includes(query.sortBy)
            ? query.sortBy
            : 'createdAt';

    const sortOrder = query.sortOrder === 'asc' ? 'asc' : 'desc';

    return {
        [sortBy]: sortOrder,
    } as Prisma.SubscriptionPaymentOrderByWithRelationInput;
};

const getMySubscriptionPaymentsIntoDB = async (
    userId: string,
    query: IQuery,
) => {
    const { page, limit, skip } = getPagination(query);

    const where = buildPaymentWhere(userId, query);
    const orderBy = getSort(query);

    const [data, total] = await Promise.all([
        prisma.subscriptionPayment.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                subscription: {
                    include: {
                        plan: true,
                    },
                },
            },
        }),

        prisma.subscriptionPayment.count({
            where,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
        data,
    };
};

const getAllSubscriptionPaymentsIntoDB = async (query: IQuery) => {
    const { page, limit, skip } = getPagination(query);

    const where = buildPaymentWhere(undefined, query);
    const orderBy = getSort(query);

    const [data, total] = await Promise.all([
        prisma.subscriptionPayment.findMany({
            where,
            skip,
            take: limit,
            orderBy,
            include: {
                subscription: {
                    include: {
                        plan: true,
                    },
                },
                user: {
                    select: {
                        id: true,
                        email: true,
                        name: true,
                    },
                },
            },
        }),

        prisma.subscriptionPayment.count({
            where,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data,
    };
};

const getSingleSubscriptionPaymentIntoDB = async (
    paymentId: string,
    userId?: string,
) => {
    const payment = await prisma.subscriptionPayment.findFirst({
        where: {
            id: paymentId,
            ...(userId && {
                userId,
            }),
        },
        include: {
            subscription: {
                include: {
                    plan: true,
                },
            },
        },
    });

    if (!payment) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Subscription payment not found',
        );
    }

    return payment;
};

export const subscriptionPaymentServices = {
    createSubscriptionPaymentIntoDB,
    handleBKashCallbackIntoDB,
    getSingleSubscriptionPaymentIntoDB,
    getMySubscriptionPaymentsIntoDB,
    getAllSubscriptionPaymentsIntoDB,
};
