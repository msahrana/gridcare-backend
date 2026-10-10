"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.substationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
const createSubstationIntoDB = async (payload) => {
    // Check Zone exists
    const zone = await prisma_1.prisma.zone.findFirst({
        where: {
            id: payload.zoneId,
            deletedAt: null,
        },
    });
    if (!zone) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Zone not found.');
    }
    // Check Zone is active
    if (!zone.isActive) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot create substation under an inactive zone.');
    }
    // Check duplicate substation name
    const existingSubstationByName = await prisma_1.prisma.substation.findFirst({
        where: {
            name: payload.name,
            deletedAt: null,
        },
    });
    if (existingSubstationByName) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A substation with this name already exists.');
    }
    // Check duplicate substation code
    const existingSubstationByCode = await prisma_1.prisma.substation.findUnique({
        where: {
            code: payload.code,
        },
    });
    if (existingSubstationByCode &&
        existingSubstationByCode.deletedAt === null) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A substation with this code already exists.');
    }
    // Create substation
    const substation = await prisma_1.prisma.substation.create({
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
const getAllSubstationsFromDB = async (query) => {
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
    const allSubstations = await prisma_1.prisma.substation.findMany({
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
    const totalSubstationCount = await prisma_1.prisma.substation.count({
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
const getSingleSubstationFromDB = async (id) => {
    const substation = await prisma_1.prisma.substation.findFirst({
        where: {
            id,
            deletedAt: null,
        },
        include: {
            zone: true,
        },
    });
    if (!substation) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Substation not found.');
    }
    return substation;
};
const updateSubstationIntoDB = async (id, payload) => {
    // Check existing substation
    const existingSubstation = await prisma_1.prisma.substation.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingSubstation) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Substation not found.');
    }
    // If zoneId is provided, check new Zone
    if (payload.zoneId) {
        const zone = await prisma_1.prisma.zone.findFirst({
            where: {
                id: payload.zoneId,
                deletedAt: null,
            },
        });
        if (!zone) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Zone not found.');
        }
        if (!zone.isActive) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot assign substation to an inactive zone.');
        }
    }
    // Check duplicate name
    if (payload.name) {
        const duplicateName = await prisma_1.prisma.substation.findFirst({
            where: {
                name: payload.name,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });
        if (duplicateName) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A substation with this name already exists.');
        }
    }
    // Check duplicate code
    if (payload.code) {
        const duplicateCode = await prisma_1.prisma.substation.findFirst({
            where: {
                code: payload.code,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });
        if (duplicateCode) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A substation with this code already exists.');
        }
    }
    // Update substation
    const updatedSubstation = await prisma_1.prisma.substation.update({
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
const deleteSubstationFromDB = async (id) => {
    const existingSubstation = await prisma_1.prisma.substation.findFirst({
        where: {
            id,
        },
    });
    if (!existingSubstation) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Substation not found.');
    }
    await prisma_1.prisma.substation.delete({
        where: {
            id,
        },
    });
    return null;
};
exports.substationServices = {
    createSubstationIntoDB,
    getAllSubstationsFromDB,
    getSingleSubstationFromDB,
    updateSubstationIntoDB,
    deleteSubstationFromDB,
};
