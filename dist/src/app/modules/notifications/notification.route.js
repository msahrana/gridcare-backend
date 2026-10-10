"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationRoutes = void 0;
const express_1 = require("express");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const notification_controller_1 = require("./notification.controller");
const notification_validation_1 = require("./notification.validation");
const router = (0, express_1.Router)();
// ======================================================
// ADMIN / OPERATOR CREATE NOTIFICATION
// ======================================================
router.post('/', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(notification_validation_1.NotificationValidation.createNotificationValidationSchema), notification_controller_1.notificationControllers.createNotification);
// ======================================================
// MY NOTIFICATIONS
// ======================================================
router.get('/my', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.getMyNotifications);
// ======================================================
// MY UNREAD NOTIFICATIONS
// ======================================================
router.get('/my/unread', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.getMyUnreadNotifications);
// ======================================================
// MARK ALL AS READ
// ======================================================
router.patch('/my/read-all', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.markAllNotificationsAsRead);
// ======================================================
// DELETE ALL READ
// ======================================================
router.delete('/my/read', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.deleteAllReadNotifications);
// ======================================================
// MARK SINGLE AS READ
// ======================================================
router.patch('/:id/read', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.markNotificationAsRead);
// ======================================================
// GET ALL
// ======================================================
router.get('/', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.getAllNotifications);
// ======================================================
// GET SINGLE
// ======================================================
router.get('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.getSingleNotification);
// ======================================================
// DELETE SINGLE
// ======================================================
router.delete('/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), notification_controller_1.notificationControllers.deleteNotification);
exports.notificationRoutes = router;
