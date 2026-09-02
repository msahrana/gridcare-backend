import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { feederServices } from './feeder.service';

import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const createFeeder = catchAsync(async (req: Request, res: Response) => {
    const result = await feederServices.createFeederIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Feeder created successfully!',
        data: result,
    });
});

const getAllFeeders = catchAsync(async (_req: Request, res: Response) => {
    const result = await feederServices.getAllFeedersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Feeders retrieved successfully!',
        data: result,
    });
});

const getSingleFeeder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await feederServices.getSingleFeederFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single Feeder retrieved successfully!',
        data: result,
    });
});

const updateFeeder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await feederServices.updateFeederIntoDB(
        id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Feeder updated successfully!',
        data: result,
    });
});

const deleteFeeder = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await feederServices.deleteFeederFromDB(id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Feeder deleted successfully!',
        data: result,
    });
});

export const feederControllers = {
    createFeeder,
    getAllFeeders,
    getSingleFeeder,
    updateFeeder,
    deleteFeeder,
};
