"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.automatedScheduleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const createDateTime = (date, time) => {
    const dateTime = new Date(`${date}T${time}:00`);
    if (Number.isNaN(dateTime.getTime())) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Invalid date/time: ${date} ${time}`);
    }
    return dateTime;
};
const validateScheduleTime = (startTime, endTime) => {
    if (startTime >= endTime) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'End time must be greater than start time');
    }
    const durationMinutes = (endTime.getTime() - startTime.getTime()) / 60000;
    if (durationMinutes < 15) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Schedule duration must be at least 15 minutes');
    }
    if (durationMinutes > 24 * 60) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Schedule duration cannot exceed 24 hours');
    }
};
const generateSchedulesIntoDB = async (createdById, payload) => {
    const { areaIds, date, startTime: start, endTime: end, title, description, } = payload;
    const startDateTime = createDateTime(date, start);
    const endDateTime = createDateTime(date, end);
    validateScheduleTime(startDateTime, endDateTime);
    const uniqueAreaIds = [...new Set(areaIds)];
    const areas = await prisma_1.prisma.area.findMany({
        where: {
            id: {
                in: uniqueAreaIds,
            },
            isActive: true,
            deletedAt: null,
        },
        select: {
            id: true,
            name: true,
            code: true,
        },
    });
    if (areas.length !== uniqueAreaIds.length) {
        const foundIds = new Set(areas.map((area) => area.id));
        const missingAreaIds = uniqueAreaIds.filter((id) => !foundIds.has(id));
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, `Active area not found: ${missingAreaIds.join(', ')}`);
    }
    /*
     * Conflict condition:
     *
     * Existing start < new end
     * AND
     * Existing end > new start
     *
     * Example:
     *
     * Existing: 10:00 - 12:00
     * New:      11:00 - 13:00
     *
     * => conflict
     */
    const conflicts = await prisma_1.prisma.loadSheddingSchedule.findMany({
        where: {
            areaId: {
                in: uniqueAreaIds,
            },
            deletedAt: null,
            status: {
                notIn: [enums_1.ScheduleStatus.CANCELLED, enums_1.ScheduleStatus.COMPLETED],
            },
            startTime: {
                lt: endDateTime,
            },
            endTime: {
                gt: startDateTime,
            },
        },
        select: {
            id: true,
            areaId: true,
            title: true,
            startTime: true,
            endTime: true,
            status: true,
        },
    });
    if (conflicts.length > 0) {
        const conflictAreaIds = [
            ...new Set(conflicts.map((conflict) => conflict.areaId)),
        ];
        const conflictAreas = areas.filter((area) => conflictAreaIds.includes(area.id));
        const conflictNames = conflictAreas
            .map((area) => `${area.name} (${area.code})`)
            .join(', ');
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, `Schedule conflict detected for: ${conflictNames}`);
    }
    const schedules = await prisma_1.prisma.$transaction(uniqueAreaIds.map((areaId) => {
        const area = areas.find((item) => item.id === areaId);
        return prisma_1.prisma.loadSheddingSchedule.create({
            data: {
                areaId,
                title: title ??
                    `Automated Load Shedding - ${area?.name ?? 'Area'}`,
                description: description ??
                    `Automatically generated load shedding schedule for ${area?.name ?? 'the selected area'}.`,
                startTime: startDateTime,
                endTime: endDateTime,
                status: enums_1.ScheduleStatus.DRAFT,
                createdById,
            },
            include: {
                area: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        });
    }));
    return schedules;
};
const getGeneratedSchedulesFromDB = async (query) => {
    const page = Math.max(Number(query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(query.limit) || 10, 1), 100);
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm?.trim();
    const where = {
        deletedAt: null,
        ...(searchTerm && {
            OR: [
                {
                    title: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    area: {
                        OR: [
                            {
                                name: {
                                    contains: searchTerm,
                                    mode: 'insensitive',
                                },
                            },
                            {
                                code: {
                                    contains: searchTerm,
                                    mode: 'insensitive',
                                },
                            },
                        ],
                    },
                },
            ],
        }),
        ...(query.areaId && {
            areaId: query.areaId,
        }),
        ...(query.status && {
            status: query.status,
        }),
        ...(query.startDate &&
            query.endDate && {
            startTime: {
                gte: new Date(`${query.startDate}T00:00:00`),
                lte: new Date(`${query.endDate}T23:59:59.999`),
            },
        }),
    };
    const [data, total] = await Promise.all([
        prisma_1.prisma.loadSheddingSchedule.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                startTime: 'desc',
            },
            include: {
                area: {
                    select: {
                        id: true,
                        name: true,
                        code: true,
                    },
                },
            },
        }),
        prisma_1.prisma.loadSheddingSchedule.count({
            where,
        }),
    ]);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
const getSingleGeneratedScheduleFromDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            area: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                    zoneId: true,
                    substationId: true,
                    feederId: true,
                },
            },
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Schedule not found');
    }
    return schedule;
};
const publishGeneratedScheduleIntoDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Schedule not found');
    }
    if (schedule.status !== enums_1.ScheduleStatus.DRAFT) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot publish schedule with status ${schedule.status}`);
    }
    const published = await prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: enums_1.ScheduleStatus.PUBLISHED,
        },
        include: {
            area: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    });
    return published;
};
const cancelGeneratedScheduleIntoDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Schedule not found');
    }
    if (schedule.status === enums_1.ScheduleStatus.COMPLETED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Completed schedule cannot be cancelled');
    }
    if (schedule.status === enums_1.ScheduleStatus.CANCELLED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Schedule is already cancelled');
    }
    return prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: enums_1.ScheduleStatus.CANCELLED,
        },
        include: {
            area: {
                select: {
                    id: true,
                    name: true,
                    code: true,
                },
            },
        },
    });
};
exports.automatedScheduleServices = {
    generateSchedulesIntoDB,
    getGeneratedSchedulesFromDB,
    getSingleGeneratedScheduleFromDB,
    publishGeneratedScheduleIntoDB,
    cancelGeneratedScheduleIntoDB,
};
