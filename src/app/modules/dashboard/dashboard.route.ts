import { Router } from 'express';

import { dashboardControllers } from './dashboard.controller';

import { auth } from '../../middleware/checkAuth';

import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.get(
    '/admin',
    auth(UserRole.ADMIN),
    dashboardControllers.getAdminDashboard,
);

router.get(
    '/operator',
    auth(UserRole.OPERATOR),
    dashboardControllers.getOperatorDashboard,
);

router.get(
    '/technician/:technicianId',
    auth(UserRole.TECHNICIAN, UserRole.OPERATOR, UserRole.ADMIN),
    dashboardControllers.getTechnicianDashboard,
);

export const dashboardRoutes = router;
