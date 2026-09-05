import { Payment } from '../../../generated/prisma/client';

export type ICreatePaymentPayload = {
    outageId: string;
    amount: number;
    currency?: string;
    paymentGateway?: 'BKASH' | 'STRIPE' | 'SSLCOMMERZ';
    payerReference?: string;
};

export type IUpdatePaymentStatusPayload = {
    status: 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
    transactionId?: string;
    bkashPaymentId?: string;
    bkashTrxId?: string;
    paidAt?: Date;
    gatewayResponse?: unknown;
};

export type IRefundPaymentPayload = {
    refundTrxId?: string;
    refundReason?: string;
    refundAmount?: number;
};

export type IPaymentResponse = Payment;
