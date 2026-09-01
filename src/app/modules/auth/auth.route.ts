import { Router } from 'express';
import { authControllers } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { userValidation } from './auth.validation';

const router = Router();

router.post(
    '/register',
    validateRequest(userValidation.registrationZodSchema),
    authControllers.registerUser,
);

router.post('/verify-email', validateRequest(userValidation.emailVerifyZodSchema), authControllers.verifyEmail);

router.post('/login', authControllers.loginUser);

export const authRoutes = router;
