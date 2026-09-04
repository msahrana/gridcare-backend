import { Router } from 'express';

import { UserRole } from '../../../generated/prisma/enums';

import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

import { auditLogControllers } from './auditLog.controller';
import { AuditLogValidation } from './auditLog.validation';

const router = Router();

// ======================================================
// CREATE
// ======================================================

router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(AuditLogValidation.createAuditLogValidationSchema),
    auditLogControllers.createAuditLog,
);

// ======================================================
// GET ALL
// ======================================================

router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    auditLogControllers.getAllAuditLogs,
);

// ======================================================
// GET BY ENTITY
// ======================================================

router.get(
    '/entity/:entityId',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    auditLogControllers.getAuditLogsByEntity,
);

// ======================================================
// GET SINGLE
// ======================================================

router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    auditLogControllers.getSingleAuditLog,
);

// ======================================================
// DELETE
// ======================================================

router.delete('/:id', auth(UserRole.ADMIN), auditLogControllers.deleteAuditLog);

export const auditLogRoutes = router;
