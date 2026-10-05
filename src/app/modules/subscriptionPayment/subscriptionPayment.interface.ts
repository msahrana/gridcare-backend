import { PaymentGateway, PaymentStatus } from '../../../generated/prisma/enums';

export interface ICreateSubscriptionPaymentPayload {
    subscriptionId: string;
    paymentGateway?: PaymentGateway;
}

export interface IQuery {
    page?: string | number;
    limit?: string | number;
    search?: string;
    status?: PaymentStatus;
    paymentGateway?: PaymentGateway;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface IBKashCreateResponse {
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

export interface IBKashPaymentResponse {
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

export type BKashStatus =
    | 'COMPLETED'
    | 'FAILED'
    | 'CANCELLED'
    | 'PENDING'
    | 'UNKNOWN';
