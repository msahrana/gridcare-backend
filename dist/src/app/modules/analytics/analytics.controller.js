"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const analytics_service_1 = require("./analytics.service");
const getOverviewAnalytics = (0, catchAsync_1.default)(async (req, res) => {
    const result = await analytics_service_1.analyticsServices.getOverviewAnalyticsFromDB({
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        areaId: req.query.areaId,
        zoneId: req.query.zoneId,
        feederId: req.query.feederId,
        technicianId: req.query.technicianId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Analytics overview retrieved successfully',
        data: result,
    });
});
const getOutageAnalytics = (0, catchAsync_1.default)(async (req, res) => {
    const result = await analytics_service_1.analyticsServices.getOutageAnalyticsFromDB({
        startDate: req.query.startDate,
        endDate: req.query.endDate,
        areaId: req.query.areaId,
        zoneId: req.query.zoneId,
        feederId: req.query.feederId,
        technicianId: req.query.technicianId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage analytics retrieved successfully',
        data: result,
    });
});
exports.analyticsControllers = {
    getOverviewAnalytics,
    getOutageAnalytics,
};
