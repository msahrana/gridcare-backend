import httpStatus from 'http-status';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import type { ICreateZonePayload, IUpdateZonePayload } from './zone.interface';
import { IQuery } from '../../interfaces';
import { Prisma } from '../../../generated/prisma/client';

const createZoneIntoDB = async (payload: ICreateZonePayload) => {
    // Check duplicate zone name
    const existingZoneByName = await prisma.zone.findFirst({
        where: {
            name: payload.name,
            deletedAt: null,
        },
    });

    if (existingZoneByName) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A zone with this name already exists.',
        );
    }

    // Check duplicate zone code
    const existingZoneByCode = await prisma.zone.findUnique({
        where: {
            code: payload.code,
        },
    });

    if (existingZoneByCode && existingZoneByCode.deletedAt === null) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A zone with this code already exists.',
        );
    }

    const zone = await prisma.zone.create({
        data: {
            name: payload.name,
            code: payload.code,
            description: payload.description,
            isActive: payload.isActive ?? true,
        },
    });

    return zone;
};

const getAllZonesFromDB = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const andConditions: Prisma.ZoneWhereInput[] = [];

    // Searching
    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    name: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    code: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
            ],
        });
    }

    // Only non-deleted zones
    andConditions.push({
        deletedAt: null,
    });

    const allZones = await prisma.zone.findMany({
        where: {
            AND: andConditions,
        },

        take: limit,
        skip,

        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const totalZoneCount = await prisma.zone.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: allZones,

        meta: {
            page,
            limit,
            total: totalZoneCount,
            totalPages: Math.ceil(totalZoneCount / limit),
        },
    };
};

const getSingleZoneFromDB = async (id: string) => {
    const zone = await prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!zone) {
        throw new AppError(httpStatus.NOT_FOUND, 'Zone not found.');
    }

    return zone;
};

const updateZoneIntoDB = async (id: string, payload: IUpdateZonePayload) => {
    // Check existing zone
    const existingZone = await prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingZone) {
        throw new AppError(httpStatus.NOT_FOUND, 'Zone not found.');
    }

    // Check duplicate name
    if (payload.name) {
        const duplicateName = await prisma.zone.findFirst({
            where: {
                name: payload.name,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });

        if (duplicateName) {
            throw new AppError(
                httpStatus.CONFLICT,
                'A zone with this name already exists.',
            );
        }
    }

    // Check duplicate code
    if (payload.code) {
        const duplicateCode = await prisma.zone.findFirst({
            where: {
                code: payload.code,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });

        if (duplicateCode) {
            throw new AppError(
                httpStatus.CONFLICT,
                'A zone with this code already exists.',
            );
        }
    }

    const updatedZone = await prisma.zone.update({
        where: {
            id,
        },
        data: {
            ...(payload.name !== undefined && {
                name: payload.name,
            }),

            ...(payload.code !== undefined && {
                code: payload.code,
            }),

            ...(payload.description !== undefined && {
                description: payload.description,
            }),

            ...(payload.isActive !== undefined && {
                isActive: payload.isActive,
            }),
        },
    });

    return updatedZone;
};

const deleteZoneFromDB = async (id: string) => {
    const existingZone = await prisma.zone.findUnique({
        where: {
            id,
        },
    });

    if (!existingZone) {
        throw new AppError(httpStatus.NOT_FOUND, 'Zone not found.');
    }

    await prisma.zone.delete({
        where: {
            id,
        },
    });

    return null;
};

export const zoneServices = {
    createZoneIntoDB,
    getAllZonesFromDB,
    getSingleZoneFromDB,
    updateZoneIntoDB,
    deleteZoneFromDB,
};
