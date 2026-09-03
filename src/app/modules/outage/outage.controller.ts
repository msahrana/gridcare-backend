import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { outageServices } from './outage.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import {
    OutageStatus,
    OutageType,
    Priority,
} from '../../../generated/prisma/enums';

const createOutage = catchAsync(async (req: Request, res: Response) => {
    const result = await outageServices.createOutageIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Outage created successfully',
        data: result,
    });
});

const getAllOutages = catchAsync(async (req: Request, res: Response) => {
    const { page, limit, search, areaId, status, type, priority } = req.query;

    const result = await outageServices.getAllOutagesFromDB({
        page: page ? Number(page) : 1,

        limit: limit ? Number(limit) : 10,

        search: search ? String(search) : undefined,

        areaId: areaId ? String(areaId) : undefined,

        status: status
            ? (String(status).toUpperCase() as OutageStatus)
            : undefined,

        type: type ? (String(type).toUpperCase() as OutageType) : undefined,

        priority: priority
            ? (String(priority).toUpperCase() as Priority)
            : undefined,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Outages retrieved successfully',
        data: result.data,
    });
});

const getSingleOutage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await outageServices.getSingleOutageFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Outage retrieved successfully',
        data: result,
    });
});

const updateOutage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await outageServices.updateOutageIntoDB(
        id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage updated successfully',
        data: result,
    });
});

const deleteOutage = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await outageServices.deleteOutageFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage deleted successfully',
        data: result,
    });
});

const searchOutages = catchAsync(async (req: Request, res: Response) => {
    const searchTerm = String(req.query.search ?? '');

    const result = await outageServices.searchOutagesFromDB(searchTerm);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outages searched successfully',
        data: result,
    });
});

const getActiveOutages = catchAsync(async (_req: Request, res: Response) => {
    const result = await outageServices.getActiveOutagesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Active outages retrieved successfully',
        data: result,
    });
});

const getOutagesByArea = catchAsync(async (req: Request, res: Response) => {
    const { areaId } = req.params;

    const result = await outageServices.getOutagesByAreaFromDB(
        areaId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Area outages retrieved successfully',
        data: result,
    });
});

export const outageControllers = {
    createOutage,
    getAllOutages,
    getSingleOutage,
    updateOutage,
    deleteOutage,
    searchOutages,
    getActiveOutages,
    getOutagesByArea,
};
