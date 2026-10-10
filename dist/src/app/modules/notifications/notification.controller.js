"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notificationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const notification_service_1 = require("./notification.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
// ======================================================
// CREATE
// ======================================================
const createNotification = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notification_service_1.notificationServices.createNotificationIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Notification Created Successfully!',
        data: result,
    });
});
// ======================================================
// GET MY NOTIFICATIONS
// ======================================================
const getMyNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await notification_service_1.notificationServices.getMyNotificationsFromDB(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Notifications Retrieved Successfully!',
        data: result.data,
    });
});
// ======================================================
// GET UNREAD
// ======================================================
const getMyUnreadNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await notification_service_1.notificationServices.getMyUnreadNotificationsFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Unread Notifications Retrieved Successfully!',
        data: result,
    });
});
// ======================================================
// GET ALL
// ======================================================
const getAllNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const result = await notification_service_1.notificationServices.getAllNotificationsFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Notifications Retrieved Successfully!',
        data: result,
    });
});
// ======================================================
// GET SINGLE
// ======================================================
const getSingleNotification = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    const result = await notification_service_1.notificationServices.getSingleNotificationFromDB(userId, id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Notification Retrieved Successfully!',
        data: result,
    });
});
// ======================================================
// MARK AS READ
// ======================================================
const markNotificationAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await notification_service_1.notificationServices.markNotificationAsReadIntoDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification Marked As Read!',
        data: result,
    });
});
// ======================================================
// MARK ALL AS READ
// ======================================================
const markAllNotificationsAsRead = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await notification_service_1.notificationServices.markAllNotificationsAsReadIntoDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Notifications Marked As Read!',
        data: result,
    });
});
// ======================================================
// DELETE
// ======================================================
const deleteNotification = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { id } = req.params;
    await notification_service_1.notificationServices.deleteNotificationFromDB(userId, id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Notification Deleted Successfully!',
        data: null,
    });
});
// ======================================================
// DELETE ALL READ
// ======================================================
const deleteAllReadNotifications = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await notification_service_1.notificationServices.deleteAllReadNotificationsFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Read Notifications Deleted Successfully!',
        data: result,
    });
});
exports.notificationControllers = {
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
