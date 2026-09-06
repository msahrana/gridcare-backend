import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { automatedScheduleServices } from './automatedSchedule.service';

const generateSchedules = catchAsync(async (req: Request, res: Response) => {
    const result = await automatedScheduleServices.generateSchedulesIntoDB(
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Automated schedules generated successfully',
        data: result,
    });
});

const getSchedules = catchAsync(async (req: Request, res: Response) => {
    const result = await automatedScheduleServices.getGeneratedSchedulesFromDB({
        page: Number(req.query.page),
        limit: Number(req.query.limit),
        areaId: req.query.areaId as string,
        status: req.query.status as string,
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Automated schedules retrieved successfully',
        data: result.data,
    });
});

const getSingleSchedule = catchAsync(async (req: Request, res: Response) => {
    const result =
        await automatedScheduleServices.getSingleGeneratedScheduleFromDB(
            req.params.id as string,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Automated schedule retrieved successfully',
        data: result,
    });
});

const publishSchedule = catchAsync(async (req: Request, res: Response) => {
    const result =
        await automatedScheduleServices.publishGeneratedScheduleIntoDB(
            req.params.id as string,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule published successfully',
        data: result,
    });
});

const cancelSchedule = catchAsync(async (req: Request, res: Response) => {
    const result =
        await automatedScheduleServices.cancelGeneratedScheduleIntoDB(
            req.params.id as string,
        );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Schedule cancelled successfully',
        data: result,
    });
});

export const automatedScheduleControllers = {
    generateSchedules,
    getSchedules,
    getSingleSchedule,
    publishSchedule,
    cancelSchedule,
};
