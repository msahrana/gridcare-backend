import express from 'express';
import { outageAssignmentControllers } from './outageAssignment.controller';
import { OutageAssignmentValidation } from './outageAssignment.validation';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { UserRole } from '../../../generated/prisma/enums';

const router = express.Router();

router.post(
    '/',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(
        OutageAssignmentValidation.createOutageAssignmentValidationSchema,
    ),
    outageAssignmentControllers.createOutageAssignment,
);

router.get(
    '/my-assignments',
    auth(UserRole.TECHNICIAN),
    outageAssignmentControllers.getMyAssignments,   // TODO 
);

router.get(
    '/outage/:outageId',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageAssignmentControllers.getAssignmentsByOutage,
);

router.get(
    '/technician/:technicianId',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageAssignmentControllers.getAssignmentsByTechnician,
);

router.get(
    '/',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageAssignmentControllers.getAllOutageAssignments,
);

router.get(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageAssignmentControllers.getSingleOutageAssignment,
);

router.patch(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(
        OutageAssignmentValidation.updateOutageAssignmentValidationSchema,
    ),
    outageAssignmentControllers.updateOutageAssignment,
);

router.delete(
    '/:id',
    auth(UserRole.TECHNICIAN, UserRole.ADMIN, UserRole.OPERATOR),
    outageAssignmentControllers.deleteOutageAssignment,
);

export const outageAssignmentRoutes = router;
