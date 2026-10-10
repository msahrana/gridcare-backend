"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.substationControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const substation_service_1 = require("./substation.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const createSubstation = (0, catchAsync_1.default)(async (req, res) => {
    const result = await substation_service_1.substationServices.createSubstationIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Substation created successfully!',
        data: result,
    });
});
const getAllSubstations = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const result = await substation_service_1.substationServices.getAllSubstationsFromDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Substations retrieved successfully!',
        data: result.data,
        meta: result.meta,
    });
});
const getSingleSubstation = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await substation_service_1.substationServices.getSingleSubstationFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Substation retrieved successfully!',
        data: result,
    });
});
const updateSubstation = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await substation_service_1.substationServices.updateSubstationIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Substation updated successfully!',
        data: result,
    });
});
/**
 * Delete Substation
 */
const deleteSubstation = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await substation_service_1.substationServices.deleteSubstationFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Substation deleted successfully!',
        data: result,
    });
});
exports.substationControllers = {
    createSubstation,
    getAllSubstations,
    getSingleSubstation,
    updateSubstation,
    deleteSubstation,
};
