import { Router } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { substationControllers } from './substation.controller';
import {
    createSubstationValidationSchema,
    updateSubstationValidationSchema,
} from './substation.validation';

const router = Router();

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(createSubstationValidationSchema),
    substationControllers.createSubstation,
);

router.get('/', auth(), substationControllers.getAllSubstations);

router.get('/:id', auth(), substationControllers.getSingleSubstation);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(updateSubstationValidationSchema),
    substationControllers.updateSubstation,
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    substationControllers.deleteSubstation,
);

export const substationRoutes = router;
