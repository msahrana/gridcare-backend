import httpStatus from 'http-status';

import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import { ICreateNotificationPayload } from './notification.interface';

// ======================================================
// CREATE NOTIFICATION
// ======================================================

const createNotificationIntoDB = async (
    payload: ICreateNotificationPayload,
) => {
    const { userId, title, message } = payload;

    // Check user
    const user = await prisma.user.findUnique({
        where: {
            id: userId,
        },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    const notification = await prisma.notification.create({
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

const getMyNotificationsFromDB = async (userId: string, query: any) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;

    const skip = (page - 1) * limit;

    const notifications = await prisma.notification.findMany({
        where: {
            userId,
        },

        orderBy: {
            createdAt: 'desc',
        },

        skip,
        take: limit,
    });

    const total = await prisma.notification.count({
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

const getMyUnreadNotificationsFromDB = async (userId: string) => {
    const notifications = await prisma.notification.findMany({
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

const getAllNotificationsFromDB = async (query: any) => {
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
                              mode: 'insensitive' as const,
                          },
                      },
                      {
                          message: {
                              contains: searchTerm,
                              mode: 'insensitive' as const,
                          },
                      },
                  ],
              }
            : {}),
    };

    const [notifications, total] = await Promise.all([
        prisma.notification.findMany({
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

        prisma.notification.count({
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
        data: notifications,
    };
};

// ======================================================
// GET SINGLE NOTIFICATION
// ======================================================

const getSingleNotificationFromDB = async (
    userId: string,
    notificationId: string,
) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId,
        },
    });

    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }

    return notification;
};

// ======================================================
// MARK AS READ
// ======================================================

const markNotificationAsReadIntoDB = async (
    userId: string,
    notificationId: string,
) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId,
        },
    });

    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }

    const result = await prisma.notification.update({
        where: {
            id: notificationId,
        },

        data: {
            isRead: true,
        },
    });

    return result;
};

// ======================================================
// MARK ALL AS READ
// ======================================================

const markAllNotificationsAsReadIntoDB = async (userId: string) => {
    const result = await prisma.notification.updateMany({
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

const deleteNotificationFromDB = async (
    userId: string,
    notificationId: string,
) => {
    const notification = await prisma.notification.findFirst({
        where: {
            id: notificationId,
            userId,
        },
    });

    if (!notification) {
        throw new AppError(httpStatus.NOT_FOUND, 'Notification not found');
    }

    await prisma.notification.delete({
        where: {
            id: notificationId,
        },
    });

    return null;
};

// ======================================================
// DELETE ALL READ NOTIFICATIONS
// ======================================================

const deleteAllReadNotificationsFromDB = async (userId: string) => {
    const result = await prisma.notification.deleteMany({
        where: {
            userId,
            isRead: true,
        },
    });

    return {
        count: result.count,
    };
};

export const notificationServices = {
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
