"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outageAssignmentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const outageAssignment_service_1 = require("./outageAssignment.service");
const sendResponse_1 = require("../../utils/sendResponse");
const createOutageAssignment = (0, catchAsync_1.default)(async (req, res) => {
    const assignedById = req.user?.id;
    const result = await outageAssignment_service_1.outageAssignmentServices.createOutageAssignmentIntoDB(assignedById, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Outage Assigned to Technician Successfully!',
        data: result,
    });
});
const getAllOutageAssignments = (0, catchAsync_1.default)(async (req, res) => {
    const result = await outageAssignment_service_1.outageAssignmentServices.getAllOutageAssignmentsFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Outage Assignments Retrieved Successfully!',
        data: result,
    });
});
const getSingleOutageAssignment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outageAssignment_service_1.outageAssignmentServices.getSingleOutageAssignmentFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Outage Assignment Retrieved Successfully!',
        data: result,
    });
});
const updateOutageAssignment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outageAssignment_service_1.outageAssignmentServices.updateOutageAssignmentIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage Assignment Updated Successfully!',
        data: result,
    });
});
const deleteOutageAssignment = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outageAssignment_service_1.outageAssignmentServices.deleteOutageAssignmentFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage Assignment Deleted Successfully!',
        data: result,
    });
});
const getAssignmentsByOutage = (0, catchAsync_1.default)(async (req, res) => {
    const { outageId } = req.params;
    const result = await outageAssignment_service_1.outageAssignmentServices.getAssignmentsByOutageFromDB(outageId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage Assignments Retrieved Successfully!',
        data: result,
    });
});
const getAssignmentsByTechnician = (0, catchAsync_1.default)(async (req, res) => {
    const { technicianId } = req.params;
    const result = await outageAssignment_service_1.outageAssignmentServices.getAssignmentsByTechnicianFromDB(technicianId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician Assignments Retrieved Successfully!',
        data: result,
    });
});
const getMyAssignments = (0, catchAsync_1.default)(async (req, res) => {
    console.log('Authenticated User:', req.user);
    const userId = req.user?.id;
    console.log('User ID:', userId);
    const result = await outageAssignment_service_1.outageAssignmentServices.getMyAssignmentsFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My Outage Assignments Retrieved Successfully!',
        data: result,
    });
});
exports.outageAssignmentControllers = {
    createOutageAssignment,
    getAllOutageAssignments,
    getSingleOutageAssignment,
    updateOutageAssignment,
    deleteOutageAssignment,
    getAssignmentsByOutage,
    getAssignmentsByTechnician,
    getMyAssignments,
};
