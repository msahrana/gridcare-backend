import express from 'express';
import { outageControllers } from './outage.controller';
import { OutageValidation } from './outage.validation';
import { validateRequest } from '../../middleware/validateRequest';
import { auth } from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';

const router = express.Router();

// ============================================================
// CREATE
// ============================================================

router.post(
    '/',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
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

router.get(
    '/',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageControllers.getAllOutages,
);

// ============================================================
// GET SINGLE
// IMPORTANT: Keep this AFTER all named routes
// ============================================================

router.get(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageControllers.getSingleOutage,
);

// ============================================================
// UPDATE
// ============================================================

router.patch(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(OutageValidation.updateOutageSchema),
    outageControllers.updateOutage,
);

// ============================================================
// DELETE
// ============================================================

router.delete(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageControllers.deleteOutage,
);

// ============================================================
// EXPORT
// ============================================================

export const outageRoutes = router;
