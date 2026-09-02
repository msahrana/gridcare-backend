import httpStatus from 'http-status';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import type { ICreateZonePayload, IUpdateZonePayload } from './zone.interface';

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

const getAllZonesFromDB = async () => {
    const zones = await prisma.zone.findMany({
        where: {
            deletedAt: null,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return zones;
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
    const existingZone = await prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingZone) {
        throw new AppError(httpStatus.NOT_FOUND, 'Zone not found.');
    }

    const deletedZone = await prisma.zone.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            isActive: false,
        },
    });

    return deletedZone;
};

export const zoneServices = {
    createZoneIntoDB,
    getAllZonesFromDB,
    getSingleZoneFromDB,
    updateZoneIntoDB,
    deleteZoneFromDB,
};
