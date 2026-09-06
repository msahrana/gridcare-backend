import { Router } from 'express';
import { authRoutes } from '../modules/auth/auth.route';
import { zoneRoutes } from '../modules/zone/zone.route';
import { substationRoutes } from '../modules/substation/substation.route';
import { feederRoutes } from '../modules/feeder/feeder.route';
import { areaRoutes } from '../modules/area/area.route';
import { outageRoutes } from '../modules/outage/outage.route';
import { outageReportRoutes } from '../modules/outageReport/outageReport.route';
import { outageAssignmentRoutes } from '../modules/outageAssignment/outageAssignment.route';
import { technicianRoutes } from '../modules/technician/technician.route';
import { notificationRoutes } from '../modules/notifications/notification.route';
import { auditLogRoutes } from '../modules/auditLog/auditLog.route';
import { subscriptionRoutes } from '../modules/subscriptions/subscription.route';

import { loadSheddingScheduleRoutes } from '../modules/loadSheddingSchedule/loadSheddingSchedule.route';
import { subscriptionPaymentRoutes } from '../modules/subscriptionPayment/subscriptionPayment.route';
import { restorationRoutes } from '../modules/restoration/restoration.route';
import { analyticsRoutes } from '../modules/analytics/analytics.route';
import { dashboardRoutes } from '../modules/dashboard/dashboard.route';

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
    {
        path: '/feeders',
        route: feederRoutes,
    },
    {
        path: '/areas',
        route: areaRoutes,
    },
    {
        path: '/areas',
        route: areaRoutes,
    },
    {
        path: '/outages',
        route: outageRoutes,
    },
    {
        path: '/outages',
        route: outageRoutes,
    },
    {
        path: '/outageReports',
        route: outageReportRoutes,
    },
    {
        path: '/outageReports',
        route: outageReportRoutes,
    },
    {
        path: '/outageAssignments',
        route: outageAssignmentRoutes,
    },
    {
        path: '/technicians',
        route: technicianRoutes,
    },
    {
        path: '/load-shedding-schedules',
        route: loadSheddingScheduleRoutes,
    },
    {
        path: '/notifications',
        route: notificationRoutes,
    },
    {
        path: '/audit-logs',
        route: auditLogRoutes,
    },
    {
        path: '/subscriptions',
        route: subscriptionRoutes,
    },
    {
        path: '/subscription-payments',
        route: subscriptionPaymentRoutes,
    },
    {
        path: '/restorations',
        route: restorationRoutes,
    },
    {
        path: '/analytics',
        route: analyticsRoutes,
    },
    {
        path: '/dashboard',
        route: dashboardRoutes,
    },
];

routerManger.forEach((r) => router.use(r.path, r.route));

export default router;
