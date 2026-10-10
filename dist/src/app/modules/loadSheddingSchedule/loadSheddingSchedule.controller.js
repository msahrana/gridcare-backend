"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSheddingScheduleControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../utils/sendResponse");
const loadSheddingSchedule_service_1 = require("./loadSheddingSchedule.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const createdById = req.user?.id;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.createLoadSheddingScheduleIntoDB(createdById, {
        ...req.body,
        startTime: new Date(req.body.startTime),
        endTime: new Date(req.body.endTime),
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Load Shedding Schedule Created Successfully!',
        data: result,
    });
});
const getAllLoadSheddingSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.getAllLoadSheddingSchedulesFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Load Shedding Schedules Retrieved Successfully!',
        data: result,
    });
});
const getSingleLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.getSingleLoadSheddingScheduleFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Load Shedding Schedule Retrieved Successfully!',
        data: result,
    });
});
const updateLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.updateLoadSheddingScheduleIntoDB(id, {
        ...req.body,
        ...(req.body.startTime && {
            startTime: new Date(req.body.startTime),
        }),
        ...(req.body.endTime && {
            endTime: new Date(req.body.endTime),
        }),
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Load Shedding Schedule Updated Successfully!',
        data: result,
    });
});
const deleteLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await loadSheddingSchedule_service_1.loadSheddingScheduleServices.deleteLoadSheddingScheduleFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Load Shedding Schedule Deleted Successfully!',
        data: null,
    });
});
const publishLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.publishLoadSheddingScheduleIntoDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Load Shedding Schedule Published Successfully!',
        data: result,
    });
});
const activateLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.activateLoadSheddingScheduleIntoDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Load Shedding Schedule Activated Successfully!',
        data: result,
    });
});
const completeLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.completeLoadSheddingScheduleIntoDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Load Shedding Schedule Completed Successfully!',
        data: result,
    });
});
const cancelLoadSheddingSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.cancelLoadSheddingScheduleIntoDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Load Shedding Schedule Cancelled Successfully!',
        data: result,
    });
});
const getUpcomingLoadSheddingSchedules = (0, catchAsync_1.default)(async (req, res) => {
    const result = await loadSheddingSchedule_service_1.loadSheddingScheduleServices.getUpcomingLoadSheddingSchedulesFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Upcoming Load Shedding Schedules Retrieved Successfully!',
        data: result,
    });
});
exports.loadSheddingScheduleControllers = {
    createLoadSheddingSchedule,
    getAllLoadSheddingSchedules,
    getSingleLoadSheddingSchedule,
    updateLoadSheddingSchedule,
    deleteLoadSheddingSchedule,
    publishLoadSheddingSchedule,
    activateLoadSheddingSchedule,
    completeLoadSheddingSchedule,
    cancelLoadSheddingSchedule,
    getUpcomingLoadSheddingSchedules,
};
