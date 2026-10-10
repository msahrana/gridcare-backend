"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadSheddingScheduleServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const client_1 = require("../../../generated/prisma/client");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const enums_1 = require("../../../generated/prisma/enums");
const createLoadSheddingScheduleIntoDB = async (createdById, payload) => {
    const { areaId, title, description, startTime, endTime, scheduleFee } = payload;
    // Check area
    const area = await prisma_1.prisma.area.findUnique({
        where: {
            id: areaId,
        },
    });
    if (!area) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area Not Found');
    }
    // Prevent overlapping schedule in same area
    const existingSchedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            areaId,
            deletedAt: null,
            startTime: {
                lt: endTime,
            },
            endTime: {
                gt: startTime,
            },
            status: {
                not: enums_1.ScheduleStatus.CANCELLED,
            },
        },
    });
    if (existingSchedule) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Another load shedding schedule already exists for this area during the selected time');
    }
    const result = await prisma_1.prisma.loadSheddingSchedule.create({
        data: {
            areaId,
            title,
            description,
            startTime,
            endTime,
            scheduleFee: scheduleFee !== undefined
                ? new client_1.Prisma.Decimal(scheduleFee)
                : undefined,
            createdById,
            status: enums_1.ScheduleStatus.DRAFT,
        },
        include: {
            area: true,
        },
    });
    return result;
};
const getAllLoadSheddingSchedulesFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = query.searchTerm?.trim();
    const where = {
        deletedAt: null,
        ...(searchTerm && {
            OR: [
                { title: { contains: searchTerm, mode: 'insensitive' } },
                { description: { contains: searchTerm, mode: 'insensitive' } },
            ],
        }),
        ...(query.areaId && { areaId: query.areaId }),
        ...(query.status && { status: query.status }),
    };
    const [data, total] = await Promise.all([
        prisma_1.prisma.loadSheddingSchedule.findMany({
            where,
            skip,
            take: limit,
            orderBy: { startTime: 'asc' },
            include: { area: true },
        }),
        prisma_1.prisma.loadSheddingSchedule.count({ where }),
    ]);
    return {
        data,
        meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
};
const getSingleLoadSheddingScheduleFromDB = async (id) => {
    const result = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            area: true,
        },
    });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    return result;
};
const updateLoadSheddingScheduleIntoDB = async (id, payload) => {
    const existingSchedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingSchedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    // Do not update completed/cancelled schedules
    if (existingSchedule.status === enums_1.ScheduleStatus.COMPLETED ||
        existingSchedule.status === enums_1.ScheduleStatus.CANCELLED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `Cannot update a ${existingSchedule.status.toLowerCase()} schedule`);
    }
    const startTime = payload.startTime ?? existingSchedule.startTime;
    const endTime = payload.endTime ?? existingSchedule.endTime;
    if (endTime <= startTime) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'End time must be after start time');
    }
    const result = await prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            ...(payload.areaId !== undefined && {
                areaId: payload.areaId,
            }),
            ...(payload.title !== undefined && {
                title: payload.title,
            }),
            ...(payload.description !== undefined && {
                description: payload.description,
            }),
            ...(payload.startTime !== undefined && {
                startTime: payload.startTime,
            }),
            ...(payload.endTime !== undefined && {
                endTime: payload.endTime,
            }),
        },
        include: {
            area: true,
        },
    });
    return result;
};
const deleteLoadSheddingScheduleFromDB = async (id) => {
    const existingSchedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
        },
    });
    if (!existingSchedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    await prisma_1.prisma.loadSheddingSchedule.delete({
        where: {
            id,
        },
    });
    return null;
};
const publishLoadSheddingScheduleIntoDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    if (schedule.status !== enums_1.ScheduleStatus.DRAFT) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Only draft schedules can be published');
    }
    const result = await prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: enums_1.ScheduleStatus.PUBLISHED,
        },
        include: {
            area: true,
        },
    });
    return result;
};
const activateLoadSheddingScheduleIntoDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    if (schedule.status !== enums_1.ScheduleStatus.PUBLISHED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Only published schedules can be activated');
    }
    const result = await prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: enums_1.ScheduleStatus.ACTIVE,
        },
        include: {
            area: true,
        },
    });
    return result;
};
const completeLoadSheddingScheduleIntoDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    if (schedule.status !== enums_1.ScheduleStatus.ACTIVE) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Only active schedules can be completed');
    }
    const result = await prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: enums_1.ScheduleStatus.COMPLETED,
        },
        include: {
            area: true,
        },
    });
    return result;
};
const cancelLoadSheddingScheduleIntoDB = async (id) => {
    const schedule = await prisma_1.prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!schedule) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Load Shedding Schedule Not Found');
    }
    if (schedule.status === enums_1.ScheduleStatus.COMPLETED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Completed schedule cannot be cancelled');
    }
    if (schedule.status === enums_1.ScheduleStatus.CANCELLED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Schedule is already cancelled');
    }
    const result = await prisma_1.prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: enums_1.ScheduleStatus.CANCELLED,
        },
        include: {
            area: true,
        },
    });
    return result;
};
const getUpcomingLoadSheddingSchedulesFromDB = async () => {
    const now = new Date();
    const result = await prisma_1.prisma.loadSheddingSchedule.findMany({
        where: {
            deletedAt: null,
            startTime: {
                gt: now,
            },
            status: enums_1.ScheduleStatus.COMPLETED,
        },
        orderBy: {
            startTime: 'asc',
        },
        include: {
            area: true,
        },
    });
    return result;
};
exports.loadSheddingScheduleServices = {
    createLoadSheddingScheduleIntoDB,
    getAllLoadSheddingSchedulesFromDB,
    getSingleLoadSheddingScheduleFromDB,
    updateLoadSheddingScheduleIntoDB,
    deleteLoadSheddingScheduleFromDB,
    publishLoadSheddingScheduleIntoDB,
    activateLoadSheddingScheduleIntoDB,
    completeLoadSheddingScheduleIntoDB,
    cancelLoadSheddingScheduleIntoDB,
    getUpcomingLoadSheddingSchedulesFromDB,
};
