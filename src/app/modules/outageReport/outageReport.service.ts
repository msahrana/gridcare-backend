import httpStatus from 'http-status';
import { prisma } from '../../lib/prisma';
import { AppError } from '../../errors/AppError';
import {
    ICreateOutageReportPayload,
    IUpdateOutageReportPayload,
} from './outageReport.interface';

const createOutageReportIntoDB = async (
    reporterId: string,
    payload: ICreateOutageReportPayload,
) => {
    // Reporter check
    const reporter = await prisma.user.findUnique({
        where: { id: reporterId },
    });

    if (!reporter) {
        throw new AppError(httpStatus.NOT_FOUND, 'Reporter not found');
    }

    // Area check
    const area = await prisma.area.findUnique({
        where: { id: payload.areaId },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    // Outage check (optional)
    if (payload.outageId) {
        const outage = await prisma.outage.findUnique({
            where: { id: payload.outageId },
        });

        if (!outage) {
            throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
        }
    }

    const result = await prisma.outageReport.create({
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

const getAllOutageReportsFromDB = async () => {
    const result = await prisma.outageReport.findMany({
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

const getSingleOutageReportFromDB = async (id: string) => {
    const result = await prisma.outageReport.findUnique({
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
        throw new AppError(httpStatus.NOT_FOUND, 'Outage report not found');
    }

    return result;
};

const getReportsByOutageFromDB = async (outageId: string) => {
    // Check outage
    const outage = await prisma.outage.findUnique({
        where: {
            id: outageId,
        },
    });

    if (!outage) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
    }

    const result = await prisma.outageReport.findMany({
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

const getReportsByAreaFromDB = async (areaId: string) => {
    // Check area
    const area = await prisma.area.findUnique({
        where: {
            id: areaId,
        },
    });

    if (!area) {
        throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
    }

    const result = await prisma.outageReport.findMany({
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

const updateOutageReportIntoDB = async (
    id: string,
    payload: IUpdateOutageReportPayload,
) => {
    const existingReport = await prisma.outageReport.findUnique({
        where: {
            id,
        },
    });

    if (!existingReport) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage report not found');
    }

    // Validate area if being updated
    if (payload.areaId) {
        const area = await prisma.area.findUnique({
            where: {
                id: payload.areaId,
            },
        });

        if (!area) {
            throw new AppError(httpStatus.NOT_FOUND, 'Area not found');
        }
    }

    // Validate outage if being updated
    if (payload.outageId) {
        const outage = await prisma.outage.findUnique({
            where: {
                id: payload.outageId,
            },
        });

        if (!outage) {
            throw new AppError(httpStatus.NOT_FOUND, 'Outage not found');
        }
    }

    const result = await prisma.outageReport.update({
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

const deleteOutageReportFromDB = async (id: string) => {
    const existingReport = await prisma.outageReport.findUnique({
        where: {
            id,
        },
    });

    if (!existingReport) {
        throw new AppError(httpStatus.NOT_FOUND, 'Outage report not found');
    }

    const result = await prisma.outageReport.delete({
        where: {
            id,
        },
    });

    return result;
};

export const outageReportServices = {
    createOutageReportIntoDB,
    getAllOutageReportsFromDB,
    getSingleOutageReportFromDB,
    getReportsByOutageFromDB,
    getReportsByAreaFromDB,
    updateOutageReportIntoDB,
    deleteOutageReportFromDB,
};
