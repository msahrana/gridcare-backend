import httpStatus from 'http-status';

import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import type {
    ICreateSubstationPayload,
    IUpdateSubstationPayload,
} from './substation.interface';
import { IQuery } from '../../interfaces';
import { Prisma } from '../../../generated/prisma/client';

const createSubstationIntoDB = async (payload: ICreateSubstationPayload) => {
    // Check Zone exists
    const zone = await prisma.zone.findFirst({
        where: {
            id: payload.zoneId,
            deletedAt: null,
        },
    });

    if (!zone) {
        throw new AppError(httpStatus.NOT_FOUND, 'Zone not found.');
    }

    // Check Zone is active
    if (!zone.isActive) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot create substation under an inactive zone.',
        );
    }

    // Check duplicate substation name
    const existingSubstationByName = await prisma.substation.findFirst({
        where: {
            name: payload.name,
            deletedAt: null,
        },
    });

    if (existingSubstationByName) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A substation with this name already exists.',
        );
    }

    // Check duplicate substation code
    const existingSubstationByCode = await prisma.substation.findUnique({
        where: {
            code: payload.code,
        },
    });

    if (
        existingSubstationByCode &&
        existingSubstationByCode.deletedAt === null
    ) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A substation with this code already exists.',
        );
    }

    // Create substation
    const substation = await prisma.substation.create({
        data: {
            name: payload.name,
            code: payload.code,
            zoneId: payload.zoneId,
            capacity: payload.capacity,
            isActive: payload.isActive ?? true,
        },
        include: {
            zone: true,
        },
    });

    return substation;
};

const getAllSubstationsFromDB = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const andConditions: Prisma.SubstationWhereInput[] = [];

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

    andConditions.push({
        deletedAt: null,
    });

    const allSubstations = await prisma.substation.findMany({
        where: {
            AND: andConditions,
        },
        include: {
            zone: true,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const totalSubstationCount = await prisma.substation.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: allSubstations,
        meta: {
            page,
            limit,
            total: totalSubstationCount,
            totalPages: Math.ceil(totalSubstationCount / limit),
        },
    };
};

const getSingleSubstationFromDB = async (id: string) => {
    const substation = await prisma.substation.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            zone: true,
        },
    });

    if (!substation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Substation not found.');
    }

    return substation;
};

const updateSubstationIntoDB = async (
    id: string,
    payload: IUpdateSubstationPayload,
) => {
    // Check existing substation
    const existingSubstation = await prisma.substation.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingSubstation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Substation not found.');
    }

    // If zoneId is provided, check new Zone
    if (payload.zoneId) {
        const zone = await prisma.zone.findFirst({
            where: {
                id: payload.zoneId,
                deletedAt: null,
            },
        });

        if (!zone) {
            throw new AppError(httpStatus.NOT_FOUND, 'Zone not found.');
        }

        if (!zone.isActive) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Cannot assign substation to an inactive zone.',
            );
        }
    }

    // Check duplicate name
    if (payload.name) {
        const duplicateName = await prisma.substation.findFirst({
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
                'A substation with this name already exists.',
            );
        }
    }

    // Check duplicate code
    if (payload.code) {
        const duplicateCode = await prisma.substation.findFirst({
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
                'A substation with this code already exists.',
            );
        }
    }

    // Update substation
    const updatedSubstation = await prisma.substation.update({
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

            ...(payload.zoneId !== undefined && {
                zoneId: payload.zoneId,
            }),

            ...(payload.capacity !== undefined && {
                capacity: payload.capacity,
            }),

            ...(payload.isActive !== undefined && {
                isActive: payload.isActive,
            }),
        },
        include: {
            zone: true,
        },
    });

    return updatedSubstation;
};

const deleteSubstationFromDB = async (id: string) => {
    const existingSubstation = await prisma.substation.findFirst({
        where: {
            id,
        },
    });

    if (!existingSubstation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Substation not found.');
    }

    await prisma.substation.delete({
        where: {
            id,
        },
    });

    return null;
};

export const substationServices = {
    createSubstationIntoDB,
    getAllSubstationsFromDB,
    getSingleSubstationFromDB,
    updateSubstationIntoDB,
    deleteSubstationFromDB,
};
