"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feederControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const feeder_service_1 = require("./feeder.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const createFeeder = (0, catchAsync_1.default)(async (req, res) => {
    const result = await feeder_service_1.feederServices.createFeederIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Feeder created successfully!',
        data: result,
    });
});
const getAllFeeders = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const result = await feeder_service_1.feederServices.getAllFeedersFromDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Feeders retrieved successfully!',
        data: result,
    });
});
const getSingleFeeder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await feeder_service_1.feederServices.getSingleFeederFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Feeder retrieved successfully!',
        data: result,
    });
});
const updateFeeder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await feeder_service_1.feederServices.updateFeederIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Feeder updated successfully!',
        data: result,
    });
});
const deleteFeeder = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await feeder_service_1.feederServices.deleteFeederFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Feeder deleted successfully!',
        data: result,
    });
});
exports.feederControllers = {
    createFeeder,
    getAllFeeders,
    getSingleFeeder,
    updateFeeder,
    deleteFeeder,
};
