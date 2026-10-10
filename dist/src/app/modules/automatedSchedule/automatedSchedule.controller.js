"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.automatedScheduleControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const automatedSchedule_service_1 = require("./automatedSchedule.service");
const generateSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const result = await automatedSchedule_service_1.automatedScheduleServices.generateSchedulesIntoDB(req.user.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Automated schedules generated successfully',
        data: result,
    });
});
const getSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const result = await automatedSchedule_service_1.automatedScheduleServices.getGeneratedSchedulesFromDB({
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        searchTerm: req.query.searchTerm,
        areaId: req.query.areaId,
        status: req.query.status,
        startDate: req.query.startDate,
        endDate: req.query.endDate,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Automated schedules retrieved successfully',
        data: result,
    });
});
const getSingleSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const result = await automatedSchedule_service_1.automatedScheduleServices.getSingleGeneratedScheduleFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Automated schedule retrieved successfully',
        data: result,
    });
});
const publishSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const result = await automatedSchedule_service_1.automatedScheduleServices.publishGeneratedScheduleIntoDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Schedule published successfully',
        data: result,
    });
});
const cancelSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const result = await automatedSchedule_service_1.automatedScheduleServices.cancelGeneratedScheduleIntoDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Schedule cancelled successfully',
        data: result,
    });
});
exports.automatedScheduleControllers = {
    generateSchedules,
    getSchedules,
    getSingleSchedule,
    publishSchedule,
    cancelSchedule,
};
