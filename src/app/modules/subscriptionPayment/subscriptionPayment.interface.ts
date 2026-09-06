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
