import httpStatus from 'http-status';
import { AppError } from '../../errors/AppError';
import { ICreateOutagePayload, IUpdateOutagePayload } from './outage.interface';
import { prisma } from '../../lib/prisma';
import { Prisma } from '../../../generated/prisma/browser';
import {
    OutageStatus,
    OutageType,
    Priority,
} from '../../../generated/prisma/enums';

// ============================================================
// CONSTANTS
// ============================================================

const ACTIVE_OUTAGE_STATUSES: OutageStatus[] = [
    OutageStatus.REPORTED,
    OutageStatus.VERIFIED,
    OutageStatus.ASSIGNED,
    OutageStatus.IN_PROGRESS,
];

// ============================================================
// CREATE OUTAGE
// ============================================================

const createOutageIntoDB = async (payload: ICreateOutagePayload) => {
    const {
        areaId,
        title,
        description,
        type,
        priority,
        status,
        startedAt,
        restoredAt,
    } = payload;

    // --------------------------------------------------------
    // Check Area
    // --------------------------------------------------------

    const area = await prisma.area.findFirst({
        where: {
            id: areaId,
            deletedAt: null,
            isActive: true,
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found or inactive');
    }

    // --------------------------------------------------------
    // Validate startedAt / restoredAt
    // --------------------------------------------------------

    if (startedAt && restoredAt && restoredAt < startedAt) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Restored time cannot be earlier than started time',
        );
    }

    // --------------------------------------------------------
    // Validate restoredAt against status
    // --------------------------------------------------------

    const outageStatus = status ?? OutageStatus.REPORTED;

    if (
        restoredAt &&
        outageStatus !== OutageStatus.RESTORED &&
        outageStatus !== OutageStatus.CLOSED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'restoredAt can only be provided when outage status is RESTORED or CLOSED',
        );
    }

    // --------------------------------------------------------
    // Prevent duplicate active outage
    // --------------------------------------------------------

    const existingActiveOutage = await prisma.outage.findFirst({
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
        throw new AppError(
            httpStatus.CONFLICT,
            'An active outage with this title already exists in this area',
        );
    }

    // --------------------------------------------------------
    // Create outage
    // --------------------------------------------------------

    const outage = await prisma.outage.create({
        data: {
            areaId,
            title,
            description,
            type,
            priority: priority ?? Priority.MEDIUM,
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

const getAllOutagesFromDB = async (params: {
    page?: number;
    limit?: number;
    search?: string;
    areaId?: string;
    status?: OutageStatus;
    type?: OutageType;
    priority?: Priority;
}) => {
    const {
        page = 1,
        limit = 10,
        search,
        areaId,
        status,
        type,
        priority,
    } = params;

    const skip = (page - 1) * limit;

    const andConditions: Prisma.OutageWhereInput[] = [
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

    const whereConditions: Prisma.OutageWhereInput = {
        AND: andConditions,
    };

    // --------------------------------------------------------
    // Query
    // --------------------------------------------------------

    const [outages, total] = await prisma.$transaction([
        prisma.outage.findMany({
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

        prisma.outage.count({
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

const getSingleOutageFromDB = async (id: string) => {
    const outage = await prisma.outage.findFirst({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
    }

    return outage;
};

// ============================================================
// UPDATE OUTAGE
// ============================================================

const updateOutageIntoDB = async (
    id: string,
    payload: IUpdateOutagePayload,
) => {
    // --------------------------------------------------------
    // Check outage
    // --------------------------------------------------------

    const existingOutage = await prisma.outage.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingOutage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
    }

    // --------------------------------------------------------
    // Check Area if areaId is being updated
    // --------------------------------------------------------

    if (payload.areaId && payload.areaId !== existingOutage.areaId) {
        const area = await prisma.area.findFirst({
            where: {
                id: payload.areaId,
                deletedAt: null,
                isActive: true,
            },
        });

        if (!area) {
            throw new AppError(
                httpStatus.NOT_FOUND,
                'Area not found or inactive',
            );
        }
    }

    // --------------------------------------------------------
    // Calculate final values
    // --------------------------------------------------------

    const finalStartedAt =
        payload.startedAt !== undefined
            ? payload.startedAt
            : existingOutage.startedAt;

    const finalRestoredAt =
        payload.restoredAt !== undefined
            ? payload.restoredAt
            : existingOutage.restoredAt;

    const finalStatus = payload.status ?? existingOutage.status;

    // --------------------------------------------------------
    // Automatically set startedAt when status becomes
    // IN_PROGRESS
    // --------------------------------------------------------

    let startedAtToSave = finalStartedAt;

    if (payload.status === OutageStatus.IN_PROGRESS && !startedAtToSave) {
        startedAtToSave = new Date();
    }

    // --------------------------------------------------------
    // Automatically set restoredAt when status becomes
    // RESTORED
    // --------------------------------------------------------

    let restoredAtToSave = finalRestoredAt;

    if (payload.status === OutageStatus.RESTORED && !restoredAtToSave) {
        restoredAtToSave = new Date();
    }

    // --------------------------------------------------------
    // Validate startedAt / restoredAt
    // --------------------------------------------------------

    if (
        startedAtToSave &&
        restoredAtToSave &&
        restoredAtToSave < startedAtToSave
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Restored time cannot be earlier than started time',
        );
    }

    // --------------------------------------------------------
    // Validate restoredAt against final status
    // --------------------------------------------------------

    if (
        restoredAtToSave &&
        finalStatus !== OutageStatus.RESTORED &&
        finalStatus !== OutageStatus.CLOSED
    ) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'restoredAt can only be set when outage status is RESTORED or CLOSED',
        );
    }

    // --------------------------------------------------------
    // Prevent duplicate active outage
    // --------------------------------------------------------

    const finalAreaId = payload.areaId ?? existingOutage.areaId;

    const finalTitle = payload.title ?? existingOutage.title;

    const titleChanged =
        finalTitle.toLowerCase() !== existingOutage.title.toLowerCase();

    const areaChanged = finalAreaId !== existingOutage.areaId;

    if (titleChanged || areaChanged) {
        const duplicateOutage = await prisma.outage.findFirst({
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
            throw new AppError(
                httpStatus.CONFLICT,
                'An active outage with this title already exists in this area',
            );
        }
    }

    // --------------------------------------------------------
    // Update
    // --------------------------------------------------------

    const updatedOutage = await prisma.outage.update({
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

const deleteOutageFromDB = async (id: string) => {
    const existingOutage = await prisma.outage.findFirst({
        where: {
            id,
            deletedAt: null,
        },
    });

    if (!existingOutage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
    }

    // --------------------------------------------------------
    // Don't delete an outage that is currently in progress
    // --------------------------------------------------------

    if (existingOutage.status === OutageStatus.IN_PROGRESS) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'In-progress outage cannot be deleted',
        );
    }

    // --------------------------------------------------------
    // Soft delete
    // --------------------------------------------------------

    const deletedOutage = await prisma.outage.update({
        where: {
            id,
        },

        data: {
            deletedAt: new Date(),
        },
    });

    return deletedOutage;
};

// ============================================================
// SEARCH OUTAGES
// ============================================================

const searchOutagesFromDB = async (searchTerm: string) => {
    const search = searchTerm.trim();

    if (!search) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Search query is required');
    }

    const searchUpper = search.toUpperCase();

    const orConditions: Prisma.OutageWhereInput[] = [
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

    if (Object.values(OutageType).includes(searchUpper as OutageType)) {
        orConditions.push({
            type: searchUpper as OutageType,
        });
    }

    // --------------------------------------------------------
    // Search by OutageStatus
    // --------------------------------------------------------

    if (Object.values(OutageStatus).includes(searchUpper as OutageStatus)) {
        orConditions.push({
            status: searchUpper as OutageStatus,
        });
    }

    // --------------------------------------------------------
    // Search by Priority
    // --------------------------------------------------------

    if (Object.values(Priority).includes(searchUpper as Priority)) {
        orConditions.push({
            priority: searchUpper as Priority,
        });
    }

    const outages = await prisma.outage.findMany({
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
    const outages = await prisma.outage.findMany({
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

const getOutagesByAreaFromDB = async (areaId: string) => {
    // --------------------------------------------------------
    // Check Area
    // --------------------------------------------------------

    const area = await prisma.area.findFirst({
        where: {
            id: areaId,
            deletedAt: null,
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    // --------------------------------------------------------
    // Get outages
    // --------------------------------------------------------

    const outages = await prisma.outage.findMany({
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

export const outageServices = {
    createOutageIntoDB,
    getAllOutagesFromDB,
    getSingleOutageFromDB,
    updateOutageIntoDB,
    deleteOutageFromDB,
    searchOutagesFromDB,
    getActiveOutagesFromDB,
    getOutagesByAreaFromDB,
};
