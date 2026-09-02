import { Router } from 'express';
import { auth } from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';
import { validateRequest } from '../../middleware/validateRequest';
import {
    createZoneValidationSchema,
    updateZoneValidationSchema,
} from './zone.validation';
import { zoneControllers } from './zone.controller';

const router = Router();

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(createZoneValidationSchema),
    zoneControllers.createZone,
);

router.get('/', auth(), zoneControllers.getAllZones);

router.get('/:id', auth(), zoneControllers.getSingleZone);

router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(updateZoneValidationSchema),
    zoneControllers.updateZone,
);

router.delete(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    zoneControllers.deleteZone,
);

export const zoneRoutes = router;
