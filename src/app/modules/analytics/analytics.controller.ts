import httpStatus from 'http-status';
import { Request, Response } from 'express';

import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

import { analyticsServices } from './analytics.service';

const getOverviewAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await analyticsServices.getOverviewAnalyticsFromDB({
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        areaId: req.query.areaId as string,
        zoneId: req.query.zoneId as string,
        feederId: req.query.feederId as string,
        technicianId: req.query.technicianId as string,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Analytics overview retrieved successfully',
        data: result,
    });
});

const getOutageAnalytics = catchAsync(async (req: Request, res: Response) => {
    const result = await analyticsServices.getOutageAnalyticsFromDB({
        startDate: req.query.startDate as string,
        endDate: req.query.endDate as string,
        areaId: req.query.areaId as string,
        zoneId: req.query.zoneId as string,
        feederId: req.query.feederId as string,
        technicianId: req.query.technicianId as string,
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage analytics retrieved successfully',
        data: result,
    });
});

export const analyticsControllers = {
    getOverviewAnalytics,
    getOutageAnalytics,
};
