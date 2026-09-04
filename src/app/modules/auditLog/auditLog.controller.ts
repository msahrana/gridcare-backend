import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { auditLogServices } from './auditLog.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

// ======================================================
// CREATE
// ======================================================

const createAuditLog = catchAsync(async (req: Request, res: Response) => {
    const actorId = req.user?.id;

    const result = await auditLogServices.createAuditLogIntoDB(
        actorId as string,
        {
            ...req.body,
            ipAddress: req.body.ipAddress || req.ip || undefined,
        },
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Audit Log Created Successfully!',
        data: result,
    });
});

// ======================================================
// GET ALL
// ======================================================

const getAllAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const query = req.query;

    const result = await auditLogServices.getAllAuditLogsFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Audit Logs Retrieved Successfully!',
        data: result.data,
    });
});

// ======================================================
// GET SINGLE
// ======================================================

const getSingleAuditLog = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await auditLogServices.getSingleAuditLogFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Audit Log Retrieved Successfully!',
        data: result,
    });
});

// ======================================================
// GET BY ENTITY
// ======================================================

const getAuditLogsByEntity = catchAsync(async (req: Request, res: Response) => {
    const { entity, entityId } = req.params;

    const result = await auditLogServices.getAuditLogsByEntityFromDB(
        entity as string,
        entityId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Entity Audit Logs Retrieved Successfully!',
        data: result,
    });
});

// ======================================================
// DELETE
// ======================================================

const deleteAuditLog = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    await auditLogServices.deleteAuditLogFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audit Log Deleted Successfully!',
        data: null,
    });
});

export const auditLogControllers = {
    createAuditLog,
    getAllAuditLogs,
    getSingleAuditLog,
    getAuditLogsByEntity,
    deleteAuditLog,
};
