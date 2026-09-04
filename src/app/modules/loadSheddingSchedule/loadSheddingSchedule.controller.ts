import httpStatus from 'http-status';

import { sendResponse } from '../../utils/sendResponse';

import { loadSheddingScheduleServices } from './loadSheddingSchedule.service';
import catchAsync from '../../utils/catchAsync';
import { Request, Response } from 'express';

const createLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const createdById = req.user?.id;

        const result =
            await loadSheddingScheduleServices.createLoadSheddingScheduleIntoDB(
                createdById as string,
                {
                    ...req.body,
                    startTime: new Date(req.body.startTime),
                    endTime: new Date(req.body.endTime),
                },
            );

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Load Shedding Schedule Created Successfully!',
            data: result,
        });
    },
);

const getAllLoadSheddingSchedules = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await loadSheddingScheduleServices.getAllLoadSheddingSchedulesFromDB(
                req.query,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'All Load Shedding Schedules Retrieved Successfully!',
            data: result.data,
        });
    },
);

const getSingleLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await loadSheddingScheduleServices.getSingleLoadSheddingScheduleFromDB(
                id as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Single Load Shedding Schedule Retrieved Successfully!',
            data: result,
        });
    },
);

const updateLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await loadSheddingScheduleServices.updateLoadSheddingScheduleIntoDB(
                id as string,
                {
                    ...req.body,
                    ...(req.body.startTime && {
                        startTime: new Date(req.body.startTime),
                    }),
                    ...(req.body.endTime && {
                        endTime: new Date(req.body.endTime),
                    }),
                },
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Load Shedding Schedule Updated Successfully!',
            data: result,
        });
    },
);

const deleteLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        await loadSheddingScheduleServices.deleteLoadSheddingScheduleFromDB(
            id as string,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Load Shedding Schedule Deleted Successfully!',
            data: null,
        });
    },
);

const publishLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await loadSheddingScheduleServices.publishLoadSheddingScheduleIntoDB(
                id as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Load Shedding Schedule Published Successfully!',
            data: result,
        });
    },
);

const activateLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await loadSheddingScheduleServices.activateLoadSheddingScheduleIntoDB(
                id as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Load Shedding Schedule Activated Successfully!',
            data: result,
        });
    },
);

const completeLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await loadSheddingScheduleServices.completeLoadSheddingScheduleIntoDB(
                id as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Load Shedding Schedule Completed Successfully!',
            data: result,
        });
    },
);

const cancelLoadSheddingSchedule = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result =
            await loadSheddingScheduleServices.cancelLoadSheddingScheduleIntoDB(
                id as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Load Shedding Schedule Cancelled Successfully!',
            data: result,
        });
    },
);

const getUpcomingLoadSheddingSchedules = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await loadSheddingScheduleServices.getUpcomingLoadSheddingSchedulesFromDB();

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Upcoming Load Shedding Schedules Retrieved Successfully!',
            data: result,
        });
    },
);

export const loadSheddingScheduleControllers = {
    createLoadSheddingSchedule,
    getAllLoadSheddingSchedules,
    getSingleLoadSheddingSchedule,
    updateLoadSheddingSchedule,
    deleteLoadSheddingSchedule,
    publishLoadSheddingSchedule,
    activateLoadSheddingSchedule,
    completeLoadSheddingSchedule,
    cancelLoadSheddingSchedule,
    getUpcomingLoadSheddingSchedules,
};
