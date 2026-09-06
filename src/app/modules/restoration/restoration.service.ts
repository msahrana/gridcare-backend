import httpStatus from 'http-status';

import { Prisma } from '../../../generated/prisma/browser';
import {
    OutageStatus,
    RestorationStatus,
    TechnicianStatus,
} from '../../../generated/prisma/enums';

import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';

import {
    ICreateRestorationPayload,
    IUpdateRestorationPayload,
} from './restoration.interface';

// =========================================================
// START RESTORATION
// =========================================================

const startRestorationIntoDB = async (payload: ICreateRestorationPayload) => {
    const { outageId, technicianId, remarks } = payload;

    return prisma.$transaction(async (tx) => {
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
            throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
        }

        // -----------------------------------------------------
        // Check outage status
        // -----------------------------------------------------

        if (
            outage.status === OutageStatus.RESTORED ||
            outage.status === OutageStatus.CLOSED
        ) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'This outage has already been restored or closed',
            );
        }

        if (outage.status === OutageStatus.CANCELLED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Cannot start restoration for a cancelled outage',
            );
        }

        // -----------------------------------------------------
        // Check existing restoration
        // -----------------------------------------------------

        const existingRestoration = await tx.restoration.findUnique({
            where: {
                outageId,
            },
        });

        if (existingRestoration) {
            throw new AppError(
                httpStatus.CONFLICT,
                'Restoration already exists for this outage',
            );
        }

        // -----------------------------------------------------
        // Technician required
        // -----------------------------------------------------

        if (!technicianId) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Technician ID is required',
            );
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
            throw new AppError(httpStatus.NOT_FOUND, 'Technician not found');
        }

        // -----------------------------------------------------
        // Check technician availability
        // -----------------------------------------------------

        if (technician.status !== TechnicianStatus.AVAILABLE) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Technician is not available',
            );
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
                status: RestorationStatus.IN_PROGRESS,
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
                status: OutageStatus.IN_PROGRESS,
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
                status: TechnicianStatus.BUSY,
            },
        });

        return restoration;
    });
};

// =========================================================
// COMPLETE RESTORATION
// =========================================================

const completeRestorationIntoDB = async (
    restorationId: string,
    payload?: IUpdateRestorationPayload,
) => {
    return prisma.$transaction(async (tx) => {
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
            throw new AppError(httpStatus.NOT_FOUND, 'Restoration not found');
        }

        // -----------------------------------------------------
        // Check restoration status
        // -----------------------------------------------------

        if (restoration.status === RestorationStatus.COMPLETED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Restoration is already completed',
            );
        }

        if (restoration.status === RestorationStatus.CANCELLED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Cancelled restoration cannot be completed',
            );
        }

        if (!restoration.startedAt) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Restoration start time is missing',
            );
        }

        // -----------------------------------------------------
        // Completion time
        // -----------------------------------------------------

        const completedAt = new Date();

        // -----------------------------------------------------
        // Duration in minutes
        // -----------------------------------------------------

        const duration = Math.max(
            0,
            Math.floor(
                (completedAt.getTime() - restoration.startedAt.getTime()) /
                    (1000 * 60),
            ),
        );

        // -----------------------------------------------------
        // Update restoration
        // -----------------------------------------------------

        const updatedRestoration = await tx.restoration.update({
            where: {
                id: restorationId,
            },
            data: {
                status: RestorationStatus.COMPLETED,
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
                status: OutageStatus.RESTORED,
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
                    status: TechnicianStatus.AVAILABLE,
                },
            });
        }

        return updatedRestoration;
    });
};

// =========================================================
// CANCEL RESTORATION
// =========================================================

const cancelRestorationIntoDB = async (
    restorationId: string,
    payload?: IUpdateRestorationPayload,
) => {
    return prisma.$transaction(async (tx) => {
        const restoration = await tx.restoration.findUnique({
            where: {
                id: restorationId,
            },
        });

        if (!restoration) {
            throw new AppError(httpStatus.NOT_FOUND, 'Restoration not found');
        }

        if (restoration.status === RestorationStatus.COMPLETED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Completed restoration cannot be cancelled',
            );
        }

        if (restoration.status === RestorationStatus.CANCELLED) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Restoration is already cancelled',
            );
        }

        const cancelledRestoration = await tx.restoration.update({
            where: {
                id: restorationId,
            },
            data: {
                status: RestorationStatus.CANCELLED,
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
                    status: TechnicianStatus.AVAILABLE,
                },
            });
        }

        return cancelledRestoration;
    });
};

// =========================================================
// GET SINGLE RESTORATION
// =========================================================

const getSingleRestorationFromDB = async (restorationId: string) => {
    const restoration = await prisma.restoration.findUnique({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Restoration not found');
    }

    return restoration;
};

// =========================================================
// GET ALL RESTORATIONS
// =========================================================

const getAllRestorationsFromDB = async (params: {
    page?: number;
    limit?: number;
    status?: RestorationStatus;
    technicianId?: string;
    outageId?: string;
}) => {
    const page = Number(params.page) || 1;
    const limit = Number(params.limit) || 10;

    const skip = (page - 1) * limit;

    const where: Prisma.RestorationWhereInput = {
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
        prisma.restoration.findMany({
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

        prisma.restoration.count({
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
        data,
    };
};

// =========================================================
// UPDATE RESTORATION
// =========================================================

const updateRestorationIntoDB = async (
    restorationId: string,
    payload: IUpdateRestorationPayload,
) => {
    const restoration = await prisma.restoration.findUnique({
        where: {
            id: restorationId,
        },
    });

    if (!restoration) {
        throw new AppError(httpStatus.NOT_FOUND, 'Restoration not found');
    }

    if (restoration.status !== RestorationStatus.IN_PROGRESS) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Only in-progress restoration can be updated',
        );
    }

    return prisma.restoration.update({
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

const deleteRestorationFromDB = async (restorationId: string) => {
    const restoration = await prisma.restoration.findUnique({
        where: {
            id: restorationId,
        },
    });

    if (!restoration) {
        throw new AppError(httpStatus.NOT_FOUND, 'Restoration not found');
    }

    if (restoration.status === RestorationStatus.COMPLETED) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Completed restoration cannot be deleted',
        );
    }

    return prisma.restoration.delete({
        where: {
            id: restorationId,
        },
    });
};

export const restorationServices = {
    startRestorationIntoDB,
    completeRestorationIntoDB,
    cancelRestorationIntoDB,
    getSingleRestorationFromDB,
    getAllRestorationsFromDB,
    updateRestorationIntoDB,
    deleteRestorationFromDB,
};
