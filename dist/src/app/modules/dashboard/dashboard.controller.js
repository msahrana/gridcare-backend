"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const dashboard_service_1 = require("./dashboard.service");
const getAdminDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.dashboardServices.getAdminDashboardFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Admin dashboard retrieved successfully',
        data: result,
    });
});
const getOperatorDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.dashboardServices.getOperatorDashboardFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Operator dashboard retrieved successfully',
        data: result,
    });
});
const getTechnicianDashboard = (0, catchAsync_1.default)(async (req, res) => {
    const result = await dashboard_service_1.dashboardServices.getTechnicianDashboardFromDB(req.params.technicianId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician dashboard retrieved successfully',
        data: result,
    });
});
exports.dashboardControllers = {
    getAdminDashboard,
    getOperatorDashboard,
    getTechnicianDashboard,
};
