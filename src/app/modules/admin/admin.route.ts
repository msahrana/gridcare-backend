import { Router } from 'express';
import { UserRole } from '../../../generated/prisma/enums';
import { updateUserRoleValidationSchema } from './admin.validation';
import { adminControllers } from './admin.controller';
import { auth } from '../../middleware/checkAuth';
import { validateRequest } from '../../middleware/validateRequest';

const router = Router();

router.get('/users', auth(UserRole.ADMIN), adminControllers.getAllUsers);

router.patch(
    '/users/:id/role',
    auth(UserRole.ADMIN),
    validateRequest(updateUserRoleValidationSchema),
    adminControllers.updateUserRole,
);

router.get(
    '/dashboard-stats',
    auth(UserRole.ADMIN),
    adminControllers.getDashboardStats,
);

router.get('/audit-logs', auth(UserRole.ADMIN), adminControllers.getAuditLogs);

export const adminRoutes = router;
