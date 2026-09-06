import { Router } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { createSubscriptionPaymentValidationSchema } from './subscriptionPayment.validation';
import { subscriptionPaymentControllers } from './subscriptionPayment.controller';

const router = Router();

router.post(
    '/create',
    auth(UserRole.CUSTOMER),
    validateRequest(createSubscriptionPaymentValidationSchema),
    subscriptionPaymentControllers.createSubscriptionPayment,
);

router.get('/bkash/callback', subscriptionPaymentControllers.bkashCallback);

router.get(
    '/verify/:paymentId',
    auth(UserRole.CUSTOMER),
    subscriptionPaymentControllers.verifyBKashPayment,
);

router.get(
    '/my',
    auth(UserRole.CUSTOMER),
    subscriptionPaymentControllers.getMySubscriptionPayments,
);

router.get(
    '/:paymentId',
    auth(UserRole.CUSTOMER),
    subscriptionPaymentControllers.getSingleSubscriptionPayment,
);

export const subscriptionPaymentRoutes = router;
