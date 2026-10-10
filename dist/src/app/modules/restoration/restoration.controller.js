"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restorationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const restoration_service_1 = require("./restoration.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const startRestoration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.startRestorationIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Restoration started successfully',
        data: result,
    });
});
const completeRestoration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.completeRestorationIntoDB(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restoration completed successfully',
        data: result,
    });
});
const cancelRestoration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.cancelRestorationIntoDB(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restoration cancelled successfully',
        data: result,
    });
});
const getAllRestorations = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.getAllRestorationsFromDB({
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        searchTerm: req.query.searchTerm,
        status: req.query.status,
        technicianId: req.query.technicianId,
        outageId: req.query.outageId,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restorations retrieved successfully',
        data: result,
    });
});
const getSingleRestoration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.getSingleRestorationFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restoration retrieved successfully',
        data: result,
    });
});
const updateRestoration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.updateRestorationIntoDB(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restoration updated successfully',
        data: result,
    });
});
const deleteRestoration = (0, catchAsync_1.default)(async (req, res) => {
    const result = await restoration_service_1.restorationServices.deleteRestorationFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Restoration deleted successfully',
        data: result,
    });
});
exports.restorationControllers = {
    startRestoration,
    completeRestoration,
    cancelRestoration,
    getAllRestorations,
    getSingleRestoration,
    updateRestoration,
    deleteRestoration,
};
