import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import { ICreateAuditLogPayload } from './auditLog.interface';

// ======================================================
// CREATE AUDIT LOG
// ======================================================

const createAuditLogIntoDB = async (
    actorId: string,
    payload: ICreateAuditLogPayload,
) => {
    const { action, entity, entityId, oldValue, newValue, ipAddress } = payload;

    // Check actor
    const actor = await prisma.user.findUnique({
        where: {
            id: actorId,
        },
    });

    if (!actor) {
        throw new AppError(httpStatus.NOT_FOUND, 'Actor/User not found');
    }

    const result = await prisma.auditLog.create({
        data: {
            actorId,
            action,
            entity,
            entityId,
            oldValue: oldValue as any,
            newValue: newValue as any,
            ipAddress,
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

const getAllAuditLogsFromDB = async (query: any) => {
    const page = query.page ? Number(query.page) : 1;

    const limit = query.limit ? Number(query.limit) : 10;

    const skip = (page - 1) * limit;

    const searchTerm = query.searchTerm?.trim();

    const where: any = {};

    // Search
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

    // Actor filter
    if (query.actorId) {
        where.actorId = query.actorId;
    }

    // Entity filter
    if (query.entity) {
        where.entity = query.entity;
    }

    // Entity ID filter
    if (query.entityId) {
        where.entityId = query.entityId;
    }

    // Action filter
    if (query.action) {
        where.action = query.action;
    }

    const [logs, total] = await Promise.all([
        prisma.auditLog.findMany({
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

        prisma.auditLog.count({
            where,
        }),
    ]);

    return {
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },

        data: logs,
    };
};

// ======================================================
// GET SINGLE AUDIT LOG
// ======================================================

const getSingleAuditLogFromDB = async (id: string) => {
    const result = await prisma.auditLog.findUnique({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Audit Log not found');
    }

    return result;
};

// ======================================================
// GET AUDIT LOGS BY ENTITY
// ======================================================

const getAuditLogsByEntityFromDB = async (entity: string, entityId: string) => {
    const result = await prisma.auditLog.findMany({
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

const deleteAuditLogFromDB = async (id: string) => {
    const auditLog = await prisma.auditLog.findUnique({
        where: {
            id,
        },
    });

    if (!auditLog) {
        throw new AppError(httpStatus.NOT_FOUND, 'Audit Log not found');
    }

    await prisma.auditLog.delete({
        where: {
            id,
        },
    });

    return null;
};

export const auditLogServices = {
    createAuditLogIntoDB,
    getAllAuditLogsFromDB,
    getSingleAuditLogFromDB,
    getAuditLogsByEntityFromDB,
    deleteAuditLogFromDB,
};
