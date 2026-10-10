"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auditLogServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
// ======================================================
// CREATE AUDIT LOG
// ======================================================
const createAuditLogIntoDB = async (actorId, payload) => {
    const { action, entity, entityId, oldValue, newValue, ipAddress } = payload;
    // Check actor
    const actor = await prisma_1.prisma.user.findUnique({
        where: {
            id: actorId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
        },
    });
    if (!actor) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Actor/User not found');
    }
    const result = await prisma_1.prisma.auditLog.create({
        data: {
            actorId,
            action,
            entity,
            entityId,
            oldValue: oldValue ?? undefined,
            newValue: newValue ?? undefined,
            ipAddress: ipAddress ?? undefined,
        },
        include: {
            actor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
    return result;
};
// ======================================================
// GET ALL AUDIT LOGS
// ======================================================
const getAllAuditLogsFromDB = async (query) => {
    const page = query.page ? Number(query.page) : 1;
    const limit = query.limit ? Number(query.limit) : 10;
    const skip = (page - 1) * limit;
    const where = {};
    // Search by action or entity
    const searchTerm = query.searchTerm?.trim();
    if (searchTerm) {
        where.OR = [
            {
                action: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
            {
                entity: {
                    contains: searchTerm,
                    mode: 'insensitive',
                },
            },
        ];
    }
    // Action filter
    if (query.action) {
        where.action = query.action;
    }
    // Entity filter
    if (query.entity) {
        where.entity = query.entity;
    }
    // Entity ID filter
    if (query.entityId) {
        where.entityId = query.entityId;
    }
    // Actor filter
    if (query.actorId) {
        where.actorId = query.actorId;
    }
    // Date filter
    if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
            where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
            where.createdAt.lte = new Date(query.endDate);
        }
    }
    const [logs, total] = await Promise.all([
        prisma_1.prisma.auditLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            include: {
                actor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        role: true,
                    },
                },
            },
        }),
        prisma_1.prisma.auditLog.count({
            where,
        }),
    ]);
    return {
        data: logs,
        meta: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        },
    };
};
// ======================================================
// GET SINGLE AUDIT LOG
// ======================================================
const getSingleAuditLogFromDB = async (id) => {
    const result = await prisma_1.prisma.auditLog.findUnique({
        where: {
            id,
        },
        include: {
            actor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
    if (!result) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Audit Log not found');
    }
    return result;
};
// ======================================================
// GET AUDIT LOGS BY ENTITY
// ======================================================
const getAuditLogsByEntityFromDB = async (entity, entityId) => {
    const result = await prisma_1.prisma.auditLog.findMany({
        where: {
            entity,
            entityId,
        },
        orderBy: {
            createdAt: 'desc',
        },
        include: {
            actor: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                },
            },
        },
    });
    return result;
};
// ======================================================
// DELETE AUDIT LOG
// ======================================================
const deleteAuditLogFromDB = async (id) => {
    const auditLog = await prisma_1.prisma.auditLog.findUnique({
        where: {
            id,
        },
    });
    if (!auditLog) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Audit Log not found');
    }
    await prisma_1.prisma.auditLog.delete({
        where: {
            id,
        },
    });
    return null;
};
exports.auditLogServices = {
    createAuditLogIntoDB,
    getAllAuditLogsFromDB,
    getSingleAuditLogFromDB,
    getAuditLogsByEntityFromDB,
    deleteAuditLogFromDB,
};
