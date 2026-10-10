"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.zoneServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const createZoneIntoDB = async (payload) => {
    // Check duplicate zone name
    const existingZoneByName = await prisma_1.prisma.zone.findFirst({
        where: {
            name: payload.name,
            deletedAt: null,
        },
    });
    if (existingZoneByName) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A zone with this name already exists.');
    }
    // Check duplicate zone code
    const existingZoneByCode = await prisma_1.prisma.zone.findUnique({
        where: {
            code: payload.code,
        },
    });
    if (existingZoneByCode && existingZoneByCode.deletedAt === null) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A zone with this code already exists.');
    }
    const zone = await prisma_1.prisma.zone.create({
        data: {
            name: payload.name,
            code: payload.code,
            description: payload.description,
            isActive: payload.isActive ?? true,
        },
    });
    return zone;
};
const getAllZonesFromDB = async (query) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy || 'createdAt';
    const sortOrder = query.sortOrder || 'desc';
    const andConditions = [];
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
    const allZones = await prisma_1.prisma.zone.findMany({
        where: {
            AND: andConditions,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
    });
    const totalZoneCount = await prisma_1.prisma.zone.count({
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
const getSingleZoneFromDB = async (id) => {
    const zone = await prisma_1.prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!zone) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Zone not found.');
    }
    return zone;
};
const updateZoneIntoDB = async (id, payload) => {
    // Check existing zone
    const existingZone = await prisma_1.prisma.zone.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingZone) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Zone not found.');
    }
    // Check duplicate name
    if (payload.name) {
        const duplicateName = await prisma_1.prisma.zone.findFirst({
            where: {
                name: payload.name,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });
        if (duplicateName) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A zone with this name already exists.');
        }
    }
    // Check duplicate code
    if (payload.code) {
        const duplicateCode = await prisma_1.prisma.zone.findFirst({
            where: {
                code: payload.code,
                deletedAt: null,
                NOT: {
                    id,
                },
            },
        });
        if (duplicateCode) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'A zone with this code already exists.');
        }
    }
    const updatedZone = await prisma_1.prisma.zone.update({
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
const deleteZoneFromDB = async (id) => {
    const existingZone = await prisma_1.prisma.zone.findUnique({
        where: {
            id,
        },
    });
    if (!existingZone) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Zone not found.');
    }
    await prisma_1.prisma.zone.delete({
        where: {
            id,
        },
    });
    return null;
};
exports.zoneServices = {
    createZoneIntoDB,
    getAllZonesFromDB,
    getSingleZoneFromDB,
    updateZoneIntoDB,
    deleteZoneFromDB,
};
