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

    // Convert query params to numbers
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);

    const skip = (pageNumber - 1) * limitNumber;

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

    // Handle isActive safely
    if (isActive !== undefined) {
        const activeValue =
            typeof isActive === 'boolean'
                ? isActive
                : String(isActive).toLowerCase() === 'true';

        andConditions.push({
            isActive: activeValue,
        });
    }

    const whereConditions: Prisma.AreaWhereInput = {
        AND: andConditions,
    };

    const [areas, total] = await Promise.all([
        prisma.area.findMany({
            where: whereConditions,
            skip,
            take: limitNumber,
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
        data: areas,
        meta: {
            page: pageNumber,
            limit: limitNumber,
            total,
            totalPages: Math.ceil(total / limitNumber),
        },
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
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    await prisma.area.delete({
        where: {
            id,
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
