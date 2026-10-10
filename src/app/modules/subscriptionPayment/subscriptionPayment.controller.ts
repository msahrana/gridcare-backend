import httpStatus from 'http-status';
import type { Request, Response } from 'express';

import config from '../../config';
import { AppError } from '../../errors/AppError';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';
import { subscriptionPaymentServices } from './subscriptionPayment.service';

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

            const pageMap = {
                // COMPLETED: 'payment-success',
                COMPLETED: 'customer',
                FAILED: 'payment-failed',
                CANCELLED: 'payment-cancelled',
                PENDING: 'payment-pending',
            } as const;

            const page =
                pageMap[result.status as keyof typeof pageMap] ??
                'payment-pending';

            // res.redirect(
            //     `${config.frontend_url}/subscription/${page}?paymentId=${encodeURIComponent(
            //         paymentID,
            //     )}`,
            // );
            res.redirect(
                `${config.frontend_url}/${page}/upcoming-load-shedding-schedules?paymentId=${encodeURIComponent(
                    paymentID,
                )}`,
            );
        } catch (error) {
            console.error('bKash callback error:', error);

            res.redirect(
                `${config.frontend_url}/subscription/payment-failed?paymentId=${encodeURIComponent(
                    paymentID,
                )}`,
            );
        }
    },
);

const getSingleSubscriptionPayment = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        const userId = req.user?.id;
        const paymentId = req.params.paymentId;

        if (!userId) {
            throw new AppError(
                httpStatus.UNAUTHORIZED,
                'User authentication required',
            );
        }

        if (typeof paymentId !== 'string' || !paymentId) {
            throw new AppError(httpStatus.BAD_REQUEST, 'Invalid payment ID');
        }

        const result =
            await subscriptionPaymentServices.getSingleSubscriptionPaymentIntoDB(
                paymentId,
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
            meta: result.meta,
        });
    },
);

export const subscriptionPaymentControllers = {
    createSubscriptionPayment,
    bkashCallback,
    getSingleSubscriptionPayment,
    getMySubscriptionPayments,
};
