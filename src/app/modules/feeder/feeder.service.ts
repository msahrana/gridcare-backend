import httpStatus from 'http-status';

import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import type {
    ICreateFeederPayload,
    IUpdateFeederPayload,
} from './feeder.interface';
import { IQuery } from '../../interfaces';
import { Prisma } from '../../../generated/prisma/client';

const createFeederIntoDB = async (payload: ICreateFeederPayload) => {
    // Check Substation exists
    const substation = await prisma.substation.findFirst({
        where: {
            id: payload.substationId,
            deletedAt: null,
        },
    });

    if (!substation) {
        throw new AppError(httpStatus.NOT_FOUND, 'Substation not found.');
    }

    // Check Substation is active
    if (!substation.isActive) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Cannot create feeder under an inactive substation.',
        );
    }

    // Check duplicate feeder name
    const existingFeederByName = await prisma.feeder.findFirst({
        where: {
            name: payload.name,
            substationId: payload.substationId,
            deletedAt: null,
        },
    });

    if (existingFeederByName) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A feeder with this name already exists under this substation.',
        );
    }

    // Check duplicate feeder code
    const existingFeederByCode = await prisma.feeder.findUnique({
        where: {
            code: payload.code,
        },
    });

    if (existingFeederByCode && existingFeederByCode.deletedAt === null) {
        throw new AppError(
            httpStatus.CONFLICT,
            'A feeder with this code already exists.',
        );
    }

    // Create feeder
    const feeder = await prisma.feeder.create({
        data: {
            name: payload.name,
            code: payload.code,
            substationId: payload.substationId,
            status: payload.status,
        },
        include: {
            substation: true,
        },
    });

    return feeder;
};

const getAllFeedersFromDB = async (query: IQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';

    const andConditions: Prisma.FeederWhereInput[] = [];

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

    const allFeeders = await prisma.feeder.findMany({
        where: {
            AND: andConditions,
        },
        include: {
            substation: true,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });

    const totalFeederCount = await prisma.feeder.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: allFeeders,
        meta: {
            page,
            limit,
            total: totalFeederCount,
            totalPages: Math.ceil(totalFeederCount / limit),
        },
    };
};

const getSingleFeederFromDB = async (id: string) => {
    const feeder = await prisma.feeder.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            substation: true,
        },
    });

    if (!feeder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Feeder not found.');
    }

    return feeder;
};

const updateFeederIntoDB = async (
    id: string,
    payload: IUpdateFeederPayload,
) => {
    // Check existing feeder
    const existingFeeder = await prisma.feeder.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingFeeder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Feeder not found.');
    }

    // If substationId is provided
    if (payload.substationId) {
        const substation = await prisma.substation.findFirst({
            where: {
                id: payload.substationId,
                deletedAt: null,
            },
        });

        if (!substation) {
            throw new AppError(httpStatus.NOT_FOUND, 'Substation not found.');
        }

        if (!substation.isActive) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Cannot assign feeder to an inactive substation.',
            );
        }
    }

    const targetSubstationId =
        payload.substationId ?? existingFeeder.substationId;

    // Check duplicate name
    if (payload.name) {
        const duplicateName = await prisma.feeder.findFirst({
            where: {
                name: payload.name,
                substationId: targetSubstationId,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });

        if (duplicateName) {
            throw new AppError(
                httpStatus.CONFLICT,
                'A feeder with this name already exists under this substation.',
            );
        }
    }

    // Check duplicate code
    if (payload.code) {
        const duplicateCode = await prisma.feeder.findFirst({
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
                'A feeder with this code already exists.',
            );
        }
    }

    // Update feeder
    const updatedFeeder = await prisma.feeder.update({
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

            ...(payload.substationId !== undefined && {
                substationId: payload.substationId,
            }),

            ...(payload.status !== undefined && {
                status: payload.status,
            }),
        },
        include: {
            substation: true,
        },
    });

    return updatedFeeder;
};

const deleteFeederFromDB = async (id: string) => {
    // Check existing feeder
    const existingFeeder = await prisma.feeder.findFirst({
        where: {
            id,
        },
    });

    if (!existingFeeder) {
        throw new AppError(httpStatus.NOT_FOUND, 'Feeder not found.');
    }

    await prisma.feeder.delete({
        where: {
            id,
        },
    });

    return null;
};

export const feederServices = {
    createFeederIntoDB,
    getAllFeedersFromDB,
    getSingleFeederFromDB,
    updateFeederIntoDB,
    deleteFeederFromDB,
};
