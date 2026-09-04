import httpStatus from 'http-status';
import { Prisma } from '../../../generated/prisma/client';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import {
    ICreateLoadSheddingSchedulePayload,
    IUpdateLoadSheddingSchedulePayload,
} from './loadSheddingSchedule.interface';

import { ScheduleStatus } from '../../../generated/prisma/enums';

const createLoadSheddingScheduleIntoDB = async (
    createdById: string,
    payload: ICreateLoadSheddingSchedulePayload,
) => {
    const { areaId, title, description, startTime, endTime, scheduleFee } =
        payload;

    // Check area
    const area = await prisma.area.findUnique({
        where: {
            id: areaId,
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area Not Found');
    }

    // Prevent overlapping schedule in same area
    const existingSchedule = await prisma.loadSheddingSchedule.findFirst({
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
                not: ScheduleStatus.CANCELLED,
            },
        },
    });

    if (existingSchedule) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Another load shedding schedule already exists for this area during the selected time',
        );
    }

    const result = await prisma.loadSheddingSchedule.create({
        data: {
            areaId,
            title,
            description,
            startTime,
            endTime,
            scheduleFee:
                scheduleFee !== undefined
                    ? new Prisma.Decimal(scheduleFee)
                    : undefined,
            createdById,
            status: ScheduleStatus.DRAFT,
        },
        include: {
            area: true,
        },
    });

    return result;
};

const getAllLoadSheddingSchedulesFromDB = async (query: any) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = query.searchTerm?.trim();

    const where: Prisma.LoadSheddingScheduleWhereInput = {
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
            ],
        }),

        ...(query.areaId && {
            areaId: query.areaId,
        }),

        ...(query.status && {
            status: query.status,
        }),
    };

    const [data, total] = await Promise.all([
        prisma.loadSheddingSchedule.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                startTime: 'asc',
            },
            include: {
                area: true,
            },
        }),

        prisma.loadSheddingSchedule.count({
            where,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data,
    };
};

const getSingleLoadSheddingScheduleFromDB = async (id: string) => {
    const result = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            area: true,
        },
    });

    if (!result) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    return result;
};

const updateLoadSheddingScheduleIntoDB = async (
    id: string,
    payload: IUpdateLoadSheddingSchedulePayload,
) => {
    const existingSchedule = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingSchedule) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    // Do not update completed/cancelled schedules
    if (
        existingSchedule.status === ScheduleStatus.COMPLETED ||
        existingSchedule.status === ScheduleStatus.CANCELLED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            `Cannot update a ${existingSchedule.status.toLowerCase()} schedule`,
        );
    }

    const startTime = payload.startTime ?? existingSchedule.startTime;
    const endTime = payload.endTime ?? existingSchedule.endTime;

    if (endTime <= startTime) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'End time must be after start time',
        );
    }

    const result = await prisma.loadSheddingSchedule.update({
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

            ...(payload.scheduleFee !== undefined && {
                scheduleFee:
                    payload.scheduleFee === null
                        ? null
                        : new Prisma.Decimal(payload.scheduleFee),
            }),
        },
        include: {
            area: true,
        },
    });

    return result;
};

const deleteLoadSheddingScheduleFromDB = async (id: string) => {
    const existingSchedule = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingSchedule) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    await prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            status: ScheduleStatus.CANCELLED,
        },
    });

    return null;
};

const publishLoadSheddingScheduleIntoDB = async (id: string) => {
    const schedule = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!schedule) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    if (schedule.status !== ScheduleStatus.DRAFT) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only draft schedules can be published',
        );
    }

    const result = await prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: ScheduleStatus.PUBLISHED,
        },
        include: {
            area: true,
        },
    });

    return result;
};

const activateLoadSheddingScheduleIntoDB = async (id: string) => {
    const schedule = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!schedule) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    if (schedule.status !== ScheduleStatus.PUBLISHED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only published schedules can be activated',
        );
    }

    const result = await prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: ScheduleStatus.ACTIVE,
        },
        include: {
            area: true,
        },
    });

    return result;
};

const completeLoadSheddingScheduleIntoDB = async (id: string) => {
    const schedule = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!schedule) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    if (schedule.status !== ScheduleStatus.ACTIVE) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only active schedules can be completed',
        );
    }

    const result = await prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: ScheduleStatus.COMPLETED,
        },
        include: {
            area: true,
        },
    });

    return result;
};

const cancelLoadSheddingScheduleIntoDB = async (id: string) => {
    const schedule = await prisma.loadSheddingSchedule.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!schedule) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Load Shedding Schedule Not Found',
        );
    }

    if (schedule.status === ScheduleStatus.COMPLETED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Completed schedule cannot be cancelled',
        );
    }

    if (schedule.status === ScheduleStatus.CANCELLED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Schedule is already cancelled',
        );
    }

    const result = await prisma.loadSheddingSchedule.update({
        where: {
            id,
        },
        data: {
            status: ScheduleStatus.CANCELLED,
        },
        include: {
            area: true,
        },
    });

    return result;
};

const getUpcomingLoadSheddingSchedulesFromDB = async () => {
    const now = new Date();

    const result = await prisma.loadSheddingSchedule.findMany({
        where: {
            deletedAt: null,
            startTime: {
                gt: now,
            },
            status: ScheduleStatus.COMPLETED,
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

export const loadSheddingScheduleServices = {
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
