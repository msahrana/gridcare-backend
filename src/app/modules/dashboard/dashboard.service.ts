import httpStatus from 'http-status';

import {
    AssignmentStatus,
    OutageStatus,
    OutageType,
    Priority,
    RestorationStatus,
    TechnicianStatus,
} from '../../../generated/prisma/enums';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

const getDateRange = () => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    return { start, end };
};

const getAdminDashboardFromDB = async () => {
    const { start, end } = getDateRange();

    const [
        totalUsers,
        totalTechnicians,
        totalAreas,
        totalFeeders,
        totalSubstations,

        activeOutages,
        todayOutages,
        restoredToday,
        criticalOutages,

        pendingAssignments,
        activeRestorations,

        restorations,

        recentOutages,
        recentRestorations,
    ] = await Promise.all([
        prisma.user.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.technician.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.area.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.feeder.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.substation.count({
            where: {
                deletedAt: null,
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                status: {
                    in: [
                        OutageStatus.REPORTED,
                        OutageStatus.VERIFIED,
                        OutageStatus.ASSIGNED,
                        OutageStatus.IN_PROGRESS,
                    ],
                },
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                status: OutageStatus.RESTORED,
                restoredAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                priority: Priority.CRITICAL,
                status: {
                    notIn: [
                        OutageStatus.RESTORED,
                        OutageStatus.CLOSED,
                        OutageStatus.CANCELLED,
                    ],
                },
            },
        }),

        prisma.outageAssignment.count({
            where: {
                status: AssignmentStatus.ASSIGNED,
            },
        }),

        prisma.restoration.count({
            where: {
                status: RestorationStatus.IN_PROGRESS,
            },
        }),

        prisma.restoration.findMany({
            where: {
                status: RestorationStatus.COMPLETED,
                duration: {
                    not: null,
                },
            },
            select: {
                duration: true,
            },
        }),

        prisma.outage.findMany({
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

        prisma.restoration.findMany({
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

    const totalDowntimeMinutes = restorations.reduce(
        (sum, item) => sum + (item.duration ?? 0),
        0,
    );

    const averageRestorationMinutes =
        restorations.length > 0
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

    const [
        activeOutages,
        criticalOutages,
        todayOutages,
        pendingReports,
        pendingAssignments,
        activeRestorations,
        restoredToday,
        recentOutages,
    ] = await Promise.all([
        prisma.outage.count({
            where: {
                deletedAt: null,
                status: {
                    in: [
                        OutageStatus.REPORTED,
                        OutageStatus.VERIFIED,
                        OutageStatus.ASSIGNED,
                        OutageStatus.IN_PROGRESS,
                    ],
                },
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                priority: Priority.CRITICAL,
                status: {
                    notIn: [
                        OutageStatus.RESTORED,
                        OutageStatus.CLOSED,
                        OutageStatus.CANCELLED,
                    ],
                },
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                createdAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),

        prisma.outageReport.count({
            where: {
                // Adjust status field if your OutageReport model
                // uses a different status structure.
            },
        }),

        prisma.outageAssignment.count({
            where: {
                status: AssignmentStatus.ASSIGNED,
            },
        }),

        prisma.restoration.count({
            where: {
                status: RestorationStatus.IN_PROGRESS,
            },
        }),

        prisma.outage.count({
            where: {
                deletedAt: null,
                status: OutageStatus.RESTORED,
                restoredAt: {
                    gte: start,
                    lte: end,
                },
            },
        }),

        prisma.outage.findMany({
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

const getTechnicianDashboardFromDB = async (technicianId: string) => {
    if (!technicianId) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Technician ID is required');
    }

    const [
        totalAssignments,
        pendingAssignments,
        acceptedAssignments,
        inProgressAssignments,
        completedAssignments,

        activeRestorations,
        completedToday,

        restorations,

        currentRestoration,
    ] = await Promise.all([
        prisma.outageAssignment.count({
            where: {
                technicianId,
            },
        }),

        prisma.outageAssignment.count({
            where: {
                technicianId,
                status: AssignmentStatus.ASSIGNED,
            },
        }),

        prisma.outageAssignment.count({
            where: {
                technicianId,
                status: AssignmentStatus.ACCEPTED,
            },
        }),

        prisma.outageAssignment.count({
            where: {
                technicianId,
                status: AssignmentStatus.IN_PROGRESS,
            },
        }),

        prisma.outageAssignment.count({
            where: {
                technicianId,
                status: AssignmentStatus.COMPLETED,
            },
        }),

        prisma.restoration.count({
            where: {
                technicianId,
                status: RestorationStatus.IN_PROGRESS,
            },
        }),

        prisma.restoration.count({
            where: {
                technicianId,
                status: RestorationStatus.COMPLETED,
                completedAt: {
                    gte: new Date(new Date().setHours(0, 0, 0, 0)),
                },
            },
        }),

        prisma.restoration.findMany({
            where: {
                technicianId,
                status: RestorationStatus.COMPLETED,
                duration: {
                    not: null,
                },
            },
            select: {
                duration: true,
            },
        }),

        prisma.restoration.findFirst({
            where: {
                technicianId,
                status: RestorationStatus.IN_PROGRESS,
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

    const totalMinutes = restorations.reduce(
        (sum, item) => sum + (item.duration ?? 0),
        0,
    );

    const averageRestorationMinutes =
        restorations.length > 0
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

export const dashboardServices = {
    getAdminDashboardFromDB,
    getOperatorDashboardFromDB,
    getTechnicianDashboardFromDB,
};
