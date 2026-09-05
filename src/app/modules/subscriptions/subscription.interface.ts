import {
    SubscriptionPlanStatus,
    SubscriptionStatus,
} from '../../../generated/prisma/enums';

export interface ICreateSubscriptionPlanPayload {
    name: string;
    description?: string;
    price: number;
    durationDays: number;
    status?: SubscriptionPlanStatus;
}

export interface IUpdateSubscriptionPlanPayload {
    name?: string;
    description?: string;
    price?: number;
    durationDays?: number;
    status?: SubscriptionPlanStatus;
}

export interface IQuery {
    page?: string;
    limit?: string;
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface ICreateSubscriptionPayload {
    planId: string;
}

export interface IUpdateSubscriptionStatusPayload {
    status: SubscriptionStatus;
}
