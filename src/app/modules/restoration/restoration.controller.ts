import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { restorationServices } from './restoration.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const startRestoration = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.startRestorationIntoDB(req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Restoration started successfully',
        data: result,
    });
});

const completeRestoration = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.completeRestorationIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Restoration completed successfully',
        data: result,
    });
});

const cancelRestoration = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.cancelRestorationIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Restoration cancelled successfully',
        data: result,
    });
});

const getAllRestorations = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.getAllRestorationsFromDB({
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        status: req.query.status as any,
        technicianId: req.query.technicianId as string,
        outageId: req.query.outageId as string,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Restorations retrieved successfully',
        data: result,
    });
});

const getSingleRestoration = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.getSingleRestorationFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Restoration retrieved successfully',
        data: result,
    });
});

const updateRestoration = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.updateRestorationIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Restoration updated successfully',
        data: result,
    });
});

const deleteRestoration = catchAsync(async (req: Request, res: Response) => {
    const result = await restorationServices.deleteRestorationFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Restoration deleted successfully',
        data: result,
    });
});

export const restorationControllers = {
    startRestoration,
    completeRestoration,
    cancelRestoration,
    getAllRestorations,
    getSingleRestoration,
    updateRestoration,
    deleteRestoration,
};
