"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.feederServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
const createFeederIntoDB = async (payload) => {
    // Check Substation exists
    const substation = await prisma_1.prisma.substation.findFirst({
        where: {
            id: payload.substationId,
            deletedAt: null,
        },
    });
    if (!substation) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Substation not found.');
    }
    // Check Substation is active
    if (!substation.isActive) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot create feeder under an inactive substation.');
    }
    // Check duplicate feeder name
    const existingFeederByName = await prisma_1.prisma.feeder.findFirst({
        where: {
            name: payload.name,
            substationId: payload.substationId,
            deletedAt: null,
        },
    });
    if (existingFeederByName) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A feeder with this name already exists under this substation.');
    }
    // Check duplicate feeder code
    const existingFeederByCode = await prisma_1.prisma.feeder.findUnique({
        where: {
            code: payload.code,
        },
    });
    if (existingFeederByCode && existingFeederByCode.deletedAt === null) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A feeder with this code already exists.');
    }
    // Create feeder
    const feeder = await prisma_1.prisma.feeder.create({
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
const getAllFeedersFromDB = async (query) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const andConditions = [];
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
    const allFeeders = await prisma_1.prisma.feeder.findMany({
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
    const totalFeederCount = await prisma_1.prisma.feeder.count({
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
const getSingleFeederFromDB = async (id) => {
    const feeder = await prisma_1.prisma.feeder.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            substation: true,
        },
    });
    if (!feeder) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Feeder not found.');
    }
    return feeder;
};
const updateFeederIntoDB = async (id, payload) => {
    // Check existing feeder
    const existingFeeder = await prisma_1.prisma.feeder.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingFeeder) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Feeder not found.');
    }
    // If substationId is provided
    if (payload.substationId) {
        const substation = await prisma_1.prisma.substation.findFirst({
            where: {
                id: payload.substationId,
                deletedAt: null,
            },
        });
        if (!substation) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Substation not found.');
        }
        if (!substation.isActive) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot assign feeder to an inactive substation.');
        }
    }
    const targetSubstationId = payload.substationId ?? existingFeeder.substationId;
    // Check duplicate name
    if (payload.name) {
        const duplicateName = await prisma_1.prisma.feeder.findFirst({
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
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A feeder with this name already exists under this substation.');
        }
    }
    // Check duplicate code
    if (payload.code) {
        const duplicateCode = await prisma_1.prisma.feeder.findFirst({
            where: {
                code: payload.code,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });
        if (duplicateCode) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A feeder with this code already exists.');
        }
    }
    // Update feeder
    const updatedFeeder = await prisma_1.prisma.feeder.update({
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
const deleteFeederFromDB = async (id) => {
    // Check existing feeder
    const existingFeeder = await prisma_1.prisma.feeder.findFirst({
        where: {
            id,
        },
    });
    if (!existingFeeder) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Feeder not found.');
    }
    await prisma_1.prisma.feeder.delete({
        where: {
            id,
        },
    });
    return null;
};
exports.feederServices = {
    createFeederIntoDB,
    getAllFeedersFromDB,
    getSingleFeederFromDB,
    updateFeederIntoDB,
    deleteFeederFromDB,
};
