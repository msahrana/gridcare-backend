import httpStatus from 'http-status';
import { Request, Response } from 'express';
import { paymentServices } from './payment.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const createPayment = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await paymentServices.createPaymentIntoDB(userId, req.body);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Payment created successfully',
        data: result,
    });
});

const getAllPayments = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.getAllPaymentsFromDB(req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payments retrieved successfully',
        data: result.data,
    });
});

const getSinglePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.getSinglePaymentFromDB(
        req.params.id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment retrieved successfully',
        data: result,
    });
});

const getMyPayments = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const result = await paymentServices.getMyPaymentsFromDB(userId, req.query);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'My payments retrieved successfully',
        data: result.data,
    });
});

const updatePaymentStatus = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.updatePaymentStatusIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment status updated successfully',
        data: result,
    });
});

const refundPayment = catchAsync(async (req: Request, res: Response) => {
    const result = await paymentServices.refundPaymentIntoDB(
        req.params.id as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment refunded successfully',
        data: result,
    });
});

const deletePayment = catchAsync(async (req: Request, res: Response) => {
    await paymentServices.deletePaymentFromDB(req.params.id as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment deleted successfully',
        data: null,
    });
});

export const paymentControllers = {
    createPayment,
    getAllPayments,
    getSinglePayment,
    getMyPayments,
    updatePaymentStatus,
    refundPayment,
    deletePayment,
};
