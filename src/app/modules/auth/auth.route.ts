import { Router } from 'express';
import { authControllers } from './auth.controller';
import { validateRequest } from '../../middleware/validateRequest';
import { userValidation } from './auth.validation';
import { auth } from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';
import { upload } from '../../lib/multer';

const router = Router();

router.post(
    '/register',
    validateRequest(userValidation.registrationZodSchema),
    authControllers.registerUser,
);

router.post(
    '/verify-email',
    validateRequest(userValidation.emailVerifyZodSchema),
    authControllers.verifyEmail,
);

router.post('/login', authControllers.loginUser);

router.get(
    '/me',
    auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
    authControllers.getMe,
);

router.post('/refresh-token', authControllers.refreshToken);

router.get('/all-users', authControllers.getAllUsers);

router.get('/user/:id', authControllers.getUserById);

router.put(
    '/my-profile',
    auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
    authControllers.updateMyProfile,
);

router.post(
    '/change-password',
    auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
    authControllers.changePassword,
);

router.post(
    '/forgot-password',
    validateRequest(userValidation.forgotPasswordZodSchema),
    authControllers.forgotPassword,
);

router.post(
    '/reset-password',
    validateRequest(userValidation.resetPasswordZodSchema),
    authControllers.resetPassword,
);

router.patch(
    '/profile-image',
    auth(UserRole.ADMIN, UserRole.CUSTOMER, UserRole.OPERATOR),
    upload.single('profileImage'),
    authControllers.uploadProfileImage,
);

export const authRoutes = router;
