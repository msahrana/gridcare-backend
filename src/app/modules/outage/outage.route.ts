import express from 'express';
import { outageControllers } from './outage.controller';
import { OutageValidation } from './outage.validation';
import { validateRequest } from '../../middleware/validateRequest';

const router = express.Router();

// ============================================================
// CREATE
// ============================================================

router.post(
    '/',
    validateRequest(OutageValidation.createOutageSchema),
    outageControllers.createOutage,
);

// ============================================================
// SEARCH
// ============================================================

router.get('/search', outageControllers.searchOutages);

// ============================================================
// ACTIVE OUTAGES
// ============================================================

router.get('/active', outageControllers.getActiveOutages);

// ============================================================
// OUTAGES BY AREA
// ============================================================

router.get('/area/:areaId', outageControllers.getOutagesByArea);

// ============================================================
// GET ALL
// ============================================================

router.get('/', outageControllers.getAllOutages);

// ============================================================
// GET SINGLE
// IMPORTANT: Keep this AFTER all named routes
// ============================================================

router.get('/:id', outageControllers.getSingleOutage);

// ============================================================
// UPDATE
// ============================================================

router.patch(
    '/:id',
    validateRequest(OutageValidation.updateOutageSchema),
    outageControllers.updateOutage,
);

// ============================================================
// DELETE
// ============================================================

router.delete('/:id', outageControllers.deleteOutage);

// ============================================================
// EXPORT
// ============================================================

export const outageRoutes = router;
