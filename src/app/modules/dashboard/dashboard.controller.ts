import httpStatus from 'http-status';
import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { dashboardServices } from './dashboard.service';

const getAdminDashboard = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardServices.getAdminDashboardFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin dashboard retrieved successfully',
        data: result,
    });
});

const getOperatorDashboard = catchAsync(async (req: Request, res: Response) => {
    const result = await dashboardServices.getOperatorDashboardFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Operator dashboard retrieved successfully',
        data: result,
    });
});

const getTechnicianDashboard = catchAsync(
    async (req: Request, res: Response) => {
        const result = await dashboardServices.getTechnicianDashboardFromDB(
            req.params.technicianId as string,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Technician dashboard retrieved successfully',
            data: result,
        });
    },
);

export const dashboardControllers = {
    getAdminDashboard,
    getOperatorDashboard,
    getTechnicianDashboard,
};
