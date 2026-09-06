import { Router } from 'express';

import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

import { UserRole } from '../../../generated/prisma/enums';

import {
    createRestorationValidationSchema,
    updateRestorationValidationSchema,
} from './restoration.validation';

import { restorationControllers } from './restoration.controller';

const router = Router();

router.post(
    '/start',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    validateRequest(createRestorationValidationSchema),
    restorationControllers.startRestoration,
);

router.patch(
    '/:id/complete',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    validateRequest(updateRestorationValidationSchema),
    restorationControllers.completeRestoration,
);

router.patch(
    '/:id/cancel',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    validateRequest(updateRestorationValidationSchema),
    restorationControllers.cancelRestoration,
);

router.get(
    '/',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    restorationControllers.getAllRestorations,
);

router.get(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    restorationControllers.getSingleRestoration,
);

router.patch(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    validateRequest(updateRestorationValidationSchema),
    restorationControllers.updateRestoration,
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    restorationControllers.deleteRestoration,
);

export const restorationRoutes = router;
