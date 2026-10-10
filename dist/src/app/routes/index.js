"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_route_1 = require("../modules/auth/auth.route");
const zone_route_1 = require("../modules/zone/zone.route");
const substation_route_1 = require("../modules/substation/substation.route");
const feeder_route_1 = require("../modules/feeder/feeder.route");
const area_route_1 = require("../modules/area/area.route");
const outage_route_1 = require("../modules/outage/outage.route");
const outageReport_route_1 = require("../modules/outageReport/outageReport.route");
const outageAssignment_route_1 = require("../modules/outageAssignment/outageAssignment.route");
const technician_route_1 = require("../modules/technician/technician.route");
const notification_route_1 = require("../modules/notifications/notification.route");
const auditLog_route_1 = require("../modules/auditLog/auditLog.route");
const subscription_route_1 = require("../modules/subscriptions/subscription.route");
const loadSheddingSchedule_route_1 = require("../modules/loadSheddingSchedule/loadSheddingSchedule.route");
const subscriptionPayment_route_1 = require("../modules/subscriptionPayment/subscriptionPayment.route");
const restoration_route_1 = require("../modules/restoration/restoration.route");
const analytics_route_1 = require("../modules/analytics/analytics.route");
const dashboard_route_1 = require("../modules/dashboard/dashboard.route");
const automatedSchedule_route_1 = require("../modules/automatedSchedule/automatedSchedule.route");
const admin_route_1 = require("../modules/admin/admin.route");
const router = (0, express_1.Router)();
const routerManger = [
    {
        path: '/auth',
        route: auth_route_1.authRoutes,
    },
    {
        path: '/zones',
        route: zone_route_1.zoneRoutes,
    },
    {
        path: '/zones',
        route: zone_route_1.zoneRoutes,
    },
    {
        path: '/substations',
        route: substation_route_1.substationRoutes,
    },
    {
        path: '/substations',
        route: substation_route_1.substationRoutes,
    },
    {
        path: '/feeders',
        route: feeder_route_1.feederRoutes,
    },
    {
        path: '/feeders',
        route: feeder_route_1.feederRoutes,
    },
    {
        path: '/areas',
        route: area_route_1.areaRoutes,
    },
    {
        path: '/areas',
        route: area_route_1.areaRoutes,
    },
    {
        path: '/outages',
        route: outage_route_1.outageRoutes,
    },
    {
        path: '/outages',
        route: outage_route_1.outageRoutes,
    },
    {
        path: '/outageReports',
        route: outageReport_route_1.outageReportRoutes,
    },
    {
        path: '/outageReports',
        route: outageReport_route_1.outageReportRoutes,
    },
    {
        path: '/outageAssignments',
        route: outageAssignment_route_1.outageAssignmentRoutes,
    },
    {
        path: '/technicians',
        route: technician_route_1.technicianRoutes,
    },
    {
        path: '/load-shedding-schedules',
        route: loadSheddingSchedule_route_1.loadSheddingScheduleRoutes,
    },
    {
        path: '/notifications',
        route: notification_route_1.notificationRoutes,
    },
    {
        path: '/audit-logs',
        route: auditLog_route_1.auditLogRoutes,
    },
    {
        path: '/subscriptions',
        route: subscription_route_1.subscriptionRoutes,
    },
    {
        path: '/subscription-payments',
        route: subscriptionPayment_route_1.subscriptionPaymentRoutes,
    },
    {
        path: '/restorations',
        route: restoration_route_1.restorationRoutes,
    },
    {
        path: '/analytics',
        route: analytics_route_1.analyticsRoutes,
    },
    {
        path: '/dashboard',
        route: dashboard_route_1.dashboardRoutes,
    },
    {
        path: '/automated-schedules',
        route: automatedSchedule_route_1.automatedScheduleRoutes,
    },
    {
        path: '/admin',
        route: admin_route_1.adminRoutes,
    },
];
routerManger.forEach((r) => {
    router.use(r.path, r.route);
});
exports.default = router;
