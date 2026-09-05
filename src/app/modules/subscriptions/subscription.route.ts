import { Router } from 'express';
import { subscriptionControllers } from './subscription.controller';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { UserRole } from '../../../generated/prisma/enums';

import {
    createSubscriptionPlanValidationSchema,
    updateSubscriptionPlanValidationSchema,
    createSubscriptionValidationSchema,
} from './subscription.validation';

const router = Router();

// Create subscription plan
router.post(
    '/plans',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(createSubscriptionPlanValidationSchema),
    subscriptionControllers.createSubscriptionPlan,
);

// Get all subscription plans
router.get('/plans', subscriptionControllers.getAllSubscriptionPlans);

// Get single subscription plan
router.get('/plans/:id', subscriptionControllers.getSingleSubscriptionPlan);

// Update subscription plan
router.patch(
    '/plans/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(updateSubscriptionPlanValidationSchema),
    subscriptionControllers.updateSubscriptionPlan,
);

// Delete subscription plan
router.delete(
    '/plans/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    subscriptionControllers.deleteSubscriptionPlan,
);

// Create subscription
router.post(
    '/',
    auth(UserRole.CUSTOMER),
    validateRequest(createSubscriptionValidationSchema),
    subscriptionControllers.createSubscription,
);

// Get current subscription
router.get(
    '/my-subscription',
    auth(UserRole.CUSTOMER),
    subscriptionControllers.getMySubscription,
);

// Get subscription history
router.get(
    '/history',
    auth(UserRole.CUSTOMER),
    subscriptionControllers.getMySubscriptionHistory,
);

// Cancel subscription
router.patch(
    '/:id/cancel',
    auth(UserRole.CUSTOMER),
    subscriptionControllers.cancelSubscription,
);

export const subscriptionRoutes = router;
