import httpStatus from 'http-status';
import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import {
    ICreatePaymentPayload,
    IRefundPaymentPayload,
    IUpdatePaymentStatusPayload,
} from './payment.interface';

/**
 * Generate Invoice
 */
const generateInvoiceNumber = () => {
    const timestamp = Date.now();

    const random = Math.floor(1000 + Math.random() * 9000);

    return `GRIDCARE-${timestamp}-${random}`;
};

/**
 * Create Payment
 */
const createPaymentIntoDB = async (
    userId: string,
    payload: ICreatePaymentPayload,
) => {
    const { outageId, amount, currency, paymentGateway, payerReference } =
        payload;

    // Check user
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // Check outage
    const outage = await prisma.outage.findUnique({
        where: {
            id: outageId,
        },
    });

    if (!outage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
    }

    // Check existing pending payment
    const existingPayment = await prisma.payment.findFirst({
        where: {
            userId,
            outageId,
            status: 'PENDING',
        },
    });

    if (existingPayment) {
        return existingPayment;
    }

    const merchantInvoiceNumber = generateInvoiceNumber();

    const payment = await prisma.payment.create({
        data: {
            userId,
            outageId,
            amount: new Prisma.Decimal(amount),
            currency: currency ?? 'BDT',
            paymentGateway: paymentGateway ?? 'BKASH',
            status: 'PENDING',
            merchantInvoiceNumber,
            payerReference,
        },
        include: {
            outage: true,
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });

    return payment;
};

/**
 * Get all payments
 */
const getAllPaymentsFromDB = async (query: any) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    const skip = (page - 1) * limit;

    const searchTerm = query.searchTerm?.trim();

    const where: Prisma.PaymentWhereInput = {
        ...(searchTerm
            ? {
                  OR: [
                      {
                          merchantInvoiceNumber: {
                              contains: searchTerm,
                              mode: 'insensitive',
                          },
                      },
                      {
                          bkashPaymentId: {
                              contains: searchTerm,
                              mode: 'insensitive',
                          },
                      },
                      {
                          bkashTrxId: {
                              contains: searchTerm,
                              mode: 'insensitive',
                          },
                      },
                      {
                          payerReference: {
                              contains: searchTerm,
                              mode: 'insensitive',
                          },
                      },
                  ],
              }
            : {}),

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

        ...(query.userId
            ? {
                  userId: query.userId,
              }
            : {}),

        ...(query.outageId
            ? {
                  outageId: query.outageId,
              }
            : {}),
    };

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
                outage: true,
            },
        }),

        prisma.payment.count({
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
        data: payments,
    };
};

/**
 * Get single payment
 */
const getSinglePaymentFromDB = async (id: string) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
            outage: true,
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    return payment;
};

/**
 * Get my payments
 */
const getMyPaymentsFromDB = async (userId: string, query: any) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
        prisma.payment.findMany({
            where: {
                userId,
            },
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                outage: true,
            },
        }),

        prisma.payment.count({
            where: {
                userId,
            },
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: payments,
    };
};

/**
 * Update payment status
 */
const updatePaymentStatusIntoDB = async (
    id: string,
    payload: IUpdatePaymentStatusPayload,
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id,
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    const updatedPayment = await prisma.payment.update({
        where: {
            id,
        },
        data: {
            status: payload.status,
            transactionId: payload.transactionId,
            bkashPaymentId: payload.bkashPaymentId,
            bkashTrxId: payload.bkashTrxId,
            paidAt:
                payload.status === 'PAID'
                    ? (payload.paidAt ?? new Date())
                    : undefined,
            gatewayResponse: payload.gatewayResponse as Prisma.InputJsonValue,
        },
    });

    return updatedPayment;
};

/**
 * Refund payment
 */
const refundPaymentIntoDB = async (
    id: string,
    payload: IRefundPaymentPayload,
) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id,
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    if (payment.status !== 'PAID') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only paid payments can be refunded',
        );
    }

    const refundAmount = payload.refundAmount ?? Number(payment.amount);

    if (refundAmount > Number(payment.amount)) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Refund amount cannot exceed payment amount',
        );
    }

    const updatedPayment = await prisma.payment.update({
        where: {
            id,
        },
        data: {
            status: 'REFUNDED',
            refundTrxId: payload.refundTrxId,
            refundReason: payload.refundReason,
            refundAmount: new Prisma.Decimal(refundAmount),
            refundedAt: new Date(),
        },
    });

    return updatedPayment;
};

/**
 * Delete payment
 */
const deletePaymentFromDB = async (id: string) => {
    const payment = await prisma.payment.findUnique({
        where: {
            id,
        },
    });

    if (!payment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Payment not found');
    }

    await prisma.payment.delete({
        where: {
            id,
        },
    });

    return null;
};

export const paymentServices = {
    createPaymentIntoDB,
    getAllPaymentsFromDB,
    getSinglePaymentFromDB,
    getMyPaymentsFromDB,
    updatePaymentStatusIntoDB,
    refundPaymentIntoDB,
    deletePaymentFromDB,
};
