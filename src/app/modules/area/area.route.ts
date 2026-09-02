import express from 'express';

import { validateRequest } from '../../middleware/validateRequest';
import { areaControllers } from './area.controller';
import { AreaValidation } from './area.validation';

const router = express.Router();

router.post(
    '/',
    validateRequest(AreaValidation.createAreaSchema),
    areaControllers.createArea,
);

router.get('/search', areaControllers.searchAreas);

router.get(
    '/',
    validateRequest(AreaValidation.areaQuerySchema),
    areaControllers.getAllAreas,
);

router.get('/:id', areaControllers.getAreaById);

router.patch(
    '/:id',
    validateRequest(AreaValidation.updateAreaSchema),
    areaControllers.updateArea,
);

router.delete('/:id', areaControllers.deleteArea);

export const areaRoutes = router;
