import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import {
    ICreateSubscriptionPayload,
    ICreateSubscriptionPlanPayload,
    IQuery,
    IUpdateSubscriptionPlanPayload,
} from './subscription.interface';

import {
    SubscriptionPlanStatus,
    SubscriptionStatus,
} from '../../../generated/prisma/enums';

const createSubscriptionPlanIntoDB = async (
    payload: ICreateSubscriptionPlanPayload,
) => {
    const existingPlan = await prisma.subscriptionPlan.findFirst({
        where: {
            name: payload.name,
            deletedAt: null,
        },
    });

    if (existingPlan) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Subscription plan with this name already exists',
        );
    }

    const result = await prisma.subscriptionPlan.create({
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            durationDays: payload.durationDays,
            status: payload.status ?? SubscriptionPlanStatus.ACTIVE,
        },
    });

    return result;
};

const getAllSubscriptionPlansFromDB = async (query: IQuery) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const search = query.search?.trim();

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const allowedSortFields = [
        'createdAt',
        'updatedAt',
        'name',
        'price',
        'durationDays',
    ];

    const finalSortBy = allowedSortFields.includes(sortBy)
        ? sortBy
        : 'createdAt';

    const where = {
        deletedAt: null,

        ...(search && {
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive' as const,
                    },
                },
            ],
        }),

        ...(query.status && {
            status: query.status as SubscriptionPlanStatus,
        }),
    };

    const [data, total] = await prisma.$transaction([
        prisma.subscriptionPlan.findMany({
            where,
            skip,
            take: limit,

            orderBy: {
                [finalSortBy]: sortOrder,
            },

            include: {
                _count: {
                    select: {
                        subscriptions: true,
                    },
                },
            },
        }),

        prisma.subscriptionPlan.count({
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

const getSingleSubscriptionPlanFromDB = async (id: string) => {
    const result = await prisma.subscriptionPlan.findFirst({
        where: {
            id,
            deletedAt: null,
        },

        include: {
            _count: {
                select: {
                    subscriptions: true,
                },
            },
        },
    });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription plan not found');
    }

    return result;
};

const updateSubscriptionPlanIntoDB = async (
    id: string,
    payload: IUpdateSubscriptionPlanPayload,
) => {
    const existingPlan = await prisma.subscriptionPlan.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingPlan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription plan not found');
    }

    if (payload.name && payload.name !== existingPlan.name) {
        const duplicatePlan = await prisma.subscriptionPlan.findFirst({
            where: {
                name: payload.name,
                id: {
                    not: id,
                },
                deletedAt: null,
            },
        });

        if (duplicatePlan) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Subscription plan with this name already exists',
            );
        }
    }

    const result = await prisma.subscriptionPlan.update({
        where: {
            id,
        },

        data: payload,
    });

    return result;
};

const deleteSubscriptionPlanFromDB = async (id: string) => {
    const existingPlan = await prisma.subscriptionPlan.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingPlan) {
        throw new AppError(httpStatus.NOT_FOUND, 'Subscription plan not found');
    }

    const activeSubscriptions = await prisma.subscription.count({
        where: {
            planId: id,
            status: SubscriptionStatus.ACTIVE,
        },
    });

    if (activeSubscriptions > 0) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot delete a plan with active subscriptions',
        );
    }

    const result = await prisma.subscriptionPlan.update({
        where: {
            id,
        },

        data: {
            deletedAt: new Date(),
            status: SubscriptionPlanStatus.INACTIVE,
        },
    });

    return result;
};

const createSubscriptionIntoDB = async (
    userId: string,
    payload: ICreateSubscriptionPayload,
) => {
    // =====================================================
    // 1. Check User
    // =====================================================

    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    // =====================================================
    // 2. Check Active Subscription Plan
    // =====================================================

    const plan = await prisma.subscriptionPlan.findFirst({
        where: {
            id: payload.planId,
            status: SubscriptionPlanStatus.ACTIVE,
            deletedAt: null,
        },
    });

    if (!plan) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Active subscription plan not found',
        );
    }

    // =====================================================
    // 3. Check Existing Active Subscription
    // =====================================================

    const activeSubscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
            endDate: {
                gt: new Date(),
            },
        },
    });

    if (activeSubscription) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'You already have an active subscription',
        );
    }

    // =====================================================
    // 4. Create Pending Subscription
    // =====================================================

    const result = await prisma.subscription.create({
        data: {
            userId,
            planId: plan.id,
            startDate: null,
            endDate: null,
            status: SubscriptionStatus.PENDING,
        },

        include: {
            plan: true,
        },
    });

    return result;
};

const getMySubscriptionFromDB = async (userId: string) => {
    const subscription = await prisma.subscription.findFirst({
        where: {
            userId,
            status: SubscriptionStatus.ACTIVE,
            endDate: {
                gt: new Date(),
            },
        },

        include: {
            plan: true,
            payments: true,
        },

        orderBy: {
            endDate: 'desc',
        },
    });

    return subscription;
};

const getMySubscriptionHistoryFromDB = async (userId: string) => {
    const result = await prisma.subscription.findMany({
        where: {
            userId,
        },

        include: {
            plan: true,
            payments: true,
        },

        orderBy: {
            createdAt: 'desc',
        },
    });

    return result;
};

const cancelSubscriptionIntoDB = async (
    userId: string,
    subscriptionId: string,
) => {
    const subscription = await prisma.subscription.findFirst({
        where: {
            id: subscriptionId,
            userId,
            status: SubscriptionStatus.ACTIVE,
        },
    });

    if (!subscription) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Active subscription not found',
        );
    }

    const result = await prisma.subscription.update({
        where: {
            id: subscriptionId,
        },

        data: {
            status: SubscriptionStatus.CANCELLED,
        },
    });

    return result;
};

export const subscriptionServices = {
    createSubscriptionPlanIntoDB,
    getAllSubscriptionPlansFromDB,
    getSingleSubscriptionPlanFromDB,
    updateSubscriptionPlanIntoDB,
    deleteSubscriptionPlanFromDB,
    createSubscriptionIntoDB,
    getMySubscriptionFromDB,
    getMySubscriptionHistoryFromDB,
    cancelSubscriptionIntoDB,
};
