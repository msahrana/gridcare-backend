"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dashboardServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const getDateRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);
    return { start, end };
};
const getAdminDashboardFromDB = async () => {
    const { start, end } = getDateRange();
    const [totalUsers, totalTechnicians, totalAreas, totalFeeders, totalSubstations, activeOutages, todayOutages, restoredToday, criticalOutages, pendingAssignments, activeRestorations, restorations, recentOutages, recentRestorations,] = await Promise.all([
        prisma_1.prisma.user.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.technician.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.area.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.feeder.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.substation.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                status: {
                    in: [
                        enums_1.OutageStatus.REPORTED,
                        enums_1.OutageStatus.VERIFIED,
                        enums_1.OutageStatus.ASSIGNED,
                        enums_1.OutageStatus.IN_PROGRESS,
                    ],
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                status: enums_1.OutageStatus.RESTORED,
                restoredAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                priority: enums_1.Priority.CRITICAL,
                status: {
                    notIn: [
                        enums_1.OutageStatus.RESTORED,
                        enums_1.OutageStatus.CLOSED,
                        enums_1.OutageStatus.CANCELLED,
                    ],
                },
            },
        }),
        prisma_1.prisma.outageAssignment.count({
            where: {
                status: enums_1.AssignmentStatus.ASSIGNED,
            },
        }),
        prisma_1.prisma.restoration.count({
            where: {
                status: enums_1.RestorationStatus.IN_PROGRESS,
            },
        }),
        prisma_1.prisma.restoration.findMany({
            where: {
                status: enums_1.RestorationStatus.COMPLETED,
                duration: {
                    not: null,
                },
            },
            select: {
                duration: true,
            },
        }),
        prisma_1.prisma.outage.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
            select: {
                id: true,
                title: true,
                type: true,
                priority: true,
                status: true,
                createdAt: true,
                area: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
        prisma_1.prisma.restoration.findMany({
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
            select: {
                id: true,
                status: true,
                startedAt: true,
                completedAt: true,
                duration: true,
                outage: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        }),
    ]);
    const totalDowntimeMinutes = restorations.reduce((sum, item) => sum + (item.duration ?? 0), 0);
    const averageRestorationMinutes = restorations.length > 0
        ? Math.round(totalDowntimeMinutes / restorations.length)
        : 0;
    return {
        overview: {
            totalUsers,
            totalTechnicians,
            totalAreas,
            totalFeeders,
            totalSubstations,
        },
        outages: {
            active: activeOutages,
            today: todayOutages,
            restoredToday,
            critical: criticalOutages,
        },
        operations: {
            pendingAssignments,
            activeRestorations,
        },
        performance: {
            averageRestorationMinutes,
            totalDowntimeMinutes,
        },
        recentOutages,
        recentRestorations,
    };
};
const getOperatorDashboardFromDB = async () => {
    const { start, end } = getDateRange();
    const [activeOutages, criticalOutages, todayOutages, pendingReports, pendingAssignments, activeRestorations, restoredToday, recentOutages,] = await Promise.all([
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                status: {
                    in: [
                        enums_1.OutageStatus.REPORTED,
                        enums_1.OutageStatus.VERIFIED,
                        enums_1.OutageStatus.ASSIGNED,
                        enums_1.OutageStatus.IN_PROGRESS,
                    ],
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                priority: enums_1.Priority.CRITICAL,
                status: {
                    notIn: [
                        enums_1.OutageStatus.RESTORED,
                        enums_1.OutageStatus.CLOSED,
                        enums_1.OutageStatus.CANCELLED,
                    ],
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),
        prisma_1.prisma.outageReport.count({
            where: {
            // Adjust status field if your OutageReport model
            // uses a different status structure.
            },
        }),
        prisma_1.prisma.outageAssignment.count({
            where: {
                status: enums_1.AssignmentStatus.ASSIGNED,
            },
        }),
        prisma_1.prisma.restoration.count({
            where: {
                status: enums_1.RestorationStatus.IN_PROGRESS,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                status: enums_1.OutageStatus.RESTORED,
                restoredAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),
        prisma_1.prisma.outage.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: 'desc',
            },
            take: 10,
            select: {
                id: true,
                title: true,
                type: true,
                priority: true,
                status: true,
                createdAt: true,
                area: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
            },
        }),
    ]);
    return {
        outages: {
            active: activeOutages,
            critical: criticalOutages,
            today: todayOutages,
        },
        operations: {
            pendingReports,
            pendingAssignments,
            activeRestorations,
            restoredToday,
        },
        recentOutages,
    };
};
const getTechnicianDashboardFromDB = async (technicianId) => {
    if (!technicianId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician ID is required');
    }
    const [totalAssignments, pendingAssignments, acceptedAssignments, inProgressAssignments, completedAssignments, activeRestorations, completedToday, restorations, currentRestoration,] = await Promise.all([
        prisma_1.prisma.outageAssignment.count({
            where: {
                technicianId,
            },
        }),
        prisma_1.prisma.outageAssignment.count({
            where: {
                technicianId,
                status: enums_1.AssignmentStatus.ASSIGNED,
            },
        }),
        prisma_1.prisma.outageAssignment.count({
            where: {
                technicianId,
                status: enums_1.AssignmentStatus.ACCEPTED,
            },
        }),
        prisma_1.prisma.outageAssignment.count({
            where: {
                technicianId,
                status: enums_1.AssignmentStatus.IN_PROGRESS,
            },
        }),
        prisma_1.prisma.outageAssignment.count({
            where: {
                technicianId,
                status: enums_1.AssignmentStatus.COMPLETED,
            },
        }),
        prisma_1.prisma.restoration.count({
            where: {
                technicianId,
                status: enums_1.RestorationStatus.IN_PROGRESS,
            },
        }),
        prisma_1.prisma.restoration.count({
            where: {
                technicianId,
                status: enums_1.RestorationStatus.COMPLETED,
                completedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        }),
        prisma_1.prisma.restoration.findMany({
            where: {
                technicianId,
                status: enums_1.RestorationStatus.COMPLETED,
                duration: {
                    not: null,
                },
            },
            select: {
                duration: true,
            },
        }),
        prisma_1.prisma.restoration.findFirst({
            where: {
                technicianId,
                status: enums_1.RestorationStatus.IN_PROGRESS,
            },
            orderBy: {
                startedAt: 'desc',
            },
            select: {
                id: true,
                status: true,
                startedAt: true,
                completedAt: true,
                duration: true,
                outage: {
                    select: {
                        id: true,
                        title: true,
                    },
                },
            },
        }),
    ]);
    const totalMinutes = restorations.reduce((sum, item) => sum + (item.duration ?? 0), 0);
    const averageRestorationMinutes = restorations.length > 0
        ? Math.round(totalMinutes / restorations.length)
        : 0;
    return {
        assignments: {
            total: totalAssignments,
            pending: pendingAssignments,
            accepted: acceptedAssignments,
            inProgress: inProgressAssignments,
            completed: completedAssignments,
        },
        restorations: {
            active: activeRestorations,
            completedToday,
            averageRestorationMinutes,
        },
        currentRestoration,
    };
};
exports.dashboardServices = {
    getAdminDashboardFromDB,
    getOperatorDashboardFromDB,
    getTechnicianDashboardFromDB,
};
