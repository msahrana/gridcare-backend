import { Router } from 'express';

import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { subscriptionPaymentControllers } from './subscriptionPayment.controller';
import { createSubscriptionPaymentValidationSchema } from './subscriptionPayment.validation';

const router = Router();

/**
 * Create bKash subscription payment
 * Customer only
 */
router.post(
    '/create',
    auth(UserRole.CUSTOMER),
    validateRequest(createSubscriptionPaymentValidationSchema),
    subscriptionPaymentControllers.createSubscriptionPayment,
);

/**
 * bKash callback
 * Called by bKash after checkout
 *
 * Do NOT add auth middleware here.
 */
router.get('/bkash/callback', subscriptionPaymentControllers.bkashCallback);

/**
 * Get current user's subscription payments
 */
router.get(
    '/my',
    auth(UserRole.CUSTOMER),
    subscriptionPaymentControllers.getMySubscriptionPayments,
);

/**
 * Get single subscription payment
 */
router.get(
    '/:paymentId',
    auth(UserRole.CUSTOMER),
    subscriptionPaymentControllers.getSingleSubscriptionPayment,
);

export const subscriptionPaymentRoutes = router;
