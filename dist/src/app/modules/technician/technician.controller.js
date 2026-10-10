"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.technicianControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const technician_validation_1 = require("./technician.validation");
const AppError_1 = require("../../errors/AppError");
const http_status_1 = __importDefault(require("http-status"));
const technician_service_1 = require("./technician.service");
const sendResponse_1 = require("../../utils/sendResponse");
const applyAsTechnician = (0, catchAsync_1.default)(async (req, res) => {
    // ==============================================
    // Get Uploaded Files
    // ==============================================
    const files = req.files || {};
    const resume = files.resume?.[0] ?? null;
    const additionalFiles = files.additionalFiles ?? [];
    // ==============================================
    // Check Request Body
    // ==============================================
    if (!req.body) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Request body is required');
    }
    // ==============================================
    // Get Application Data
    // ==============================================
    const { data } = req.body;
    if (!data) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician application data is required');
    }
    if (typeof data !== 'string') {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician application data must be a valid JSON string');
    }
    // ==============================================
    // Parse JSON
    // ==============================================
    let parsedData;
    try {
        parsedData = JSON.parse(data);
    }
    catch {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid technician application JSON data');
    }
    // ==============================================
    // Validate Application Data
    // ==============================================
    const validationResult = technician_validation_1.applyTechnicianValidationSchema.safeParse(parsedData);
    if (!validationResult.success) {
        const firstIssue = validationResult.error.issues[0];
        const errorMessage = firstIssue?.message || 'Invalid technician application data';
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, errorMessage);
    }
    // ==============================================
    // Validated Payload
    // ==============================================
    const payload = validationResult.data;
    // ==============================================
    // Resume Validation
    // ==============================================
    if (!resume) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Resume is required');
    }
    // ==============================================
    // Apply As Technician
    // ==============================================
    const result = await technician_service_1.technicianServices.applyAsTechnicianIntoDB(payload, resume, additionalFiles);
    // ==============================================
    // Response
    // ==============================================
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Applied as technician successfully, Now verification account by OTP',
        data: result,
    });
});
const verifyTechnicianEmail = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await technician_service_1.technicianServices.verifyTechnicianEmailIntoDB(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician Email Verified Successfully!!',
        data: result,
    });
});
const approveTechnician = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const result = await technician_service_1.technicianServices.approveTechnicianIntoDB(payload, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician Email Approved Successfully!!',
        data: result,
    });
});
const getAllTechnicians = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const { data, meta } = await technician_service_1.technicianServices.getAllTechniciansIntoDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Technicians Retrieved Successfully!!',
        data: data,
        meta: meta,
    });
});
const updateTechnicianProfile = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const user = req.user;
    const result = await technician_service_1.technicianServices.updateTechnicianProfileIntoDB(payload, user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician Profile Updated Successfully!!',
        data: result,
    });
});
const getAvailableTechnicianByTodaysSchedule = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const { data, meta } = await technician_service_1.technicianServices.getAvailableTechnicianByTodaysScheduleIntoDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: "Today's Available Technician Retrieved Successfully!",
        data,
        meta,
    });
});
const getAllTechniciansListPublic = (0, catchAsync_1.default)(async (req, res) => {
    const query = req.query;
    const { data, meta } = await technician_service_1.technicianServices.getAllTechniciansListPublicIntoDB(query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician Retrieved Successfully!!',
        data,
        meta,
    });
});
const getSingleTechnicianPublicProfile = (0, catchAsync_1.default)(async (req, res) => {
    const { technicianId } = req.params;
    if (!technicianId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician ID is required');
    }
    const result = await technician_service_1.technicianServices.getSingleTechnicianPublicProfileIntoDB(technicianId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Technician public profile retrieved successfully',
        data: result,
    });
});
exports.technicianControllers = {
    applyAsTechnician,
    verifyTechnicianEmail,
    approveTechnician,
    getAllTechnicians,
    updateTechnicianProfile,
    getAvailableTechnicianByTodaysSchedule,
    getAllTechniciansListPublic,
    getSingleTechnicianPublicProfile,
};
