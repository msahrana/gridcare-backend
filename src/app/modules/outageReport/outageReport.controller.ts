import { Request, Response } from 'express';
import httpStatus from 'http-status';
import { outageReportServices } from './outageReport.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';

const createOutageReport = catchAsync(async (req: Request, res: Response) => {
    const reporterId = req.user?.id;

    if (!reporterId) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Authentication required to create an outage report',
        );
    }

    const result = await outageReportServices.createOutageReportIntoDB(
        reporterId,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Outage report created successfully!',
        data: result,
    });
});

const getAllOutageReports = catchAsync(async (req: Request, res: Response) => {
    const result = await outageReportServices.getAllOutageReportsFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All outage reports retrieved successfully',
        data: result,
    });
});

const getSingleOutageReport = catchAsync(
    async (req: Request, res: Response) => {
        const { id } = req.params;

        const result = await outageReportServices.getSingleOutageReportFromDB(
            id as string,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Single outage report retrieved successfully',
            data: result,
        });
    },
);

const getReportsByOutage = catchAsync(async (req: Request, res: Response) => {
    const { outageId } = req.params;

    const result = await outageReportServices.getReportsByOutageFromDB(
        outageId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage reports retrieved successfully',
        data: result,
    });
});

const getReportsByArea = catchAsync(async (req: Request, res: Response) => {
    const { areaId } = req.params;

    const result = await outageReportServices.getReportsByAreaFromDB(
        areaId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Area outage reports retrieved successfully',
        data: result,
    });
});

const updateOutageReport = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await outageReportServices.updateOutageReportIntoDB(
        id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage report updated successfully',
        data: result,
    });
});

const deleteOutageReport = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await outageReportServices.deleteOutageReportFromDB(
        id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Outage report deleted successfully',
        data: result,
    });
});

export const outageReportControllers = {
    createOutageReport,
    getAllOutageReports,
    getSingleOutageReport,
    getReportsByOutage,
    getReportsByArea,
    updateOutageReport,
    deleteOutageReport,
};
