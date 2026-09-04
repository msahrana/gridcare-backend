import { Router } from 'express';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { UserRole } from '../../../generated/prisma/enums';
import { loadSheddingScheduleControllers } from './loadSheddingSchedule.controller';
import { LoadSheddingScheduleValidation } from './loadSheddingSchedule.validation';

const router = Router();

// Upcoming schedules
router.get(
    '/upcoming',
    auth(UserRole.ADMIN, UserRole.OPERATOR, UserRole.CUSTOMER),
    loadSheddingScheduleControllers.getUpcomingLoadSheddingSchedules,
);

// Create
router.post(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(
        LoadSheddingScheduleValidation.createLoadSheddingScheduleValidationSchema,
    ),
    loadSheddingScheduleControllers.createLoadSheddingSchedule,
);

// Get all
router.get(
    '/',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    loadSheddingScheduleControllers.getAllLoadSheddingSchedules,
);

// Get single
router.get(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    loadSheddingScheduleControllers.getSingleLoadSheddingSchedule,
);

// Update
router.patch(
    '/:id',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    validateRequest(
        LoadSheddingScheduleValidation.updateLoadSheddingScheduleValidationSchema,
    ),
    loadSheddingScheduleControllers.updateLoadSheddingSchedule,
);

// Publish
router.patch(
    '/:id/publish',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    loadSheddingScheduleControllers.publishLoadSheddingSchedule,
);

// Activate
router.patch(
    '/:id/activate',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    loadSheddingScheduleControllers.activateLoadSheddingSchedule,
);

// Complete
router.patch(
    '/:id/complete',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    loadSheddingScheduleControllers.completeLoadSheddingSchedule,
);

// Cancel
router.patch(
    '/:id/cancel',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    loadSheddingScheduleControllers.cancelLoadSheddingSchedule,
);

// Delete
router.delete(
    '/:id',
    auth(UserRole.ADMIN),
    loadSheddingScheduleControllers.deleteLoadSheddingSchedule,
);

export const loadSheddingScheduleRoutes = router;
