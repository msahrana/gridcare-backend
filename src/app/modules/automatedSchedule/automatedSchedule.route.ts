import { Router } from 'express';
import { automatedScheduleControllers } from './automatedSchedule.controller';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';
import { generateScheduleValidationSchema } from './automatedSchedule.validation';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.post(
    '/generate',
    auth(UserRole.OPERATOR, UserRole.ADMIN),
    validateRequest(generateScheduleValidationSchema),
    automatedScheduleControllers.generateSchedules,
);

router.get(
    '/',
    auth(UserRole.OPERATOR, UserRole.ADMIN),
    automatedScheduleControllers.getSchedules,
);

router.get(
    '/:id',
    auth(UserRole.OPERATOR, UserRole.ADMIN),
    automatedScheduleControllers.getSingleSchedule,
);

router.patch(
    '/:id/publish',
    auth(UserRole.OPERATOR, UserRole.ADMIN),
    automatedScheduleControllers.publishSchedule,
);

router.patch(
    '/:id/cancel',
    auth(UserRole.OPERATOR, UserRole.ADMIN),
    automatedScheduleControllers.cancelSchedule,
);

export const automatedScheduleRoutes = router;
