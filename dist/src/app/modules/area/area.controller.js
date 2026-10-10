"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const area_service_1 = require("./area.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const createArea = (0, catchAsync_1.default)(async (req, res) => {
    const result = await area_service_1.areaServices.createAreaIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Area created successfully!',
        data: result,
    });
});
const getAllAreas = (0, catchAsync_1.default)(async (req, res) => {
    const result = await area_service_1.areaServices.getAllAreasFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Areas retrieved successfully!',
        data: result.data,
        meta: result.meta,
    });
});
const getAreaById = (0, catchAsync_1.default)(async (req, res) => {
    const result = await area_service_1.areaServices.getAreaByIdFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Area retrieved successfully!',
        data: result,
    });
});
const updateArea = (0, catchAsync_1.default)(async (req, res) => {
    const result = await area_service_1.areaServices.updateAreaIntoDB(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Area updated successfully!',
        data: result,
    });
});
const deleteArea = (0, catchAsync_1.default)(async (req, res) => {
    await area_service_1.areaServices.deleteAreaFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Area deleted successfully!',
        data: null,
    });
});
const searchAreas = (0, catchAsync_1.default)(async (req, res) => {
    const result = await area_service_1.areaServices.searchAreasFromDB(req.query.q);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Areas search completed successfully!',
        data: result,
    });
});
exports.areaControllers = {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea,
    searchAreas,
};
