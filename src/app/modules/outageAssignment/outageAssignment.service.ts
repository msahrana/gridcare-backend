import httpStatus from 'http-status';

import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';

import {
    ICreateOutageAssignmentPayload,
    IUpdateOutageAssignmentPayload,
} from './outageAssignment.interface';

// ==========================================
// CREATE OUTAGE ASSIGNMENT
// ==========================================

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

// ==========================================
// GET ALL OUTAGE ASSIGNMENTS
// ==========================================

const getAllOutageAssignmentsFromDB = async () => {
    const result = await prisma.outageAssignment.findMany({
        orderBy: {
            assignedAt: 'desc',
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

// ==========================================
// GET SINGLE OUTAGE ASSIGNMENT
// ==========================================

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

// ==========================================
// UPDATE OUTAGE ASSIGNMENT
// ==========================================

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

// ==========================================
// DELETE OUTAGE ASSIGNMENT
// ==========================================

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

// ==========================================
// GET ASSIGNMENTS BY OUTAGE
// ==========================================

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

// ==========================================
// GET ASSIGNMENTS BY TECHNICIAN
// ==========================================

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

// ==========================================
// GET MY ASSIGNMENTS
// ==========================================

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
