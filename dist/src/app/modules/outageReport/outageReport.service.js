"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outageReportServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
const createOutageReportIntoDB = async (reporterId, payload) => {
    // Reporter check
    const reporter = await prisma_1.prisma.user.findUnique({
        where: { id: reporterId },
    });
    if (!reporter) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Reporter not found');
    }
    // Area check
    const area = await prisma_1.prisma.area.findUnique({
        where: { id: payload.areaId },
    });
    if (!area) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
    }
    // Outage check (optional)
    if (payload.outageId) {
        const outage = await prisma_1.prisma.outage.findUnique({
            where: { id: payload.outageId },
        });
        if (!outage) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
        }
    }
    const result = await prisma_1.prisma.outageReport.create({
        data: {
            reporterId,
            outageId: payload.outageId,
            areaId: payload.areaId,
            description: payload.description,
            latitude: payload.latitude,
            longitude: payload.longitude,
        },
        include: {
            reporter: true,
            area: true,
            outage: true,
        },
    });
    return result;
};
const getAllOutageReportsFromDB = async (query) => {
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
                    description: {
                        contains: query.searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    reporter: {
                        name: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    reporter: {
                        email: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    area: {
                        name: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    area: {
                        code: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    outage: {
                        title: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    const allOutageReports = await prisma_1.prisma.outageReport.findMany({
        where: {
            AND: andConditions,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            reporter: true,
            area: true,
            outage: true,
        },
    });
    const totalOutageReportCount = await prisma_1.prisma.outageReport.count({
        where: {
            AND: andConditions,
        },
    });
    return {
        data: allOutageReports,
        meta: {
            page,
            limit,
            total: totalOutageReportCount,
            totalPages: Math.ceil(totalOutageReportCount / limit),
        },
    };
};
const getSingleOutageReportFromDB = async (id) => {
    const result = await prisma_1.prisma.outageReport.findUnique({
        where: {
            id,
        },
        include: {
            reporter: true,
            area: true,
            outage: true,
        },
    });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage report not found');
    }
    return result;
};
const getReportsByOutageFromDB = async (outageId) => {
    // Check outage
    const outage = await prisma_1.prisma.outage.findUnique({
        where: {
            id: outageId,
        },
    });
    if (!outage) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
    }
    const result = await prisma_1.prisma.outageReport.findMany({
        where: {
            outageId,
        },
        include: {
            reporter: true,
            area: true,
            outage: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return result;
};
const getReportsByAreaFromDB = async (areaId) => {
    // Check area
    const area = await prisma_1.prisma.area.findUnique({
        where: {
            id: areaId,
        },
    });
    if (!area) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
    }
    const result = await prisma_1.prisma.outageReport.findMany({
        where: {
            areaId,
        },
        include: {
            reporter: true,
            area: true,
            outage: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return result;
};
const updateOutageReportIntoDB = async (id, payload) => {
    const existingReport = await prisma_1.prisma.outageReport.findUnique({
        where: {
            id,
        },
    });
    if (!existingReport) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage report not found');
    }
    // Validate area if being updated
    if (payload.areaId) {
        const area = await prisma_1.prisma.area.findUnique({
            where: {
                id: payload.areaId,
            },
        });
        if (!area) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
        }
    }
    // Validate outage if being updated
    if (payload.outageId) {
        const outage = await prisma_1.prisma.outage.findUnique({
            where: {
                id: payload.outageId,
            },
        });
        if (!outage) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
        }
    }
    const result = await prisma_1.prisma.outageReport.update({
        where: {
            id,
        },
        data: {
            ...(payload.outageId !== undefined && {
                outageId: payload.outageId,
            }),
            ...(payload.areaId !== undefined && {
                areaId: payload.areaId,
            }),
            ...(payload.description !== undefined && {
                description: payload.description,
            }),
            ...(payload.latitude !== undefined && {
                latitude: payload.latitude,
            }),
            ...(payload.longitude !== undefined && {
                longitude: payload.longitude,
            }),
        },
        include: {
            reporter: true,
            area: true,
            outage: true,
        },
    });
    return result;
};
const deleteOutageReportFromDB = async (id) => {
    const existingReport = await prisma_1.prisma.outageReport.findUnique({
        where: {
            id,
        },
    });
    if (!existingReport) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage report not found');
    }
    const result = await prisma_1.prisma.outageReport.delete({
        where: {
            id,
        },
    });
    return result;
};
exports.outageReportServices = {
    createOutageReportIntoDB,
    getAllOutageReportsFromDB,
    getSingleOutageReportFromDB,
    getReportsByOutageFromDB,
    getReportsByAreaFromDB,
    updateOutageReportIntoDB,
    deleteOutageReportFromDB,
};
