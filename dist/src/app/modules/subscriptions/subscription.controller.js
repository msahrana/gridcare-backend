"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionControllers = void 0;
const http_status_1 = __importDefault(require("http-status"));
const subscription_service_1 = require("./subscription.service");
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const sendResponse_1 = require("../../utils/sendResponse");
const createSubscriptionPlan = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.subscriptionServices.createSubscriptionPlanIntoDB(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Subscription plan created successfully',
        data: result,
    });
});
const getAllSubscriptionPlans = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.subscriptionServices.getAllSubscriptionPlansFromDB(req.query);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Subscription plans retrieved successfully',
        data: result.data,
    });
});
const getSingleSubscriptionPlan = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.subscriptionServices.getSingleSubscriptionPlanFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single Subscription plan retrieved successfully',
        data: result,
    });
});
const updateSubscriptionPlan = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.subscriptionServices.updateSubscriptionPlanIntoDB(req.params.id, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscription plan updated successfully',
        data: result,
    });
});
const deleteSubscriptionPlan = (0, catchAsync_1.default)(async (req, res) => {
    const result = await subscription_service_1.subscriptionServices.deleteSubscriptionPlanFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscription plan deleted successfully',
        data: result,
    });
});
const createSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await subscription_service_1.subscriptionServices.createSubscriptionIntoDB(userId, req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Subscription created successfully',
        data: result,
    });
});
const getMySubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await subscription_service_1.subscriptionServices.getMySubscriptionFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Current subscription retrieved successfully',
        data: result,
    });
});
const getMySubscriptionHistory = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await subscription_service_1.subscriptionServices.getMySubscriptionHistoryFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscription history retrieved successfully',
        data: result,
    });
});
const cancelSubscription = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const result = await subscription_service_1.subscriptionServices.cancelSubscriptionIntoDB(userId, req.params.id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Subscription cancelled successfully',
        data: result,
    });
});
exports.subscriptionControllers = {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSingleSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,
    createSubscription,
    getMySubscription,
    getMySubscriptionHistory,
    cancelSubscription,
};
