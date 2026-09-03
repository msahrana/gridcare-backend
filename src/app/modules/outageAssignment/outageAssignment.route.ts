import express from 'express';
import { outageAssignmentControllers } from './outageAssignment.controller';
import { OutageAssignmentValidation } from './outageAssignment.validation';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

const router = express.Router();

router.post(
    '/',
    auth(),
    validateRequest(
        OutageAssignmentValidation.createOutageAssignmentValidationSchema,
    ),
    outageAssignmentControllers.createOutageAssignment,
);

router.get(
    '/my-assignments',
    auth(),
    outageAssignmentControllers.getMyAssignments,
);

router.get(
    '/outage/:outageId',
    auth(),
    outageAssignmentControllers.getAssignmentsByOutage,
);

router.get(
    '/technician/:technicianId',
    auth(),
    outageAssignmentControllers.getAssignmentsByTechnician,
);

router.get('/', auth(), outageAssignmentControllers.getAllOutageAssignments);

router.get(
    '/:id',
    auth(),
    outageAssignmentControllers.getSingleOutageAssignment,
);

router.patch(
    '/:id',
    auth(),
    validateRequest(
        OutageAssignmentValidation.updateOutageAssignmentValidationSchema,
    ),
    outageAssignmentControllers.updateOutageAssignment,
);

router.delete(
    '/:id',
    auth(),
    outageAssignmentControllers.deleteOutageAssignment,
);

export const outageAssignmentRoutes = router;
