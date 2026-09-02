import httpStatus from 'http-status';

import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import type {
    ICreateSubstationPayload,
    IUpdateSubstationPayload,
} from './substation.interface';

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

const getAllSubstationsFromDB = async () => {
    const substations = await prisma.substation.findMany({
        where: {
            deletedAt: null,
        },
        include: {
            zone: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return substations;
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

    // Soft delete
    const deletedSubstation = await prisma.substation.update({
        where: {
            id,
        },
        data: {
            deletedAt: new Date(),
            isActive: false,
        },
    });

    return deletedSubstation;
};

export const substationServices = {
    createSubstationIntoDB,
    getAllSubstationsFromDB,
    getSingleSubstationFromDB,
    updateSubstationIntoDB,
    deleteSubstationFromDB,
};
