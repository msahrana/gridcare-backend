import httpStatus from 'http-status';

import {
    OutageStatus,
    OutageType,
    Priority,
    RestorationStatus,
} from '../../../generated/prisma/enums';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import { IAnalyticsDateFilter, IAnalyticsQuery } from './analytics.interface';

const buildDateFilter = (query: IAnalyticsQuery): IAnalyticsDateFilter => {
    const { startDate, endDate } = query;

    if (!startDate && !endDate) {
        return {};
    }

    const filter: IAnalyticsDateFilter = {};

    if (startDate) {
        const date = new Date(startDate);

        if (Number.isNaN(date.getTime())) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid startDate');
        }

        filter.startDate = date;
    }

    if (endDate) {
        const date = new Date(endDate);

        if (Number.isNaN(date.getTime())) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid endDate');
        }

        // Include the complete end date
        date.setHours(23, 59, 59, 999);

        filter.endDate = date;
    }

    return filter;
};

const getOverviewAnalyticsFromDB = async (query: IAnalyticsQuery) => {
    const { startDate, endDate } = buildDateFilter(query);

    const createdAtFilter =
        startDate || endDate
            ? {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lte: endDate }),
              }
            : undefined;

    const outageWhere = {
        deletedAt: null,
        ...(createdAtFilter && {
            createdAt: createdAtFilter,
        }),
        ...(query.areaId && {
            areaId: query.areaId,
        }),
    };

    const [
        totalOutages,
        activeOutages,
        restoredOutages,
        plannedOutages,
        unexpectedOutages,
        criticalOutages,
        totalRestorations,
        completedRestorations,
        restorations,
    ] = await Promise.all([
        prisma.outage.count({
            where: outageWhere,
        }),

        prisma.outage.count({
            where: {
                ...outageWhere,
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
                ...outageWhere,
                status: OutageStatus.RESTORED,
            },
        }),

        prisma.outage.count({
            where: {
                ...outageWhere,
                type: OutageType.PLANNED,
            },
        }),

        prisma.outage.count({
            where: {
                ...outageWhere,
                type: OutageType.UNEXPECTED,
            },
        }),

        prisma.outage.count({
            where: {
                ...outageWhere,
                priority: Priority.CRITICAL,
            },
        }),

        prisma.restoration.count({
            where: {
                ...(createdAtFilter && {
                    createdAt: createdAtFilter,
                }),
            },
        }),

        prisma.restoration.count({
            where: {
                status: RestorationStatus.COMPLETED,
                ...(createdAtFilter && {
                    createdAt: createdAtFilter,
                }),
            },
        }),

        prisma.restoration.findMany({
            where: {
                status: RestorationStatus.COMPLETED,
                startedAt: {
                    not: null,
                },
                completedAt: {
                    not: null,
                },
                ...(createdAtFilter && {
                    createdAt: createdAtFilter,
                }),
            },
            select: {
                duration: true,
            },
        }),
    ]);

    const durations = restorations
        .map((item) => item.duration ?? 0)
        .filter((duration) => duration >= 0);

    const totalDowntimeMinutes = durations.reduce(
        (sum, duration) => sum + duration,
        0,
    );

    const averageRestorationMinutes =
        durations.length > 0
            ? Math.round(totalDowntimeMinutes / durations.length)
            : 0;

    return {
        totalOutages,
        activeOutages,
        restoredOutages,
        plannedOutages,
        unexpectedOutages,
        criticalOutages,

        totalRestorations,
        completedRestorations,

        totalDowntimeMinutes,
        averageRestorationMinutes,
    };
};

const getOutageAnalyticsFromDB = async (query: IAnalyticsQuery) => {
    const { startDate, endDate } = buildDateFilter(query);

    const createdAtFilter =
        startDate || endDate
            ? {
                  ...(startDate && { gte: startDate }),
                  ...(endDate && { lte: endDate }),
              }
            : undefined;

    const where = {
        deletedAt: null,
        ...(createdAtFilter && {
            createdAt: createdAtFilter,
        }),
        ...(query.areaId && {
            areaId: query.areaId,
        }),
    };

    const [
        planned,
        unexpected,

        low,
        medium,
        high,
        critical,

        reported,
        verified,
        assigned,
        inProgress,
        restored,
        closed,
        cancelled,
    ] = await Promise.all([
        prisma.outage.count({
            where: {
                ...where,
                type: OutageType.PLANNED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                type: OutageType.UNEXPECTED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                priority: Priority.LOW,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                priority: Priority.MEDIUM,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                priority: Priority.HIGH,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                priority: Priority.CRITICAL,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.REPORTED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.VERIFIED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.ASSIGNED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.IN_PROGRESS,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.RESTORED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.CLOSED,
            },
        }),

        prisma.outage.count({
            where: {
                ...where,
                status: OutageStatus.CANCELLED,
            },
        }),
    ]);

    return {
        byType: [
            {
                type: OutageType.PLANNED,
                count: planned,
            },
            {
                type: OutageType.UNEXPECTED,
                count: unexpected,
            },
        ],

        byPriority: [
            {
                priority: Priority.LOW,
                count: low,
            },
            {
                priority: Priority.MEDIUM,
                count: medium,
            },
            {
                priority: Priority.HIGH,
                count: high,
            },
            {
                priority: Priority.CRITICAL,
                count: critical,
            },
        ],

        byStatus: [
            {
                status: OutageStatus.REPORTED,
                count: reported,
            },
            {
                status: OutageStatus.VERIFIED,
                count: verified,
            },
            {
                status: OutageStatus.ASSIGNED,
                count: assigned,
            },
            {
                status: OutageStatus.IN_PROGRESS,
                count: inProgress,
            },
            {
                status: OutageStatus.RESTORED,
                count: restored,
            },
            {
                status: OutageStatus.CLOSED,
                count: closed,
            },
            {
                status: OutageStatus.CANCELLED,
                count: cancelled,
            },
        ],
    };
};

export const analyticsServices = {
    getOverviewAnalyticsFromDB,
    getOutageAnalyticsFromDB,
};
