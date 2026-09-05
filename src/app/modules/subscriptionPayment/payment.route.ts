import { Router } from 'express';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { UserRole } from '../../../generated/prisma/enums';
import { paymentControllers } from './payment.controller';
import { PaymentValidation } from './payment.validation';

const router = Router();

// Create payment
router.post(
    '/',
    auth(UserRole.CUSTOMER),
    validateRequest(PaymentValidation.createPaymentValidationSchema),
    paymentControllers.createPayment,
);

// My payments
router.get(
    '/my-payments',
    auth(UserRole.CUSTOMER),
    paymentControllers.getMyPayments,
);

// All payments
router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    paymentControllers.getAllPayments,
);

// Update payment status
router.patch(
    '/:id/status',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(PaymentValidation.updatePaymentStatusValidationSchema),
    paymentControllers.updatePaymentStatus,
);

// Refund
router.patch(
    '/:id/refund',
    auth(UserRole.ADMIN),
    validateRequest(PaymentValidation.refundPaymentValidationSchema),
    paymentControllers.refundPayment,
);

// Single payment
router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
    paymentControllers.getSinglePayment,
);

// Delete
router.delete('/:id', auth(UserRole.ADMIN), paymentControllers.deletePayment);

export const subscriptionPaymentRoutes = router;
