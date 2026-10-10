"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outageReportControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const outageReport_service_1 = require("./outageReport.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const AppError_1 = require("../../errors/AppError");
const createOutageReport = (0, catchAsync_1.default)(async (req, res) => {
    const reporterId = req.user?.id;
    if (!reporterId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Authentication required to create an outage report');
    }
    const result = await outageReport_service_1.outageReportServices.createOutageReportIntoDB(reporterId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Outage report created successfully!',
        data: result,
    });
});
const getAllOutageReports = (0, catchAsync_1.default)(async (req, res) => {
    const result = await outageReport_service_1.outageReportServices.getAllOutageReportsFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All outage reports retrieved successfully',
        data: result,
    });
});
const getSingleOutageReport = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outageReport_service_1.outageReportServices.getSingleOutageReportFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single outage report retrieved successfully',
        data: result,
    });
});
const getReportsByOutage = (0, catchAsync_1.default)(async (req, res) => {
    const { outageId } = req.params;
    const result = await outageReport_service_1.outageReportServices.getReportsByOutageFromDB(outageId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage reports retrieved successfully',
        data: result,
    });
});
const getReportsByArea = (0, catchAsync_1.default)(async (req, res) => {
    const { areaId } = req.params;
    const result = await outageReport_service_1.outageReportServices.getReportsByAreaFromDB(areaId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Area outage reports retrieved successfully',
        data: result,
    });
});
const updateOutageReport = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outageReport_service_1.outageReportServices.updateOutageReportIntoDB(id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage report updated successfully',
        data: result,
    });
});
const deleteOutageReport = (0, catchAsync_1.default)(async (req, res) => {
    const { id } = req.params;
    const result = await outageReport_service_1.outageReportServices.deleteOutageReportFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Outage report deleted successfully',
        data: result,
    });
});
exports.outageReportControllers = {
    createOutageReport,
    getAllOutageReports,
    getSingleOutageReport,
    getReportsByOutage,
    getReportsByArea,
    updateOutageReport,
    deleteOutageReport,
};
