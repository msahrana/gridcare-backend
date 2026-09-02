import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { areaServices } from './area.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const createArea = catchAsync(async (req: Request, res: Response) => {
    const result = await areaServices.createAreaIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Area created successfully!',
        data: result,
    });
});

const getAllAreas = catchAsync(async (req: Request, res: Response) => {
    const result = await areaServices.getAllAreasFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Areas retrieved successfully!',
        data: result.data,
    });
});

const getAreaById = catchAsync(async (req: Request, res: Response) => {
    const result = await areaServices.getAreaByIdFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Area retrieved successfully!',
        data: result,
    });
});

const updateArea = catchAsync(async (req: Request, res: Response) => {
    const result = await areaServices.updateAreaIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Area updated successfully!',
        data: result,
    });
});

const deleteArea = catchAsync(async (req: Request, res: Response) => {
    await areaServices.deleteAreaFromDB(req.params.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Area deleted successfully!',
        data: null,
    });
});

const searchAreas = catchAsync(async (req: Request, res: Response) => {
    const result = await areaServices.searchAreasFromDB(req.query.q as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Areas search completed successfully!',
        data: result,
    });
});

export const areaControllers = {
    createArea,
    getAllAreas,
    getAreaById,
    updateArea,
    deleteArea,
    searchAreas,
};
