"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
// ======================================================
// CREATE NOTIFICATION
// ======================================================
const createNotificationIntoDB = async (payload) => {
    const { userId, title, message } = payload;
    // Check user
    const user = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    const notification = await prisma_1.prisma.notification.create({
        data: {
            userId,
            title,
            message,
        },
    });
    return notification;
};
// ======================================================
// GET MY NOTIFICATIONS
// ======================================================
const getMyNotificationsFromDB = async (userId, query) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    const notifications = await prisma_1.prisma.notification.findMany({
        where: {
            userId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        skip,
        take: limit,
    });
    const total = await prisma_1.prisma.notification.count({
        where: {
            userId,
        },
    });
    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: notifications,
    };
};
// ======================================================
// GET MY UNREAD NOTIFICATIONS
// ======================================================
const getMyUnreadNotificationsFromDB = async (userId) => {
    const notifications = await prisma_1.prisma.notification.findMany({
        where: {
            userId,
            isRead: false,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return notifications;
};
// ======================================================
// GET ALL NOTIFICATION
// ======================================================
const getAllNotificationsFromDB = async (query) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm?.trim();
    const where = {
        ...(searchTerm
            ? {
                OR: [
                    {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                    {
                        message: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                ],
            }
            : {}),
    };
    const [notifications, total] = await Promise.all([
        prisma_1.prisma.notification.findMany({
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
            },
        }),
        prisma_1.prisma.notification.count({
            where,
        }),
    ]);
    return {
        data: notifications,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
// ======================================================
// GET SINGLE NOTIFICATION
// ======================================================
const getSingleNotificationFromDB = async (userId, notificationId) => {
    const notification = await prisma_1.prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId,
        },
    });
    if (!notification) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Notification not found');
    }
    return notification;
};
// ======================================================
// MARK AS READ
// ======================================================
const markNotificationAsReadIntoDB = async (notificationId) => {
    const notification = await prisma_1.prisma.notification.findUnique({
        where: {
            id: notificationId,
        },
    });
    if (!notification) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Notification not found');
    }
    return prisma_1.prisma.notification.update({
        where: {
            id: notificationId,
        },
        data: {
            isRead: true,
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
        },
    });
};
// ======================================================
// MARK ALL AS READ
// ======================================================
const markAllNotificationsAsReadIntoDB = async (userId) => {
    const result = await prisma_1.prisma.notification.updateMany({
        where: {
            userId,
            isRead: false,
        },
        data: {
            isRead: true,
        },
    });
    return {
        count: result.count,
    };
};
// ======================================================
// DELETE NOTIFICATION
// ======================================================
const deleteNotificationFromDB = async (userId, notificationId) => {
    const notification = await prisma_1.prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId,
        },
    });
    if (!notification) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Notification not found');
    }
    await prisma_1.prisma.notification.delete({
        where: {
            id: notificationId,
        },
    });
    return null;
};
// ======================================================
// DELETE ALL READ NOTIFICATIONS
// ======================================================
const deleteAllReadNotificationsFromDB = async (userId) => {
    const result = await prisma_1.prisma.notification.deleteMany({
        where: {
            userId,
            isRead: true,
        },
    });
    return {
        count: result.count,
    };
};
exports.notificationServices = {
    createNotificationIntoDB,
    getMyNotificationsFromDB,
    getMyUnreadNotificationsFromDB,
    getAllNotificationsFromDB,
    getSingleNotificationFromDB,
    markNotificationAsReadIntoDB,
    markAllNotificationsAsReadIntoDB,
    deleteNotificationFromDB,
    deleteAllReadNotificationsFromDB,
};
