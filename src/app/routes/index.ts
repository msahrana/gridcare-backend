import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { zoneRoutes } from '../modules/zone/zone.route';
import { substationRoutes } from '../modules/substation/substation.route';

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
    {
        path: '/zones',
        route: zoneRoutes,
    },
    {
        path: '/substations',
        route: substationRoutes,
    },
];

routerManger.forEach((r) => router.use(r.path, r.route));

export default router;
