"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionPaymentRoutes = void 0;
const express_1 = require("express");
const enums_1 = require("../../../generated/prisma/enums");
const checkAuth_1 = require("../../middleware/checkAuth");
const validateRequest_1 = require("../../middleware/validateRequest");
const subscriptionPayment_controller_1 = require("./subscriptionPayment.controller");
const subscriptionPayment_validation_1 = require("./subscriptionPayment.validation");
const router = (0, express_1.Router)();
/**
 * Create bKash subscription payment
 * Customer only
 */
router.post('/create', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), (0, validateRequest_1.validateRequest)(subscriptionPayment_validation_1.createSubscriptionPaymentValidationSchema), subscriptionPayment_controller_1.subscriptionPaymentControllers.createSubscriptionPayment);
/**
 * bKash callback
 * Called by bKash after checkout
 *
 * Do NOT add auth middleware here.
 */
router.get('/bkash/callback', subscriptionPayment_controller_1.subscriptionPaymentControllers.bkashCallback);
/**
 * Get current user's subscription payments
 */
router.get('/my', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), subscriptionPayment_controller_1.subscriptionPaymentControllers.getMySubscriptionPayments);
/**
 * Get single subscription payment
 */
router.get('/:paymentId', (0, checkAuth_1.auth)(enums_1.UserRole.CUSTOMER), subscriptionPayment_controller_1.subscriptionPaymentControllers.getSingleSubscriptionPayment);
exports.subscriptionPaymentRoutes = router;
