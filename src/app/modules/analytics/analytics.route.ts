import { Router } from 'express';
import { analyticsControllers } from './analytics.controller';
import { auth } from '../../middleware/checkAuth';
import { UserRole } from '../../../generated/prisma/enums';

const router = Router();

router.get(
    '/overview',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    analyticsControllers.getOverviewAnalytics,
);

router.get(
    '/outages',
    auth(UserRole.ADMIN, UserRole.OPERATOR),
    analyticsControllers.getOutageAnalytics,
);

export const analyticsRoutes = router;
