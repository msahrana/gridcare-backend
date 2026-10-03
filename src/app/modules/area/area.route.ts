import express from 'express';

import { validateRequest } from '../../middleware/validateRequest';
import { areaControllers } from './area.controller';
import { AreaValidation } from './area.validation';
import { auth } from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(AreaValidation.createAreaSchema),
    areaControllers.createArea,
);

router.get('/search', areaControllers.searchAreas);

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(AreaValidation.areaQuerySchema),
    areaControllers.getAllAreas,
);

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    areaControllers.getAreaById,
);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(AreaValidation.updateAreaSchema),
    areaControllers.updateArea,
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    areaControllers.deleteArea,
);

export const areaRoutes = router;
