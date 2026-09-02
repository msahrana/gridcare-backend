import { Router } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { feederControllers } from './feeder.controller';
import {
    createFeederValidationSchema,
    updateFeederValidationSchema,
} from './feeder.validation';

const router = Router();

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(createFeederValidationSchema),
    feederControllers.createFeeder,
);

router.get('/', auth(), feederControllers.getAllFeeders);

router.get('/:id', auth(), feederControllers.getSingleFeeder);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(updateFeederValidationSchema),
    feederControllers.updateFeeder,
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    feederControllers.deleteFeeder,
);

export const feederRoutes = router;
