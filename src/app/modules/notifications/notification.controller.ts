import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { notificationServices } from './notification.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

// ======================================================
// CREATE
// ======================================================

const createNotification = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.createNotificationIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Notification Created Successfully!',
        data: result,
    });
});

// ======================================================
// GET MY NOTIFICATIONS
// ======================================================

const getMyNotifications = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await notificationServices.getMyNotificationsFromDB(
        userId as string,
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Notifications Retrieved Successfully!',
        data: result.data,
    });
});

// ======================================================
// GET UNREAD
// ======================================================

const getMyUnreadNotifications = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;

        const result =
            await notificationServices.getMyUnreadNotificationsFromDB(
                userId as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Unread Notifications Retrieved Successfully!',
            data: result,
        });
    },
);

// ======================================================
// GET ALL
// ======================================================

const getAllNotifications = catchAsync(async (req: Request, res: Response) => {
    const result = await notificationServices.getAllNotificationsFromDB(
        req.query,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Notifications Retrieved Successfully!',
        data: result.data,
    });
});

// ======================================================
// GET SINGLE
// ======================================================

const getSingleNotification = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;
        const { id } = req.params;

        const result = await notificationServices.getSingleNotificationFromDB(
            userId as string,
            id as string,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Single Notification Retrieved Successfully!',
            data: result,
        });
    },
);

// ======================================================
// MARK AS READ
// ======================================================

const markNotificationAsRead = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;
        const { id } = req.params;

        const result = await notificationServices.markNotificationAsReadIntoDB(
            userId as string,
            id as string,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Notification Marked As Read!',
            data: result,
        });
    },
);

// ======================================================
// MARK ALL AS READ
// ======================================================

const markAllNotificationsAsRead = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;

        const result =
            await notificationServices.markAllNotificationsAsReadIntoDB(
                userId as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'All Notifications Marked As Read!',
            data: result,
        });
    },
);

// ======================================================
// DELETE
// ======================================================

const deleteNotification = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { id } = req.params;

    await notificationServices.deleteNotificationFromDB(
        userId as string,
        id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Notification Deleted Successfully!',
        data: null,
    });
});

// ======================================================
// DELETE ALL READ
// ======================================================

const deleteAllReadNotifications = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;

        const result =
            await notificationServices.deleteAllReadNotificationsFromDB(
                userId as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'All Read Notifications Deleted Successfully!',
            data: result,
        });
    },
);

export const notificationControllers = {
    createNotification,
    getMyNotifications,
    getMyUnreadNotifications,
    getSingleNotification,
    getAllNotifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    deleteNotification,
    deleteAllReadNotifications,
};
