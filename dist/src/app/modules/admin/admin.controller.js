"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const admin_service_1 = require("./admin.service");
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.adminServices.getAllUsersFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Users retrieved successfully!',
        data: result,
    });
});
const updateUserRole = (0, catchAsync_1.default)(async (req, res) => {
    const adminId = req.user?.id;
    const userId = req.params.id;
    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();
    const result = await admin_service_1.adminServices.updateUserRoleIntoDB(adminId, userId, req.body, ipAddress);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User role updated successfully!',
        data: result,
    });
});
const getDashboardStats = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await admin_service_1.adminServices.getAdminDashboardStatsFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin dashboard statistics retrieved successfully!',
        data: result,
    });
});
const getAuditLogs = (0, catchAsync_1.default)(async (req, res) => {
    const result = await admin_service_1.adminServices.getAuditLogsFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Audit logs retrieved successfully!',
        data: result,
    });
});
exports.adminControllers = {
    getAllUsers,
    updateUserRole,
    getDashboardStats,
    getAuditLogs,
};
