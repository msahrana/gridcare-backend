import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { zoneRoutes } from '../modules/zone/zone.route';
import { substationRoutes } from '../modules/substation/substation.route';
import { feederRoutes } from '../modules/feeder/feeder.route';

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
    {
        path: '/substations',
        route: substationRoutes,
    },
    {
        path: '/feeders',
        route: feederRoutes,
    },
];

routerManger.forEach((r) => router.use(r.path, r.route));

export default router;
