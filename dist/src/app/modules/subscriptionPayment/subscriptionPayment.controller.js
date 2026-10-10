"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionPaymentControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../../config"));
const AppError_1 = require("../../errors/AppError");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const subscriptionPayment_service_1 = require("./subscriptionPayment.service");
const createSubscriptionPayment = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'User authentication required');
    }
    const result = await subscriptionPayment_service_1.subscriptionPaymentServices.createSubscriptionPaymentIntoDB(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: result.reused
            ? 'Existing bKash payment returned successfully'
            : 'bKash payment created successfully',
        data: result,
    });
});
const bkashCallback = (0, catchAsync_1.default)(async (req, res) => {
    const paymentID = typeof req.query.paymentID === 'string'
        ? req.query.paymentID
        : undefined;
    const callbackStatus = typeof req.query.status === 'string' ? req.query.status : undefined;
    if (!paymentID) {
        res.redirect(`${config_1.default.frontend_url}/subscription/payment-failed`);
        return;
    }
    try {
        const result = await subscriptionPayment_service_1.subscriptionPaymentServices.handleBKashCallbackIntoDB(paymentID, callbackStatus);
        const pageMap = {
            // COMPLETED: 'payment-success',
            COMPLETED: 'customer',
            FAILED: 'payment-failed',
            CANCELLED: 'payment-cancelled',
            PENDING: 'payment-pending',
        };
        const page = pageMap[result.status] ??
            'payment-pending';
        // res.redirect(
        //     `${config.frontend_url}/subscription/${page}?paymentId=${encodeURIComponent(
        //         paymentID,
        //     )}`,
        // );
        res.redirect(`${config_1.default.frontend_url}/upcoming-load-shedding-schedules/${page}?paymentId=${encodeURIComponent(paymentID)}`);
    }
    catch (error) {
        console.error('bKash callback error:', error);
        res.redirect(`${config_1.default.frontend_url}/subscription/payment-failed?paymentId=${encodeURIComponent(paymentID)}`);
    }
});
const getSingleSubscriptionPayment = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const paymentId = req.params.paymentId;
    if (!userId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'User authentication required');
    }
    if (typeof paymentId !== 'string' || !paymentId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid payment ID');
    }
    const result = await subscriptionPayment_service_1.subscriptionPaymentServices.getSingleSubscriptionPaymentIntoDB(paymentId, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscription payment retrieved successfully',
        data: result,
    });
});
const getMySubscriptionPayments = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'User authentication required');
    }
    const result = await subscriptionPayment_service_1.subscriptionPaymentServices.getMySubscriptionPaymentsIntoDB(userId, req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'My subscription payments retrieved successfully',
        data: result.data,
        meta: result.meta,
    });
});
exports.subscriptionPaymentControllers = {
    createSubscriptionPayment,
    bkashCallback,
    getSingleSubscriptionPayment,
    getMySubscriptionPayments,
};
