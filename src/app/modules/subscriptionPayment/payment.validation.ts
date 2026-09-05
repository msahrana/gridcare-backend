import { z } from 'zod';

const createPaymentValidationSchema = z.object({
    outageId: z
        .string({
            message: 'Outage ID is required',
        })
        .min(1, 'Outage ID is required'),

    amount: z
        .number({
            message: 'Amount is required',
        })
        .positive('Amount must be greater than 0'),

    currency: z
        .string()
        .min(3, 'Currency must be at least 3 characters')
        .max(10, 'Currency cannot exceed 10 characters')
        .optional(),

    paymentGateway: z.enum(['BKASH', 'STRIPE']).optional(),

    payerReference: z
        .string()
        .max(100, 'Payer reference cannot exceed 100 characters')
        .optional(),
});

const updatePaymentStatusValidationSchema = z.object({
    status: z.enum(['PENDING', 'PAID', 'FAILED', 'CANCELLED', 'REFUNDED']),

    transactionId: z.string().optional(),

    bkashPaymentId: z.string().optional(),

    bkashTrxId: z.string().optional(),

    paidAt: z.coerce.date().optional(),

    gatewayResponse: z.unknown().optional(),
});

const refundPaymentValidationSchema = z.object({
    refundTrxId: z.string().optional(),

    refundReason: z
        .string()
        .max(500, 'Refund reason cannot exceed 500 characters')
        .optional(),

    refundAmount: z
        .number()
        .positive('Refund amount must be greater than 0')
        .optional(),
});

export const PaymentValidation = {
    createPaymentValidationSchema,
    updatePaymentStatusValidationSchema,
    refundPaymentValidationSchema,
};
