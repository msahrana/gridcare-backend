"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restorationServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../../generated/prisma/enums");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../errors/AppError");
// =========================================================
// START RESTORATION
// =========================================================
const startRestorationIntoDB = async (payload) => {
    const { outageId, technicianId, remarks } = payload;
    return prisma_1.prisma.$transaction(async (tx) => {
        // -----------------------------------------------------
        // Check outage
        // -----------------------------------------------------
        const outage = await tx.outage.findFirst({
            where: {
                id: outageId,
                deletedAt: null,
            },
        });
        if (!outage) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
        }
        // -----------------------------------------------------
        // Check outage status
        // -----------------------------------------------------
        if (outage.status === enums_1.OutageStatus.RESTORED ||
            outage.status === enums_1.OutageStatus.CLOSED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'This outage has already been restored or closed');
        }
        if (outage.status === enums_1.OutageStatus.CANCELLED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cannot start restoration for a cancelled outage');
        }
        // -----------------------------------------------------
        // Check existing restoration
        // -----------------------------------------------------
        const existingRestoration = await tx.restoration.findFirst({
            where: {
                outageId,
            },
        });
        if (existingRestoration) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Restoration already exists for this outage');
        }
        // -----------------------------------------------------
        // Technician required
        // -----------------------------------------------------
        if (!technicianId) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician ID is required');
        }
        // -----------------------------------------------------
        // Check technician
        // -----------------------------------------------------
        const technician = await tx.technician.findFirst({
            where: {
                id: technicianId,
                deletedAt: null,
            },
        });
        if (!technician) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Technician not found');
        }
        // -----------------------------------------------------
        // Check technician availability
        // -----------------------------------------------------
        if (technician.status !== enums_1.TechnicianStatus.AVAILABLE) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Technician is not available');
        }
        // -----------------------------------------------------
        // Start time
        // -----------------------------------------------------
        const startedAt = new Date();
        // -----------------------------------------------------
        // Create restoration
        // -----------------------------------------------------
        const restoration = await tx.restoration.create({
            data: {
                outageId,
                technicianId,
                startedAt,
                status: enums_1.RestorationStatus.IN_PROGRESS,
                remarks,
            },
            include: {
                outage: true,
                technician: true,
            },
        });
        // -----------------------------------------------------
        // Update outage
        // -----------------------------------------------------
        await tx.outage.update({
            where: {
                id: outageId,
            },
            data: {
                status: enums_1.OutageStatus.IN_PROGRESS,
                startedAt: outage.startedAt ?? startedAt,
            },
        });
        // -----------------------------------------------------
        // Update technician
        // -----------------------------------------------------
        await tx.technician.update({
            where: {
                id: technicianId,
            },
            data: {
                status: enums_1.TechnicianStatus.BUSY,
            },
        });
        return restoration;
    });
};
// =========================================================
// COMPLETE RESTORATION
// =========================================================
const completeRestorationIntoDB = async (restorationId, payload) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        // -----------------------------------------------------
        // Find restoration
        // -----------------------------------------------------
        const restoration = await tx.restoration.findUnique({
            where: {
                id: restorationId,
            },
            include: {
                outage: true,
                technician: true,
            },
        });
        if (!restoration) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Restoration not found');
        }
        // -----------------------------------------------------
        // Check restoration status
        // -----------------------------------------------------
        if (restoration.status === enums_1.RestorationStatus.COMPLETED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Restoration is already completed');
        }
        if (restoration.status === enums_1.RestorationStatus.CANCELLED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Cancelled restoration cannot be completed');
        }
        if (!restoration.startedAt) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Restoration start time is missing');
        }
        // -----------------------------------------------------
        // Completion time
        // -----------------------------------------------------
        const completedAt = new Date();
        // -----------------------------------------------------
        // Duration in minutes
        // -----------------------------------------------------
        const duration = Math.max(0, Math.floor((completedAt.getTime() - restoration.startedAt.getTime()) /
            (1000 * 60)));
        // -----------------------------------------------------
        // Update restoration
        // -----------------------------------------------------
        const updatedRestoration = await tx.restoration.update({
            where: {
                id: restorationId,
            },
            data: {
                status: enums_1.RestorationStatus.COMPLETED,
                completedAt,
                duration,
                remarks: payload?.remarks ?? restoration.remarks,
            },
            include: {
                outage: true,
                technician: true,
            },
        });
        // -----------------------------------------------------
        // Update outage
        // -----------------------------------------------------
        await tx.outage.update({
            where: {
                id: restoration.outageId,
            },
            data: {
                status: enums_1.OutageStatus.RESTORED,
                restoredAt: completedAt,
            },
        });
        // -----------------------------------------------------
        // Make technician available
        // -----------------------------------------------------
        if (restoration.technicianId) {
            await tx.technician.update({
                where: {
                    id: restoration.technicianId,
                },
                data: {
                    status: enums_1.TechnicianStatus.AVAILABLE,
                },
            });
        }
        return updatedRestoration;
    });
};
// =========================================================
// CANCEL RESTORATION
// =========================================================
const cancelRestorationIntoDB = async (restorationId, payload) => {
    return prisma_1.prisma.$transaction(async (tx) => {
        const restoration = await tx.restoration.findUnique({
            where: {
                id: restorationId,
            },
        });
        if (!restoration) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Restoration not found');
        }
        if (restoration.status === enums_1.RestorationStatus.COMPLETED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Completed restoration cannot be cancelled');
        }
        if (restoration.status === enums_1.RestorationStatus.CANCELLED) {
            throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Restoration is already cancelled');
        }
        const cancelledRestoration = await tx.restoration.update({
            where: {
                id: restorationId,
            },
            data: {
                status: enums_1.RestorationStatus.CANCELLED,
                remarks: payload?.remarks ?? restoration.remarks,
            },
        });
        // Technician becomes available again
        if (restoration.technicianId) {
            await tx.technician.update({
                where: {
                    id: restoration.technicianId,
                },
                data: {
                    status: enums_1.TechnicianStatus.AVAILABLE,
                },
            });
        }
        return cancelledRestoration;
    });
};
// =========================================================
// GET SINGLE RESTORATION
// =========================================================
const getSingleRestorationFromDB = async (restorationId) => {
    const restoration = await prisma_1.prisma.restoration.findUnique({
        where: {
            id: restorationId,
        },
        include: {
            outage: {
                include: {
                    area: true,
                },
            },
            technician: {
                include: {
                    user: true,
                },
            },
        },
    });
    if (!restoration) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Restoration not found');
    }
    return restoration;
};
// =========================================================
// GET ALL RESTORATIONS
// =========================================================
const getAllRestorationsFromDB = async (params) => {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;
    const skip = (page - 1) * limit;
    const searchTerm = params.searchTerm?.trim();
    const where = {
        ...(searchTerm && {
            OR: [
                {
                    remarks: {
                        contains: searchTerm,
                        mode: 'insensitive',
                    },
                },
                {
                    outage: {
                        title: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    outage: {
                        area: {
                            name: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
                {
                    outage: {
                        area: {
                            code: {
                                contains: searchTerm,
                                mode: 'insensitive',
                            },
                        },
                    },
                },
                {
                    technician: {
                        employeeId: {
                            contains: searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        }),
        ...(params.status && {
            status: params.status,
        }),
        ...(params.technicianId && {
            technicianId: params.technicianId,
        }),
        ...(params.outageId && {
            outageId: params.outageId,
        }),
    };
    const [data, total] = await Promise.all([
        prisma_1.prisma.restoration.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                outage: {
                    include: {
                        area: true,
                    },
                },
                technician: true,
            },
        }),
        prisma_1.prisma.restoration.count({
            where,
        }),
    ]);
    return {
        data,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};
// =========================================================
// UPDATE RESTORATION
// =========================================================
const updateRestorationIntoDB = async (restorationId, payload) => {
    const restoration = await prisma_1.prisma.restoration.findUnique({
        where: {
            id: restorationId,
        },
    });
    if (!restoration) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Restoration not found');
    }
    if (restoration.status !== enums_1.RestorationStatus.IN_PROGRESS) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Only in-progress restoration can be updated');
    }
    return prisma_1.prisma.restoration.update({
        where: {
            id: restorationId,
        },
        data: {
            remarks: payload.remarks,
        },
    });
};
// =========================================================
// DELETE RESTORATION
// =========================================================
const deleteRestorationFromDB = async (restorationId) => {
    const restoration = await prisma_1.prisma.restoration.findUnique({
        where: {
            id: restorationId,
        },
    });
    if (!restoration) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Restoration not found');
    }
    if (restoration.status === enums_1.RestorationStatus.COMPLETED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Completed restoration cannot be deleted');
    }
    return prisma_1.prisma.restoration.delete({
        where: {
            id: restorationId,
        },
    });
};
exports.restorationServices = {
    startRestorationIntoDB,
    completeRestorationIntoDB,
    cancelRestorationIntoDB,
    getSingleRestorationFromDB,
    getAllRestorationsFromDB,
    updateRestorationIntoDB,
    deleteRestorationFromDB,
};
