"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const prisma_1 = require("../../lib/prisma");
const enums_1 = require("../../../generated/prisma/enums");
const AppError_1 = require("../../errors/AppError");
const getAllUsersFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;
    const skip = (page - 1) * limit;
    const where = {
        deletedAt: null,
    };
    // Search
    if (query.searchTerm) {
        where.OR = [
            {
                name: {
                    contains: query.searchTerm,
                    mode: 'insensitive',
                },
            },
            {
                email: {
                    contains: query.searchTerm,
                    mode: 'insensitive',
                },
            },
        ];
    }
    // Role filter
    if (query.role) {
        where.role = query.role;
    }
    // Status filter
    if (query.status) {
        where.status = query.status;
    }
    const [users, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                emailVerified: true,
                createdAt: true,
                updatedAt: true,
                profile: {
                    select: {
                        phone: true,
                        address: true,
                    },
                },
                technician: {
                    select: {
                        id: true,
                        employeeId: true,
                        status: true,
                        verificationStatus: true,
                    },
                },
            },
        }),
        prisma_1.prisma.user.count({
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
        data: users,
    };
};
const updateUserRoleIntoDB = async (adminId, userId, payload, ipAddress) => {
    const newRole = payload.role;
    // =======================================================
    // Find target user
    // =======================================================
    const existingUser = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            status: true,
        },
    });
    if (!existingUser) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    // =======================================================
    // Prevent unnecessary update
    // =======================================================
    if (existingUser.role === newRole) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, `User already has ${newRole} role`);
    }
    // =======================================================
    // Prevent admin from changing own role
    // =======================================================
    if (adminId === userId) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'You cannot change your own role');
    }
    // =======================================================
    // Update + Audit Log in transaction
    // =======================================================
    const result = await prisma_1.prisma.$transaction(async (tx) => {
        const updatedUser = await tx.user.update({
            where: {
                id: userId,
            },
            data: {
                role: newRole,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                updatedAt: true,
            },
        });
        await tx.auditLog.create({
            data: {
                actorId: adminId,
                action: 'USER_ROLE_CHANGED',
                entity: 'USER',
                entityId: userId,
                oldValue: {
                    role: existingUser.role,
                },
                newValue: {
                    role: newRole,
                },
                ipAddress: ipAddress || null,
            },
        });
        return updatedUser;
    });
    return result;
};
const getAdminDashboardStatsFromDB = async () => {
    const today = new Date();
    const startOfToday = new Date(today);
    startOfToday.setHours(0, 0, 0, 0);
    const endOfToday = new Date(today);
    endOfToday.setHours(23, 59, 59, 999);
    const [totalUsers, totalCustomers, totalTechnicians, totalOperators, totalAdmins, activeUsers, blockedUsers, totalAreas, totalFeeders, totalSubstations, totalZones, activeOutages, criticalOutages, restoredOutages, pendingTechnicians, activeRestorations, todaySchedules, todayAuditLogs,] = await Promise.all([
        // Users
        prisma_1.prisma.user.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.user.count({
            where: {
                role: enums_1.UserRole.CUSTOMER,
                deletedAt: null,
            },
        }),
        prisma_1.prisma.user.count({
            where: {
                role: enums_1.UserRole.TECHNICIAN,
                deletedAt: null,
            },
        }),
        prisma_1.prisma.user.count({
            where: {
                role: enums_1.UserRole.OPERATOR,
                deletedAt: null,
            },
        }),
        prisma_1.prisma.user.count({
            where: {
                role: enums_1.UserRole.ADMIN,
                deletedAt: null,
            },
        }),
        prisma_1.prisma.user.count({
            where: {
                status: enums_1.UserStatus.ACTIVE,
                deletedAt: null,
            },
        }),
        prisma_1.prisma.user.count({
            where: {
                status: enums_1.UserStatus.BLOCKED,
                deletedAt: null,
            },
        }),
        // Infrastructure
        prisma_1.prisma.area.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.feeder.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.substation.count({
            where: {
                deletedAt: null,
            },
        }),
        prisma_1.prisma.zone.count({
            where: {
                deletedAt: null,
            },
        }),
        // Outages
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                status: {
                    in: ['REPORTED', 'VERIFIED', 'ASSIGNED', 'IN_PROGRESS'],
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                priority: 'CRITICAL',
                status: {
                    notIn: ['RESTORED', 'CLOSED', 'CANCELLED'],
                },
            },
        }),
        prisma_1.prisma.outage.count({
            where: {
                deletedAt: null,
                status: 'RESTORED',
            },
        }),
        // Technicians
        prisma_1.prisma.technician.count({
            where: {
                verificationStatus: 'PENDING',
                deletedAt: null,
            },
        }),
        // Restoration
        prisma_1.prisma.restoration.count({
            where: {
                status: 'IN_PROGRESS',
            },
        }),
        // Today's schedules
        prisma_1.prisma.loadSheddingSchedule.count({
            where: {
                deletedAt: null,
                startTime: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
        // Today's audit logs
        prisma_1.prisma.auditLog.count({
            where: {
                createdAt: {
                    gte: startOfToday,
                    lte: endOfToday,
                },
            },
        }),
    ]);
    return {
        users: {
            total: totalUsers,
            customers: totalCustomers,
            technicians: totalTechnicians,
            operators: totalOperators,
            admins: totalAdmins,
            active: activeUsers,
            blocked: blockedUsers,
        },
        infrastructure: {
            zones: totalZones,
            substations: totalSubstations,
            feeders: totalFeeders,
            areas: totalAreas,
        },
        outages: {
            active: activeOutages,
            critical: criticalOutages,
            restored: restoredOutages,
        },
        technicians: {
            pendingVerification: pendingTechnicians,
        },
        restorations: {
            active: activeRestorations,
        },
        schedules: {
            today: todaySchedules,
        },
        auditLogs: {
            today: todayAuditLogs,
        },
    };
};
const getAuditLogsFromDB = async (query) => {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;
    const where = {};
    // Action
    if (query.action) {
        where.action = query.action;
    }
    // Entity
    if (query.entity) {
        where.entity = query.entity;
    }
    // Entity ID
    if (query.entityId) {
        where.entityId = query.entityId;
    }
    // Actor
    if (query.actorId) {
        where.actorId = query.actorId;
    }
    // Date range
    if (query.startDate || query.endDate) {
        where.createdAt = {};
        if (query.startDate) {
            where.createdAt.gte = new Date(query.startDate);
        }
        if (query.endDate) {
            where.createdAt.lte = new Date(query.endDate);
        }
    }
    const [logs, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.auditLog.findMany({
            where,
            skip,
            take: limit,
            orderBy: {
                createdAt: 'desc',
            },
            select: {
                id: true,
                actorId: true,
                action: true,
                entity: true,
                entityId: true,
                oldValue: true,
                newValue: true,
                ipAddress: true,
                createdAt: true,
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
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
        data: logs,
    };
};
exports.adminServices = {
    getAllUsersFromDB,
    updateUserRoleIntoDB,
    getAdminDashboardStatsFromDB,
    getAuditLogsFromDB,
};
