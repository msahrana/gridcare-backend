import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { zoneRoutes } from '../modules/zone/zone.route';

const router = Router();

const routerManger = [
    {
        path: '/auth',
        route: authRoutes,
    },
    {
        path: '/zones',
        route: zoneRoutes,
    },
];

routerManger.forEach((r) => router.use(r.path, r.route));

export default router;
