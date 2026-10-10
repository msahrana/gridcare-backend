"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const enums_1 = require("../../../generated/prisma/enums");
const createSubscriptionPlanIntoDB = async (payload) => {
    const existingPlan = await prisma_1.prisma.subscriptionPlan.findFirst({
        where: {
            name: payload.name,
            deletedAt: null,
        },
    });
    if (existingPlan) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Subscription plan with this name already exists');
    }
    const result = await prisma_1.prisma.subscriptionPlan.create({
        data: {
            name: payload.name,
            description: payload.description,
            price: payload.price,
            durationDays: payload.durationDays,
            status: payload.status ?? enums_1.SubscriptionPlanStatus.ACTIVE,
        },
    });
    return result;
};
const getAllSubscriptionPlansFromDB = async (query) => {
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
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        }),
        ...(query.status && {
            status: query.status,
        }),
    };
    const [data, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.subscriptionPlan.findMany({
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
        prisma_1.prisma.subscriptionPlan.count({
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
const getSingleSubscriptionPlanFromDB = async (id) => {
    const result = await prisma_1.prisma.subscriptionPlan.findFirst({
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
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Subscription plan not found');
    }
    return result;
};
const updateSubscriptionPlanIntoDB = async (id, payload) => {
    const existingPlan = await prisma_1.prisma.subscriptionPlan.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingPlan) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Subscription plan not found');
    }
    if (payload.name && payload.name !== existingPlan.name) {
        const duplicatePlan = await prisma_1.prisma.subscriptionPlan.findFirst({
            where: {
                name: payload.name,
                id: {
                    not: id,
                },
                deletedAt: null,
            },
        });
        if (duplicatePlan) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Subscription plan with this name already exists');
        }
    }
    const result = await prisma_1.prisma.subscriptionPlan.update({
        where: {
            id,
        },
        data: payload,
    });
    return result;
};
const deleteSubscriptionPlanFromDB = async (id) => {
    const existingPlan = await prisma_1.prisma.subscriptionPlan.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingPlan) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Subscription plan not found');
    }
    const activeSubscriptions = await prisma_1.prisma.subscription.count({
        where: {
            planId: id,
            status: enums_1.SubscriptionStatus.ACTIVE,
        },
    });
    if (activeSubscriptions > 0) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot delete a plan with active subscriptions');
    }
    const result = await prisma_1.prisma.subscriptionPlan.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            status: enums_1.SubscriptionPlanStatus.INACTIVE,
        },
    });
    return result;
};
const createSubscriptionIntoDB = async (userId, payload) => {
    // =====================================================
    // 1. Check User
    // =====================================================
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // =====================================================
    // 2. Check Active Subscription Plan
    // =====================================================
    const plan = await prisma_1.prisma.subscriptionPlan.findFirst({
        where: {
            id: payload.planId,
            status: enums_1.SubscriptionPlanStatus.ACTIVE,
            deletedAt: null,
        },
    });
    if (!plan) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Active subscription plan not found');
    }
    // =====================================================
    // 3. Check Existing Active Subscription
    // =====================================================
    const activeSubscription = await prisma_1.prisma.subscription.findFirst({
        where: {
            userId,
            status: enums_1.SubscriptionStatus.ACTIVE,
            endDate: {
                gt: new Date(),
            },
        },
    });
    if (activeSubscription) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'You already have an active subscription');
    }
    // =====================================================
    // 4. Create Pending Subscription
    // =====================================================
    const result = await prisma_1.prisma.subscription.create({
        data: {
            userId,
            planId: plan.id,
            startDate: null,
            endDate: null,
            status: enums_1.SubscriptionStatus.ACTIVE,
        },
        include: {
            plan: true,
        },
    });
    return result;
};
const getMySubscriptionFromDB = async (userId) => {
    const subscription = await prisma_1.prisma.subscription.findFirst({
        where: {
            userId,
            status: enums_1.SubscriptionStatus.ACTIVE,
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
const getMySubscriptionHistoryFromDB = async (userId) => {
    const result = await prisma_1.prisma.subscription.findMany({
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
const cancelSubscriptionIntoDB = async (userId, subscriptionId) => {
    const subscription = await prisma_1.prisma.subscription.findFirst({
        where: {
            id: subscriptionId,
            userId,
            status: enums_1.SubscriptionStatus.ACTIVE,
        },
    });
    if (!subscription) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Active subscription not found');
    }
    const result = await prisma_1.prisma.subscription.update({
        where: {
            id: subscriptionId,
        },
        data: {
            status: enums_1.SubscriptionStatus.CANCELLED,
        },
    });
    return result;
};
exports.subscriptionServices = {
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
