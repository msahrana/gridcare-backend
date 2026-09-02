import type { Request, Response } from 'express';
import httpStatus from 'http-status';
import { sendResponse } from '../../utils/sendResponse';
import { zoneServices } from './zone.service';
import catchAsync from '../../utils/catchAsync';

const createZone = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await zoneServices.createZoneIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Zone created successfully!',
        data: result,
    });
});

const getAllZones = catchAsync(async (req: Request, res: Response) => {
    const result = await zoneServices.getAllZonesFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All zones retrieved successfully!',
        data: result,
    });
});

const getSingleZone = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await zoneServices.getSingleZoneFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single zone retrieved successfully!',
        data: result,
    });
});

const updateZone = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await zoneServices.updateZoneIntoDB(id as string, req.body);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Zone updated successfully!',
        data: result,
    });
});

const deleteZone = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await zoneServices.deleteZoneFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Zone deleted successfully!',
        data: result,
    });
});

export const zoneControllers = {
    createZone,
    getAllZones,
    getSingleZone,
    updateZone,
    deleteZone,
};
