import httpStatus from 'http-status';
import { Request, Response } from 'express';
import config from '../../config';
import { subscriptionPaymentServices } from './subscriptionPayment.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { AppError } from '../../errors/AppError';

const createSubscriptionPayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'User authentication required',
            );
        }

        const result =
            await subscriptionPaymentServices.createSubscriptionPaymentIntoDB(
                userId,
                req.body,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: result.reused
                ? 'Existing bKash payment returned successfully'
                : 'bKash payment created successfully',
            data: result,
        });
    },
);

const bkashCallback = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const paymentID =
            typeof req.query.paymentID === 'string'
                ? req.query.paymentID
                : undefined;

        const callbackStatus =
            typeof req.query.status === 'string' ? req.query.status : undefined;

        if (!paymentID) {
            res.redirect(`${config.frontend_url}/subscription/payment-failed`);

            return;
        }

        try {
            const result =
                await subscriptionPaymentServices.handleBKashCallbackIntoDB(
                    paymentID,
                    callbackStatus,
                );

            let page = 'payment-pending';

            switch (result.status) {
                case 'COMPLETED':
                    page = 'payment-success';
                    break;

                case 'FAILED':
                    page = 'payment-failed';
                    break;

                case 'CANCELLED':
                    page = 'payment-cancelled';
                    break;

                case 'PENDING':
                default:
                    page = 'payment-pending';
                    break;
            }

            res.redirect(
                `${config.frontend_url}/subscription/${page}?paymentId=${encodeURIComponent(
                    paymentID,
                )}`,
            );

            return;
        } catch (error) {
            console.error('bKash callback error:', error);

            res.redirect(
                `${config.frontend_url}/subscription/payment-failed?paymentId=${encodeURIComponent(
                    paymentID,
                )}`,
            );

            return;
        }
    },
);

const verifyBKashPayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const { paymentId } = req.params;

        if (!userId) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'User authentication required',
            );
        }

        if (!paymentId) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Payment ID is required',
            );
        }

        const result =
            await subscriptionPaymentServices.verifyBKashPaymentIntoDB(
                userId,
                paymentId as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Payment verification completed',
            data: result,
        });
    },
);

const getSingleSubscriptionPayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;

        const { paymentId } = req.params;

        if (!userId) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'User authentication required',
            );
        }

        if (!paymentId) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                'Payment ID is required',
            );
        }

        const result =
            await subscriptionPaymentServices.getSingleSubscriptionPaymentIntoDB(
                paymentId as string,
                userId,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscription payment retrieved successfully',
            data: result,
        });
    },
);

const getMySubscriptionPayments = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;

        if (!userId) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'User authentication required',
            );
        }

        const result =
            await subscriptionPaymentServices.getMySubscriptionPaymentsIntoDB(
                userId,
                req.query,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'My subscription payments retrieved successfully',

            data: result.data,
        });
    },
);

export const subscriptionPaymentControllers = {
    createSubscriptionPayment,
    bkashCallback,
    verifyBKashPayment,
    getSingleSubscriptionPayment,
    getMySubscriptionPayments,
};
