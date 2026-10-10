"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.analyticsServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const buildDateFilter = (query) => {
    const { startDate, endDate } = query;
    if (!startDate && !endDate) {
        return {};
    }
    const filter = {};
    if (startDate) {
        const date = new Date(startDate);
        if (Number.isNaN(date.getTime())) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid startDate');
        }
        filter.startDate = date;
    }
    if (endDate) {
        const date = new Date(endDate);
        if (Number.isNaN(date.getTime())) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid endDate');
        }
        // Include the complete end date
        date.setHours(23, 59, 59, 999);
        filter.endDate = date;
    }
    return filter;
};
const getOverviewAnalyticsFromDB = async (query) => {
    const { startDate, endDate } = buildDateFilter(query);
    const createdAtFilter = startDate || endDate
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
    const [totalOutages, activeOutages, restoredOutages, plannedOutages, unexpectedOutages, criticalOutages, totalRestorations, completedRestorations, restorations,] = await Promise.all([
        prisma_1.prisma.outage.count({
            where: outageWhere,
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...outageWhere,
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
                ...outageWhere,
                status: enums_1.OutageStatus.RESTORED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...outageWhere,
                type: enums_1.OutageType.PLANNED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...outageWhere,
                type: enums_1.OutageType.UNEXPECTED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...outageWhere,
                priority: enums_1.Priority.CRITICAL,
            },
        }),
        prisma_1.prisma.restoration.count({
            where: {
                ...(createdAtFilter && {
                    createdAt: createdAtFilter,
                }),
            },
        }),
        prisma_1.prisma.restoration.count({
            where: {
                status: enums_1.RestorationStatus.COMPLETED,
                ...(createdAtFilter && {
                    createdAt: createdAtFilter,
                }),
            },
        }),
        prisma_1.prisma.restoration.findMany({
            where: {
                status: enums_1.RestorationStatus.COMPLETED,
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
    const totalDowntimeMinutes = durations.reduce((sum, duration) => sum + duration, 0);
    const averageRestorationMinutes = durations.length > 0
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
const getOutageAnalyticsFromDB = async (query) => {
    const { startDate, endDate } = buildDateFilter(query);
    const createdAtFilter = startDate || endDate
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
    const [planned, unexpected, low, medium, high, critical, reported, verified, assigned, inProgress, restored, closed, cancelled,] = await Promise.all([
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                type: enums_1.OutageType.PLANNED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                type: enums_1.OutageType.UNEXPECTED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                priority: enums_1.Priority.LOW,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                priority: enums_1.Priority.MEDIUM,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                priority: enums_1.Priority.HIGH,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                priority: enums_1.Priority.CRITICAL,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.REPORTED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.VERIFIED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.ASSIGNED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.IN_PROGRESS,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.RESTORED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.CLOSED,
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                ...where,
                status: enums_1.OutageStatus.CANCELLED,
            },
        }),
    ]);
    return {
        byType: [
            {
                type: enums_1.OutageType.PLANNED,
                count: planned,
            },
            {
                type: enums_1.OutageType.UNEXPECTED,
                count: unexpected,
            },
        ],
        byPriority: [
            {
                priority: enums_1.Priority.LOW,
                count: low,
            },
            {
                priority: enums_1.Priority.MEDIUM,
                count: medium,
            },
            {
                priority: enums_1.Priority.HIGH,
                count: high,
            },
            {
                priority: enums_1.Priority.CRITICAL,
                count: critical,
            },
        ],
        byStatus: [
            {
                status: enums_1.OutageStatus.REPORTED,
                count: reported,
            },
            {
                status: enums_1.OutageStatus.VERIFIED,
                count: verified,
            },
            {
                status: enums_1.OutageStatus.ASSIGNED,
                count: assigned,
            },
            {
                status: enums_1.OutageStatus.IN_PROGRESS,
                count: inProgress,
            },
            {
                status: enums_1.OutageStatus.RESTORED,
                count: restored,
            },
            {
                status: enums_1.OutageStatus.CLOSED,
                count: closed,
            },
            {
                status: enums_1.OutageStatus.CANCELLED,
                count: cancelled,
            },
        ],
    };
};
exports.analyticsServices = {
    getOverviewAnalyticsFromDB,
    getOutageAnalyticsFromDB,
};
