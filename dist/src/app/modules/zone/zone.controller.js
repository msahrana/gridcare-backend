"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const sendResponse_1 = require("../../utils/sendResponse");
const zone_service_1 = require("./zone.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const createZone = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await zone_service_1.zoneServices.createZoneIntoDB(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Zone created successfully!',
        data: result,
    });
});
const getAllZones = (0, catchAsync_1.default)(async (req, res) => {
    const result = await zone_service_1.zoneServices.getAllZonesFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All zones retrieved successfully!',
        data: result,
    });
});
const getSingleZone = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await zone_service_1.zoneServices.getSingleZoneFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single zone retrieved successfully!',
        data: result,
    });
});
const updateZone = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await zone_service_1.zoneServices.updateZoneIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Zone updated successfully!',
        data: result,
    });
});
const deleteZone = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await zone_service_1.zoneServices.deleteZoneFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Zone deleted successfully!',
        data: result,
    });
});
exports.zoneControllers = {
    createZone,
    getAllZones,
    getSingleZone,
    updateZone,
    deleteZone,
};
