"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoutes = void 0;
const express_1 = require("express");
const subscription_controller_1 = require("./subscription.controller");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const enums_1 = require("../../../generated/prisma/enums");
const subscription_validation_1 = require("./subscription.validation");
const router = (0, express_1.Router)();
// Create subscription plan
router.post('/plans', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(subscription_validation_1.createSubscriptionPlanValidationSchema), subscription_controller_1.subscriptionControllers.createSubscriptionPlan);
// Get all subscription plans
router.get('/plans', subscription_controller_1.subscriptionControllers.getAllSubscriptionPlans);
// Get single subscription plan
router.get('/plans/:id', subscription_controller_1.subscriptionControllers.getSingleSubscriptionPlan);
// Update subscription plan
router.patch('/plans/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), (0, validateRequest_1.validateRequest)(subscription_validation_1.updateSubscriptionPlanValidationSchema), subscription_controller_1.subscriptionControllers.updateSubscriptionPlan);
// Delete subscription plan
router.delete('/plans/:id', (0, checkAuth_1.auth)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR), subscription_controller_1.subscriptionControllers.deleteSubscriptionPlan);
// Create subscription
router.post('/', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), (0, validateRequest_1.validateRequest)(subscription_validation_1.createSubscriptionValidationSchema), subscription_controller_1.subscriptionControllers.createSubscription);
// Get current subscription
router.get('/my-subscription', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), subscription_controller_1.subscriptionControllers.getMySubscription);
// Get subscription history
router.get('/history', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), subscription_controller_1.subscriptionControllers.getMySubscriptionHistory);
// Cancel subscription
router.patch('/:id/cancel', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), subscription_controller_1.subscriptionControllers.cancelSubscription);
exports.subscriptionRoutes = router;
