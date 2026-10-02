import type { Request, Response } from 'express';
import httpStatus from 'http-status';

import { substationServices } from './substation.service';

import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { IQuery } from '../../interfaces';

const createSubstation = catchAsync(async (req: Request, res: Response) => {
    const result = await substationServices.createSubstationIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Substation created successfully!',
        data: result,
    });
});

const getAllSubstations = catchAsync(async (req: Request, res: Response) => {
    const query = req.query as IQuery;
    const result = await substationServices.getAllSubstationsFromDB(query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Substations retrieved successfully!',
        data: result.data,
        meta: result.meta,
    });
});

const getSingleSubstation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await substationServices.getSingleSubstationFromDB(
        id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Substation retrieved successfully!',
        data: result,
    });
});

const updateSubstation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await substationServices.updateSubstationIntoDB(
        id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Substation updated successfully!',
        data: result,
    });
});

/**
 * Delete Substation
 */
const deleteSubstation = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await substationServices.deleteSubstationFromDB(
        id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Substation deleted successfully!',
        data: result,
    });
});

export const substationControllers = {
    createSubstation,
    getAllSubstations,
    getSingleSubstation,
    updateSubstation,
    deleteSubstation,
};
