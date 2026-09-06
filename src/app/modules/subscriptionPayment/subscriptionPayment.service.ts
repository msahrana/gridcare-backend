import httpStatus from 'http-status';
import { Prisma } from '../../../generated/prisma/browser';
import {
    PaymentGateway,
    PaymentStatus,
    SubscriptionStatus,
} from '../../../generated/prisma/enums';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';
import config from '../../config';
import { getBKashIdToken } from '../../lib/bkash';

import {
    ICreateSubscriptionPaymentPayload,
    IQuery,
} from './subscriptionPayment.interface';

interface IBKashCreateResponse {
    paymentID?: string;
    bkashURL?: string;
    paymentURL?: string;
    callbackURL?: string;
    amount?: string;
    intent?: string;
    currency?: string;
    paymentCreateTime?: string;
    transactionStatus?: string;
    merchantInvoiceNumber?: string;
    statusCode?: string;
    statusMessage?: string;
    errorCode?: string;
    errorMessage?: string;
}

interface IBKashPaymentResponse {
    paymentID?: string;
    trxID?: string;
    transactionStatus?: string;
    amount?: string;
    currency?: string;
    intent?: string;
    merchantInvoiceNumber?: string;
    paymentCreateTime?: string;
    paymentExecuteTime?: string;
    statusCode?: string;
    statusMessage?: string;
    errorCode?: string;
    errorMessage?: string;
    verificationStatus?: string;
}

type BKashStatus = 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'PENDING' | 'UNKNOWN';

const toJson = (data: unknown): Prisma.InputJsonValue => {
    return JSON.parse(JSON.stringify(data)) as Prisma.InputJsonValue;
};

const generateMerchantInvoiceNumber = (): string => {
    const random = Math.random().toString(36).substring(2, 10).toUpperCase();

    return `SUB-${Date.now()}-${random}`;
};

const normalizeBKashStatus = (status?: string): BKashStatus => {
    const normalized = status?.trim().toUpperCase();

    switch (normalized) {
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

    let data: IBKashPaymentResponse;

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

    const data = await parseBKashResponse(response);

    return data;
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

        /* Idempotency */
        if (payment.status === PaymentStatus.PAID) {
            return payment;
        }

        if (!payment.subscription) {
            throw new AppError(httpStatus.NOT_FOUND, 'Subscription not found');
        }

        const subscription = payment.subscription;

        if (!subscription.plan) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Subscription plan not found',
            );
        }

        const gatewayAmount = Number(gatewayResponse.amount);

        const localAmount = Number(payment.amount);

        /* Amount verification */
        if (Number.isNaN(gatewayAmount) || gatewayAmount !== localAmount) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'Payment amount mismatch',
            );
        }

        /* Merchant invoice verification */
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

        endDate.setDate(endDate.getDate() + subscription.plan.durationDays);

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

            ...(status === PaymentStatus.PAID
                ? {
                      paidAt: new Date(),
                  }
                : {}),
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
            return activateSubscriptionAfterPayment(paymentId, result);

        case 'FAILED':
            return updateLocalPaymentStatus(
                paymentId,
                PaymentStatus.FAILED,
                result,
            );

        case 'CANCELLED':
            return updateLocalPaymentStatus(
                paymentId,
                PaymentStatus.CANCELLED,
                result,
            );

        case 'PENDING':
        case 'UNKNOWN':
        default:
            return updateLocalPaymentStatus(
                paymentId,
                PaymentStatus.PENDING,
                result,
            );
    }
};

const createSubscriptionPaymentIntoDB = async (
    userId: string,
    payload: ICreateSubscriptionPaymentPayload,
) => {
    const paymentGateway = payload.paymentGateway ?? PaymentGateway.BKASH;

    /* Currently only bKash is implemented */
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

    if (!subscription.plan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription plan not found');
    }

    if (subscription.plan.status && subscription.plan.status !== 'ACTIVE') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Subscription plan is not active',
        );
    }

    /* Prevent duplicate successful payment */
    const paidPayment = await prisma.subscriptionPayment.findFirst({
        where: {
            subscriptionId: payload.subscriptionId,

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

    /* Return existing pending payment */
    const existingPayment = await prisma.subscriptionPayment.findFirst({
        where: {
            subscriptionId: payload.subscriptionId,

            userId,

            status: PaymentStatus.PENDING,

            paymentGateway: PaymentGateway.BKASH,
        },
    });

    if (existingPayment && existingPayment.bkashPaymentId) {
        const checkoutURL = getCheckoutURL(existingPayment.gatewayResponse);

        return {
            payment: existingPayment,
            paymentId: existingPayment.bkashPaymentId,
            bkashURL: checkoutURL,
            reused: true,
        };
    }

    const merchantInvoiceNumber = generateMerchantInvoiceNumber();

    /*
     * Create local payment first.
     */
    const payment = await prisma.subscriptionPayment.create({
        data: {
            userId,

            subscriptionId: subscription.id,

            amount: subscription.plan.price,

            currency: 'BDT',

            paymentGateway: PaymentGateway.BKASH,

            status: PaymentStatus.PENDING,

            merchantInvoiceNumber,
        },
    });

    try {
        const callbackURL = `${config.backend_url}/api/v1/subscription-payment/bkash/callback`;

        const bkashResponse = await createBKashPayment({
            amount: String(subscription.plan.price),

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
            payment: {
                ...payment,

                bkashPaymentId: bkashResponse.paymentID,

                gatewayResponse: bkashResponse,
            },

            paymentId: bkashResponse.paymentID,

            bkashURL:
                bkashResponse.bkashURL ?? bkashResponse.paymentURL ?? null,

            reused: false,
        };
    } catch (error) {
        /*
         * bKash create failed, so local pending
         * record should not remain pending.
         */
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

    if (payment.status === PaymentStatus.PAID) {
        return {
            status: 'COMPLETED',
            payment,
        };
    }

    const normalizedCallbackStatus = normalizeBKashStatus(callbackStatus);

    /*
     * If customer cancelled from bKash page.
     */
    if (normalizedCallbackStatus === 'CANCELLED') {
        const updated = await updateLocalPaymentStatus(
            payment.id,
            PaymentStatus.CANCELLED,
            {
                callbackStatus,
                paymentID,
            },
        );

        return {
            status: 'CANCELLED',
            payment: updated,
        };
    }

    /*
     * If bKash explicitly reports failure.
     */
    if (normalizedCallbackStatus === 'FAILED') {
        const updated = await updateLocalPaymentStatus(
            payment.id,
            PaymentStatus.FAILED,
            {
                callbackStatus,
                paymentID,
            },
        );

        return {
            status: 'FAILED',
            payment: updated,
        };
    }

    /*
     * IMPORTANT:
     *
     * bKash tokenized checkout requires EXECUTE
     * after successful customer checkout.
     */
    try {
        const executeResult = await executeBKashPayment(paymentID);

        const executeStatus = normalizeBKashStatus(
            executeResult.transactionStatus,
        );

        if (executeStatus === 'COMPLETED') {
            const activated = await processBKashResult(
                payment.id,
                executeResult,
            );

            return {
                status: 'COMPLETED',
                payment: activated,
            };
        }

        if (executeStatus === 'FAILED') {
            const failed = await processBKashResult(payment.id, executeResult);

            return {
                status: 'FAILED',
                payment: failed,
            };
        }

        if (executeStatus === 'CANCELLED') {
            const cancelled = await processBKashResult(
                payment.id,
                executeResult,
            );

            return {
                status: 'CANCELLED',
                payment: cancelled,
            };
        }
    } catch (error) {
        console.error(
            'bKash execute error:',
            error instanceof Error ? error.message : error,
        );
    }

    /*
     * Query payment as fallback / verification.
     */
    const queryResult = await queryBKashPayment(paymentID);

    const queryStatus = normalizeBKashStatus(queryResult.transactionStatus);

    if (queryStatus === 'COMPLETED') {
        const activated = await processBKashResult(payment.id, queryResult);

        return {
            status: 'COMPLETED',
            payment: activated,
        };
    }

    if (queryStatus === 'FAILED') {
        const failed = await processBKashResult(payment.id, queryResult);

        return {
            status: 'FAILED',
            payment: failed,
        };
    }

    if (queryStatus === 'CANCELLED') {
        const cancelled = await processBKashResult(payment.id, queryResult);

        return {
            status: 'CANCELLED',
            payment: cancelled,
        };
    }

    const pending = await processBKashResult(payment.id, queryResult);

    return {
        status: 'PENDING',
        payment: pending,
    };
};

const verifyBKashPaymentIntoDB = async (userId: string, paymentID: string) => {
    // 🔍 DEBUG: এই user-এর সব subscription payments দেখুন
    const allPayments = await prisma.subscriptionPayment.findMany({
        where: {
            userId,
        },
        select: {
            id: true,
            userId: true,
            merchantInvoiceNumber: true,
            bkashPaymentId: true,
            status: true,
            createdAt: true,
        },
    });

    console.log('USER PAYMENTS:', allPayments);

    // 🔍 এখন নির্দিষ্ট bKash payment খুঁজুন
    const payment = await prisma.subscriptionPayment.findFirst({
        where: {
            userId,
            bkashPaymentId: paymentID,
        },
    });

   

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    if (payment.status === PaymentStatus.PAID) {
        return {
            status: 'COMPLETED',
            payment,
        };
    }

    // বাকি আপনার existing verification code...

    let gatewayResult = await queryBKashPayment(paymentID);

    let status = normalizeBKashStatus(gatewayResult.transactionStatus);

    if (status === 'PENDING') {
        try {
            const executeResult = await executeBKashPayment(paymentID);

            gatewayResult = executeResult;

            status = normalizeBKashStatus(executeResult.transactionStatus);
        } catch (error) {
            console.error(
                'bKash execute during verification:',
                error instanceof Error ? error.message : error,
            );

            gatewayResult = await queryBKashPayment(paymentID);

            status = normalizeBKashStatus(gatewayResult.transactionStatus);
        }
    }

    const processed = await processBKashResult(payment.id, gatewayResult);

    return {
        status,
        payment: processed,
    };
};

const getSingleSubscriptionPaymentIntoDB = async (
    paymentId: string,
    userId?: string,
) => {
    const payment = await prisma.subscriptionPayment.findFirst({
        where: {
            id: paymentId,

            ...(userId
                ? {
                      userId,
                  }
                : {}),
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

const getMySubscriptionPaymentsIntoDB = async (
    userId: string,
    query: IQuery,
) => {
    const page = Math.max(Number(query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

    const skip = (page - 1) * limit;

    const search = query.search?.trim();

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

    const where: Prisma.SubscriptionPaymentWhereInput = {
        userId,

        ...(query.status
            ? {
                  status: query.status,
              }
            : {}),

        ...(query.paymentGateway
            ? {
                  paymentGateway: query.paymentGateway,
              }
            : {}),

        ...(search
            ? {
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
              }
            : {}),
    };

    const [data, total] = await Promise.all([
        prisma.subscriptionPayment.findMany({
            where,

            skip,

            take: limit,

            orderBy: {
                [sortBy]: sortOrder,
            },

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

            totalPage: Math.ceil(total / limit),
        },

        data,
    };
};

const getAllSubscriptionPaymentsIntoDB = async (query: IQuery) => {
    const page = Math.max(Number(query.page) || 1, 1);

    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);

    const skip = (page - 1) * limit;

    const search = query.search?.trim();

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

    const where: Prisma.SubscriptionPaymentWhereInput = {
        ...(query.status
            ? {
                  status: query.status,
              }
            : {}),

        ...(query.paymentGateway
            ? {
                  paymentGateway: query.paymentGateway,
              }
            : {}),

        ...(search
            ? {
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
              }
            : {}),
    };

    const [data, total] = await Promise.all([
        prisma.subscriptionPayment.findMany({
            where,

            skip,

            take: limit,

            orderBy: {
                [sortBy]: sortOrder,
            },

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

export const subscriptionPaymentServices = {
    createSubscriptionPaymentIntoDB,
    handleBKashCallbackIntoDB,
    verifyBKashPaymentIntoDB,
    getSingleSubscriptionPaymentIntoDB,
    getMySubscriptionPaymentsIntoDB,
    getAllSubscriptionPaymentsIntoDB,
};
