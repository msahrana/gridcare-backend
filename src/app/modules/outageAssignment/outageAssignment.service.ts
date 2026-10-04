import httpStatus from 'http-status';

import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import {
    ICreateOutageAssignmentPayload,
    IOutageAssignmentQuery,
    IUpdateOutageAssignmentPayload,
} from './outageAssignment.interface';
import { Prisma } from '../../../generated/prisma/client';

const createOutageAssignmentIntoDB = async (
    assignedById: string,
    payload: ICreateOutageAssignmentPayload,
) => {
    const { outageId, technicianId } = payload;

    // Check assigned user
    const assignedBy = await prisma.user.findUnique({
        where: {
            id: assignedById,
        },
    });

    if (!assignedBy) {
        throw new AppError(httpStatus.NOT_FOUND, 'Assigned By User Not Found');
    }

    // Check outage
    const outage = await prisma.outage.findUnique({
        where: {
            id: outageId,
        },
    });

    if (!outage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage Not Found');
    }

    // Check technician
    const technician = await prisma.technician.findUnique({
        where: {
            id: technicianId,
        },
    });

    if (!technician) {
        throw new AppError(httpStatus.NOT_FOUND, 'Technician Not Found');
    }

    // Check duplicate assignment
    const existingAssignment = await prisma.outageAssignment.findUnique({
        where: {
            outageId_technicianId: {
                outageId,
                technicianId,
            },
        },
    });

    if (existingAssignment) {
        throw new AppError(
            httpStatus.CONFLICT,
            'This Technician is Already Assigned to This Outage',
        );
    }

    // Create assignment
    const result = await prisma.outageAssignment.create({
        data: {
            outageId,
            technicianId,
            assignedById,
        },

        include: {
            outage: true,

            technician: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

const getAllOutageAssignmentsFromDB = async (query: IOutageAssignmentQuery) => {
    const limit = query.limit ? Number(query.limit) : 10;
    const page = query.page ? Number(query.page) : 1;
    const skip = (page - 1) * limit;

    const sortBy = query.sortBy || 'assignedAt';
    const sortOrder = query.sortOrder || 'desc';

    const andConditions: Prisma.OutageAssignmentWhereInput[] = [];

    if (query.searchTerm) {
        andConditions.push({
            OR: [
                {
                    outage: {
                        title: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    technician: {
                        employeeId: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
                {
                    assignedBy: {
                        name: {
                            contains: query.searchTerm,
                            mode: 'insensitive',
                        },
                    },
                },
            ],
        });
    }

    const allOutageAssignments = await prisma.outageAssignment.findMany({
        where: {
            AND: andConditions,
        },
        take: limit,
        skip,
        orderBy: {
            [sortBy]: sortOrder,
        },
        include: {
            outage: true,

            technician: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    const totalOutageAssignmentCount = await prisma.outageAssignment.count({
        where: {
            AND: andConditions,
        },
    });

    return {
        data: allOutageAssignments,
        meta: {
            page,
            limit,
            total: totalOutageAssignmentCount,
            totalPages: Math.ceil(totalOutageAssignmentCount / limit),
        },
    };
};

const getSingleOutageAssignmentFromDB = async (id: string) => {
    const result = await prisma.outageAssignment.findUnique({
        where: {
            id,
        },

        include: {
            outage: true,

            technician: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    if (!result) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage Assignment Not Found');
    }

    return result;
};

const updateOutageAssignmentIntoDB = async (
    id: string,
    payload: IUpdateOutageAssignmentPayload,
) => {
    const existingAssignment = await prisma.outageAssignment.findUnique({
        where: {
            id,
        },
    });

    if (!existingAssignment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage Assignment Not Found');
    }

    const result = await prisma.outageAssignment.update({
        where: {
            id,
        },

        data: {
            status:
                payload.status !== undefined
                    ? payload.status
                    : existingAssignment.status,

            acceptedAt:
                payload.acceptedAt !== undefined
                    ? payload.acceptedAt
                    : existingAssignment.acceptedAt,

            startedAt:
                payload.startedAt !== undefined
                    ? payload.startedAt
                    : existingAssignment.startedAt,

            completedAt:
                payload.completedAt !== undefined
                    ? payload.completedAt
                    : existingAssignment.completedAt,
        },

        include: {
            outage: true,
            technician: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

const deleteOutageAssignmentFromDB = async (id: string) => {
    const existingAssignment = await prisma.outageAssignment.findUnique({
        where: {
            id,
        },
    });

    if (!existingAssignment) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage Assignment Not Found');
    }

    const result = await prisma.outageAssignment.delete({
        where: {
            id,
        },
    });

    return result;
};

const getAssignmentsByOutageFromDB = async (outageId: string) => {
    const outage = await prisma.outage.findUnique({
        where: {
            id: outageId,
        },
    });

    if (!outage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage Not Found');
    }

    const result = await prisma.outageAssignment.findMany({
        where: {
            outageId,
        },

        orderBy: {
            assignedAt: 'desc',
        },

        include: {
            technician: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

const getAssignmentsByTechnicianFromDB = async (technicianId: string) => {
    const technician = await prisma.technician.findUnique({
        where: {
            id: technicianId,
        },
    });

    if (!technician) {
        throw new AppError(httpStatus.NOT_FOUND, 'Technician Not Found');
    }

    const result = await prisma.outageAssignment.findMany({
        where: {
            technicianId,
        },

        orderBy: {
            assignedAt: 'desc',
        },

        include: {
            outage: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

const getMyAssignmentsFromDB = async (userId: string) => {
    const technician = await prisma.technician.findUnique({
        where: {
            userId,
        },
    });

    if (!technician) {
        throw new AppError(
            httpStatus.NOT_FOUND,
            'Technician Profile Not Found',
        );
    }

    const result = await prisma.outageAssignment.findMany({
        where: {
            technicianId: technician.id,
        },

        orderBy: {
            assignedAt: 'desc',
        },

        include: {
            outage: true,

            assignedBy: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                },
            },
        },
    });

    return result;
};

export const outageAssignmentServices = {
    createOutageAssignmentIntoDB,
    getAllOutageAssignmentsFromDB,
    getSingleOutageAssignmentFromDB,
    updateOutageAssignmentIntoDB,
    deleteOutageAssignmentFromDB,
    getAssignmentsByOutageFromDB,
    getAssignmentsByTechnicianFromDB,
    getMyAssignmentsFromDB,
};
