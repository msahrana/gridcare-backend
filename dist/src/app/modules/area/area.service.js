"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.areaServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const createAreaIntoDB = async (payload) => {
    const existingArea = await prisma_1.prisma.area.findFirst({
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
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Area with this code or name already exists');
    }
    const area = await prisma_1.prisma.area.create({
        data: payload,
        include: {
            zone: true,
            substation: true,
            feeder: true,
        },
    });
    return area;
};
const getAllAreasFromDB = async (query) => {
    const { page = 1, limit = 10, search, zoneId, substationId, feederId, isActive, } = query;
    // Convert query params to numbers
    const pageNumber = Math.max(1, Number(page) || 1);
    const limitNumber = Math.max(1, Number(limit) || 10);
    const skip = (pageNumber - 1) * limitNumber;
    const andConditions = [
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
        const activeValue = typeof isActive === 'boolean'
            ? isActive
            : String(isActive).toLowerCase() === 'true';
        andConditions.push({
            isActive: activeValue,
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    const [areas, total] = await Promise.all([
        prisma_1.prisma.area.findMany({
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
        prisma_1.prisma.area.count({
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
const getAreaByIdFromDB = async (id) => {
    const area = await prisma_1.prisma.area.findFirst({
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
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
    }
    return area;
};
const updateAreaIntoDB = async (id, payload) => {
    const existingArea = await prisma_1.prisma.area.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingArea) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
    }
    if (payload.code) {
        const duplicateCode = await prisma_1.prisma.area.findFirst({
            where: {
                code: payload.code,
                id: {
                    not: id,
                },
                deletedAt: null,
            },
        });
        if (duplicateCode) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Area code already exists');
        }
    }
    const area = await prisma_1.prisma.area.update({
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
const deleteAreaFromDB = async (id) => {
    const area = await prisma_1.prisma.area.findFirst({
        where: {
            id,
        },
    });
    if (!area) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
    }
    await prisma_1.prisma.area.delete({
        where: {
            id,
        },
    });
    return null;
};
const searchAreasFromDB = async (search) => {
    if (!search?.trim()) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Search query is required');
    }
    const areas = await prisma_1.prisma.area.findMany({
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
exports.areaServices = {
    createAreaIntoDB,
    getAllAreasFromDB,
    getAreaByIdFromDB,
    updateAreaIntoDB,
    deleteAreaFromDB,
    searchAreasFromDB,
};
