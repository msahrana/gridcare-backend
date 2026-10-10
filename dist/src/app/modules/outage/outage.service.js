"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.outageServices = void 0;
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
const enums_1 = require("../../../generated/prisma/enums");
// ============================================================
// CONSTANTS
// ============================================================
const ACTIVE_OUTAGE_STATUSES = [
    enums_1.OutageStatus.REPORTED,
    enums_1.OutageStatus.VERIFIED,
    enums_1.OutageStatus.ASSIGNED,
    enums_1.OutageStatus.IN_PROGRESS,
];
// ============================================================
// CREATE OUTAGE
// ============================================================
const createOutageIntoDB = async (payload) => {
    const { areaId, title, description, type, priority, status, startedAt, restoredAt, } = payload;
    // --------------------------------------------------------
    // Check Area
    // --------------------------------------------------------
    const area = await prisma_1.prisma.area.findFirst({
        where: {
            id: areaId,
            deletedAt: null,
            isActive: true,
        },
    });
    if (!area) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found or inactive');
    }
    // --------------------------------------------------------
    // Validate startedAt / restoredAt
    // --------------------------------------------------------
    if (startedAt && restoredAt && restoredAt < startedAt) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Restored time cannot be earlier than started time');
    }
    // --------------------------------------------------------
    // Validate restoredAt against status
    // --------------------------------------------------------
    const outageStatus = status ?? enums_1.OutageStatus.REPORTED;
    if (restoredAt &&
        outageStatus !== enums_1.OutageStatus.RESTORED &&
        outageStatus !== enums_1.OutageStatus.CLOSED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'restoredAt can only be provided when outage status is RESTORED or CLOSED');
    }
    // --------------------------------------------------------
    // Prevent duplicate active outage
    // --------------------------------------------------------
    const existingActiveOutage = await prisma_1.prisma.outage.findFirst({
        where: {
            areaId,
            deletedAt: null,
            status: {
                in: ACTIVE_OUTAGE_STATUSES,
            },
            title: {
                equals: title,
                mode: 'insensitive',
            },
        },
    });
    if (existingActiveOutage) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'An active outage with this title already exists in this area');
    }
    // --------------------------------------------------------
    // Create outage
    // --------------------------------------------------------
    const outage = await prisma_1.prisma.outage.create({
        data: {
            areaId,
            title,
            description,
            type,
            priority: priority ?? enums_1.Priority.MEDIUM,
            status: outageStatus,
            startedAt,
            restoredAt,
        },
        include: {
            area: true,
        },
    });
    return outage;
};
// ============================================================
// GET ALL OUTAGES
// ============================================================
const getAllOutagesFromDB = async (params) => {
    const { page = 1, limit = 10, search, areaId, status, type, priority, } = params;
    const skip = (page - 1) * limit;
    const andConditions = [
        {
            deletedAt: null,
        },
    ];
    // --------------------------------------------------------
    // Search
    // --------------------------------------------------------
    if (search?.trim()) {
        andConditions.push({
            OR: [
                {
                    title: {
                        contains: search.trim(),
                        mode: 'insensitive',
                    },
                },
                {
                    description: {
                        contains: search.trim(),
                        mode: 'insensitive',
                    },
                },
                {
                    area: {
                        name: {
                            contains: search.trim(),
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    area: {
                        code: {
                            contains: search.trim(),
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }
    // --------------------------------------------------------
    // Filters
    // --------------------------------------------------------
    if (areaId) {
        andConditions.push({
            areaId,
        });
    }
    if (status) {
        andConditions.push({
            status,
        });
    }
    if (type) {
        andConditions.push({
            type,
        });
    }
    if (priority) {
        andConditions.push({
            priority,
        });
    }
    const whereConditions = {
        AND: andConditions,
    };
    // --------------------------------------------------------
    // Query
    // --------------------------------------------------------
    const [outages, total] = await prisma_1.prisma.$transaction([
        prisma_1.prisma.outage.findMany({
            where: whereConditions,
            skip,
            take: limit,
            include: {
                area: true,
                reports: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                assignments: {
                    include: {
                        technician: true,
                        assignedBy: true,
                    },
                    orderBy: {
                        assignedAt: 'desc',
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
        }),
        prisma_1.prisma.outage.count({
            where: whereConditions,
        }),
    ]);
    return {
        data: outages,
        meta: {
            page,
            limit,
            total,
            totalPage: Math.ceil(total / limit),
        },
    };
};
// ============================================================
// GET SINGLE OUTAGE
// ============================================================
const getSingleOutageFromDB = async (id) => {
    const outage = await prisma_1.prisma.outage.findFirst({
        where: { id },
        include: {
            area: true,
            reports: {
                include: {
                    reporter: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            },
            assignments: {
                include: {
                    technician: true,
                    assignedBy: true,
                },
                orderBy: {
                    assignedAt: 'desc',
                },
            },
            payments: true,
        },
    });
    if (!outage) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
    }
    return outage;
};
// ============================================================
// UPDATE OUTAGE
// ============================================================
const updateOutageIntoDB = async (id, payload) => {
    // --------------------------------------------------------
    // Check outage
    // --------------------------------------------------------
    const existingOutage = await prisma_1.prisma.outage.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });
    if (!existingOutage) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
    }
    // --------------------------------------------------------
    // Check Area if areaId is being updated
    // --------------------------------------------------------
    if (payload.areaId && payload.areaId !== existingOutage.areaId) {
        const area = await prisma_1.prisma.area.findFirst({
            where: {
                id: payload.areaId,
                deletedAt: null,
                isActive: true,
            },
        });
        if (!area) {
            throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found or inactive');
        }
    }
    // --------------------------------------------------------
    // Calculate final values
    // --------------------------------------------------------
    const finalStartedAt = payload.startedAt !== undefined
        ? payload.startedAt
        : existingOutage.startedAt;
    const finalRestoredAt = payload.restoredAt !== undefined
        ? payload.restoredAt
        : existingOutage.restoredAt;
    const finalStatus = payload.status ?? existingOutage.status;
    // --------------------------------------------------------
    // Automatically set startedAt when status becomes
    // IN_PROGRESS
    // --------------------------------------------------------
    let startedAtToSave = finalStartedAt;
    if (payload.status === enums_1.OutageStatus.IN_PROGRESS && !startedAtToSave) {
        startedAtToSave = new Date();
    }
    // --------------------------------------------------------
    // Automatically set restoredAt when status becomes
    // RESTORED
    // --------------------------------------------------------
    let restoredAtToSave = finalRestoredAt;
    if (payload.status === enums_1.OutageStatus.RESTORED && !restoredAtToSave) {
        restoredAtToSave = new Date();
    }
    // --------------------------------------------------------
    // Validate startedAt / restoredAt
    // --------------------------------------------------------
    if (startedAtToSave &&
        restoredAtToSave &&
        restoredAtToSave < startedAtToSave) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Restored time cannot be earlier than started time');
    }
    // --------------------------------------------------------
    // Validate restoredAt against final status
    // --------------------------------------------------------
    if (restoredAtToSave &&
        finalStatus !== enums_1.OutageStatus.RESTORED &&
        finalStatus !== enums_1.OutageStatus.CLOSED) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'restoredAt can only be set when outage status is RESTORED or CLOSED');
    }
    // --------------------------------------------------------
    // Prevent duplicate active outage
    // --------------------------------------------------------
    const finalAreaId = payload.areaId ?? existingOutage.areaId;
    const finalTitle = payload.title ?? existingOutage.title;
    const titleChanged = finalTitle.toLowerCase() !== existingOutage.title.toLowerCase();
    const areaChanged = finalAreaId !== existingOutage.areaId;
    if (titleChanged || areaChanged) {
        const duplicateOutage = await prisma_1.prisma.outage.findFirst({
            where: {
                id: {
                    not: id,
                },
                areaId: finalAreaId,
                title: {
                    equals: finalTitle,
                    mode: 'insensitive',
                },
                deletedAt: null,
                status: {
                    in: ACTIVE_OUTAGE_STATUSES,
                },
            },
        });
        if (duplicateOutage) {
            throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'An active outage with this title already exists in this area');
        }
    }
    // --------------------------------------------------------
    // Update
    // --------------------------------------------------------
    const updatedOutage = await prisma_1.prisma.outage.update({
        where: {
            id,
        },
        data: {
            ...(payload.areaId !== undefined && {
                areaId: payload.areaId,
            }),
            ...(payload.title !== undefined && {
                title: payload.title,
            }),
            ...(payload.description !== undefined && {
                description: payload.description,
            }),
            ...(payload.type !== undefined && {
                type: payload.type,
            }),
            ...(payload.priority !== undefined && {
                priority: payload.priority,
            }),
            ...(payload.status !== undefined && {
                status: payload.status,
            }),
            startedAt: startedAtToSave,
            restoredAt: restoredAtToSave,
        },
        include: {
            area: true,
            reports: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
            assignments: {
                include: {
                    technician: true,
                    assignedBy: true,
                },
                orderBy: {
                    assignedAt: 'desc',
                },
            },
        },
    });
    return updatedOutage;
};
// ============================================================
// SOFT DELETE OUTAGE
// ============================================================
const deleteOutageFromDB = async (id) => {
    const existingOutage = await prisma_1.prisma.outage.findFirst({
        where: {
            id,
        },
    });
    if (!existingOutage) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Outage not found');
    }
    // --------------------------------------------------------
    // Don't delete an outage that is currently in progress
    // --------------------------------------------------------
    if (existingOutage.status === enums_1.OutageStatus.IN_PROGRESS) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'In-progress outage cannot be deleted');
    }
    // --------------------------------------------------------
    // Soft delete
    // --------------------------------------------------------
    const deletedOutage = await prisma_1.prisma.outage.delete({
        where: {
            id,
        },
    });
    return deletedOutage;
};
// ============================================================
// SEARCH OUTAGES
// ============================================================
const searchOutagesFromDB = async (searchTerm) => {
    const search = searchTerm.trim();
    if (!search) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Search query is required');
    }
    const searchUpper = search.toUpperCase();
    const orConditions = [
        {
            title: {
                contains: search,
                mode: 'insensitive',
            },
        },
        {
            description: {
                contains: search,
                mode: 'insensitive',
            },
        },
        {
            area: {
                name: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        },
        {
            area: {
                code: {
                    contains: search,
                    mode: 'insensitive',
                },
            },
        },
    ];
    // --------------------------------------------------------
    // Search by OutageType
    // --------------------------------------------------------
    if (Object.values(enums_1.OutageType).includes(searchUpper)) {
        orConditions.push({
            type: searchUpper,
        });
    }
    // --------------------------------------------------------
    // Search by OutageStatus
    // --------------------------------------------------------
    if (Object.values(enums_1.OutageStatus).includes(searchUpper)) {
        orConditions.push({
            status: searchUpper,
        });
    }
    // --------------------------------------------------------
    // Search by Priority
    // --------------------------------------------------------
    if (Object.values(enums_1.Priority).includes(searchUpper)) {
        orConditions.push({
            priority: searchUpper,
        });
    }
    const outages = await prisma_1.prisma.outage.findMany({
        where: {
            deletedAt: null,
            OR: orConditions,
        },
        include: {
            area: true,
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return outages;
};
// ============================================================
// GET ACTIVE OUTAGES
// ============================================================
const getActiveOutagesFromDB = async () => {
    const outages = await prisma_1.prisma.outage.findMany({
        where: {
            deletedAt: null,
            status: {
                in: ACTIVE_OUTAGE_STATUSES,
            },
        },
        include: {
            area: true,
            assignments: {
                include: {
                    technician: true,
                    assignedBy: true,
                },
            },
        },
        orderBy: [
            {
                priority: 'desc',
            },
            {
                createdAt: 'desc',
            },
        ],
    });
    return outages;
};
// ============================================================
// GET OUTAGES BY AREA
// ============================================================
const getOutagesByAreaFromDB = async (areaId) => {
    // --------------------------------------------------------
    // Check Area
    // --------------------------------------------------------
    const area = await prisma_1.prisma.area.findFirst({
        where: {
            id: areaId,
            deletedAt: null,
        },
    });
    if (!area) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'Area not found');
    }
    // --------------------------------------------------------
    // Get outages
    // --------------------------------------------------------
    const outages = await prisma_1.prisma.outage.findMany({
        where: {
            areaId,
            deletedAt: null,
        },
        include: {
            area: true,
            reports: {
                orderBy: {
                    createdAt: 'desc',
                },
            },
            assignments: {
                include: {
                    technician: true,
                    assignedBy: true,
                },
                orderBy: {
                    assignedAt: 'desc',
                },
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });
    return outages;
};
exports.outageServices = {
    createOutageIntoDB,
    getAllOutagesFromDB,
    getSingleOutageFromDB,
    updateOutageIntoDB,
    deleteOutageFromDB,
    searchOutagesFromDB,
    getActiveOutagesFromDB,
    getOutagesByAreaFromDB,
};
