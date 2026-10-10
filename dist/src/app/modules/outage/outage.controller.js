"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outageControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const outage_service_1 = require("./outage.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const createOutage = (0, catchAsync_1.default)(async (req, res) => {
    const result = await outage_service_1.outageServices.createOutageIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Outage created successfully',
        data: result,
    });
});
const getAllOutages = (0, catchAsync_1.default)(async (req, res) => {
    const { page, limit, search, areaId, status, type, priority } = req.query;
    const result = await outage_service_1.outageServices.getAllOutagesFromDB({
        page: page ? Number(page) : 1,
        limit: limit ? Number(limit) : 10,
        search: search ? String(search) : undefined,
        areaId: areaId ? String(areaId) : undefined,
        status: status
            ? String(status).toUpperCase()
            : undefined,
        type: type ? String(type).toUpperCase() : undefined,
        priority: priority
            ? String(priority).toUpperCase()
            : undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Outages retrieved successfully',
        data: result,
    });
});
const getSingleOutage = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outage_service_1.outageServices.getSingleOutageFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Outage retrieved successfully',
        data: result,
    });
});
const updateOutage = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outage_service_1.outageServices.updateOutageIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage updated successfully',
        data: result,
    });
});
const deleteOutage = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outage_service_1.outageServices.deleteOutageFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage deleted successfully',
        data: result,
    });
});
const searchOutages = (0, catchAsync_1.default)(async (req, res) => {
    const searchTerm = String(req.query.search ?? '');
    const result = await outage_service_1.outageServices.searchOutagesFromDB(searchTerm);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outages searched successfully',
        data: result,
    });
});
const getActiveOutages = (0, catchAsync_1.default)(async (_req, res) => {
    const result = await outage_service_1.outageServices.getActiveOutagesFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Active outages retrieved successfully',
        data: result,
    });
});
const getOutagesByArea = (0, catchAsync_1.default)(async (req, res) => {
    const { areaId } = req.params;
    const result = await outage_service_1.outageServices.getOutagesByAreaFromDB(areaId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Area outages retrieved successfully',
        data: result,
    });
});
exports.outageControllers = {
    createOutage,
    getAllOutages,
    getSingleOutage,
    updateOutage,
    deleteOutage,
    searchOutages,
    getActiveOutages,
    getOutagesByArea,
};
