import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { adminServices } from './admin.service';


const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAllUsersFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users retrieved successfully!',
        data: result,
    });
});


const updateUserRole = catchAsync(async (req: Request, res: Response) => {
    const adminId = req.user?.id;

    const userId = req.params.id;

    const ipAddress = req.ip || req.headers['x-forwarded-for']?.toString();

    const result = await adminServices.updateUserRoleIntoDB(
        adminId as string,
        userId as string,
        req.body,
        ipAddress,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User role updated successfully!',
        data: result,
    });
});


const getDashboardStats = catchAsync(async (_req: Request, res: Response) => {
    const result = await adminServices.getAdminDashboardStatsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Admin dashboard statistics retrieved successfully!',
        data: result,
    });
});

const getAuditLogs = catchAsync(async (req: Request, res: Response) => {
    const result = await adminServices.getAuditLogsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Audit logs retrieved successfully!',
        data: result,
    });
});

export const adminControllers = {
    getAllUsers,
    updateUserRole,
    getDashboardStats,
    getAuditLogs,
};
