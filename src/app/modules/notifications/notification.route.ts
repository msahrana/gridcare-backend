import { Router } from 'express';

import { UserRole } from '../../../generated/prisma/enums';

import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

import { notificationControllers } from './notification.controller';
import { NotificationValidation } from './notification.validation';

const router = Router();

// ======================================================
// ADMIN / OPERATOR CREATE NOTIFICATION
// ======================================================

router.post(
    '/',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    validateRequest(NotificationValidation.createNotificationValidationSchema),
    notificationControllers.createNotification,
);

// ======================================================
// MY NOTIFICATIONS
// ======================================================

router.get(
    '/my',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.getMyNotifications,
);

// ======================================================
// MY UNREAD NOTIFICATIONS
// ======================================================

router.get(
    '/my/unread',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.getMyUnreadNotifications,
);

// ======================================================
// MARK ALL AS READ
// ======================================================

router.patch(
    '/my/read-all',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.markAllNotificationsAsRead,
);

// ======================================================
// DELETE ALL READ
// ======================================================

router.delete(
    '/my/read',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.deleteAllReadNotifications,
);

// ======================================================
// MARK SINGLE AS READ
// ======================================================

router.patch(
    '/:id/read',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.markNotificationAsRead,
);

// ======================================================
// GET ALL
// ======================================================

router.get(
    '/',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.getAllNotifications,
);

// ======================================================
// GET SINGLE
// ======================================================

router.get(
    '/:id',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.getSingleNotification,
);

// ======================================================
// DELETE SINGLE
// ======================================================

router.delete(
    '/:id',
    auth(
        UserRole.ADMIN,
        UserRole.OPERATOR,
        UserRole.TECHNICIAN,
        UserRole.CUSTOMER,
    ),
    notificationControllers.deleteNotification,
);

export const notificationRoutes = router;
