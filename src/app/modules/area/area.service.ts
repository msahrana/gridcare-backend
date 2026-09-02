import httpStatus from 'http-status';
import {
    IAreaQuery,
    ICreateAreaPayload,
    IUpdateAreaPayload,
} from './area.interface';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';
import { Prisma } from '../../../generated/prisma/browser';

const createAreaIntoDB = async (payload: ICreateAreaPayload) => {
    const existingArea = await prisma.area.findFirst({
        where: {
            OR: [
                {
                    code: payload.code,
                },
                {
                    name: payload.name,
                    zoneId: payload.zoneId,
                },
            ],
            deletedAt: null,
        },
    });

    if (existingArea) {
        throw new AppError(
            httpStatus.CONFLICT,
            'Area with this code or name already exists',
        );
    }

    const area = await prisma.area.create({
        data: payload,
        include: {
            zone: true,
            substation: true,
            feeder: true,
        },
    });

    return area;
};

const getAllAreasFromDB = async (query: IAreaQuery) => {
    const {
        page = 1,
        limit = 10,
        search,
        zoneId,
        substationId,
        feederId,
        isActive,
    } = query;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.AreaWhereInput[] = [
        {
            deletedAt: null,
        },
    ];

    if (search) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    code: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    address: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        });
    }

    if (zoneId) {
        andConditions.push({
            zoneId,
        });
    }

    if (substationId) {
        andConditions.push({
            substationId,
        });
    }

    if (feederId) {
        andConditions.push({
            feederId,
        });
    }

    if (isActive !== undefined) {
        andConditions.push({
            isActive,
        });
    }

    const whereConditions: Prisma.AreaWhereInput = {
        AND: andConditions,
    };

    const [areas, total] = await Promise.all([
        prisma.area.findMany({
            where: whereConditions,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                zone: true,
                substation: true,
                feeder: true,
            },
        }),

        prisma.area.count({
            where: whereConditions,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: areas,
    };
};

const getAreaByIdFromDB = async (id: string) => {
    const area = await prisma.area.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            zone: true,
            substation: true,
            feeder: true,
            schedules: true,
            outages: true,
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    return area;
};

const updateAreaIntoDB = async (id: string, payload: IUpdateAreaPayload) => {
    const existingArea = await prisma.area.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingArea) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    if (payload.code) {
        const duplicateCode = await prisma.area.findFirst({
            where: {
                code: payload.code as string,
                id: {
                    not: id,
                },
                deletedAt: null,
            },
        });

        if (duplicateCode) {
            throw new AppError(httpStatus.CONFLICT, 'Area code already exists');
        }
    }

    const area = await prisma.area.update({
        where: {
            id,
        },
        data: payload,
        include: {
            zone: true,
            substation: true,
            feeder: true,
        },
    });

    return area;
};

const deleteAreaFromDB = async (id: string) => {
    const area = await prisma.area.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    await prisma.area.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            isActive: false,
        },
    });

    return null;
};

const searchAreasFromDB = async (search: string) => {
    if (!search?.trim()) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Search query is required');
    }

    const areas = await prisma.area.findMany({
        where: {
            deletedAt: null,
            OR: [
                {
                    name: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    code: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
                {
                    address: {
                        contains: search,
                        mode: 'insensitive',
                    },
                },
            ],
        },
        orderBy: {
            name: 'asc',
        },
        include: {
            zone: true,
            substation: true,
            feeder: true,
        },
    });

    return areas;
};

export const areaServices = {
    createAreaIntoDB,
    getAllAreasFromDB,
    getAreaByIdFromDB,
    updateAreaIntoDB,
    deleteAreaFromDB,
    searchAreasFromDB,
};
