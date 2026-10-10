"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const auditLog_service_1 = require("./auditLog.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
// ======================================================
// CREATE
// ======================================================
const createAuditLog = (0, catchAsync_1.default)(async (req, res) => {
    const actorId = req.user?.id;
    const result = await auditLog_service_1.auditLogServices.createAuditLogIntoDB(actorId, {
        ...req.body,
        ipAddress: req.body.ipAddress || req.ip || undefined,
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Audit Log Created Successfully!',
        data: result,
    });
});
// ======================================================
// GET ALL
// ======================================================
const getAllAuditLogs = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const result = await auditLog_service_1.auditLogServices.getAllAuditLogsFromDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Audit Logs Retrieved Successfully!',
        data: result,
    });
});
// ======================================================
// GET SINGLE
// ======================================================
const getSingleAuditLog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await auditLog_service_1.auditLogServices.getSingleAuditLogFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Audit Log Retrieved Successfully!',
        data: result,
    });
});
// ======================================================
// GET BY ENTITY
// ======================================================
const getAuditLogsByEntity = (0, catchAsync_1.default)(async (req, res) => {
    const { entity, entityId } = req.params;
    const result = await auditLog_service_1.auditLogServices.getAuditLogsByEntityFromDB(entity, entityId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Entity Audit Logs Retrieved Successfully!',
        data: result,
    });
});
// ======================================================
// DELETE
// ======================================================
const deleteAuditLog = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    await auditLog_service_1.auditLogServices.deleteAuditLogFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Audit Log Deleted Successfully!',
        data: null,
    });
});
exports.auditLogControllers = {
    createAuditLog,
    getAllAuditLogs,
    getSingleAuditLog,
    getAuditLogsByEntity,
    deleteAuditLog,
};
