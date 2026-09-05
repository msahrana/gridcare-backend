import httpStatus from 'http-status';
import { Request, Response } from 'express';

import { subscriptionServices } from './subscription.service';
import catchAsync from '../../utils/catchAsync';
import { sendResponse } from '../../utils/sendResponse';

const createSubscriptionPlan = catchAsync(
    async (req: Request, res: Response) => {
        const result = await subscriptionServices.createSubscriptionPlanIntoDB(
            req.body,
        );

        sendResponse(res, {
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'Subscription plan created successfully',
            data: result,
        });
    },
);

const getAllSubscriptionPlans = catchAsync(
    async (req: Request, res: Response) => {
        const result = await subscriptionServices.getAllSubscriptionPlansFromDB(
            req.query,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'All Subscription plans retrieved successfully',
            data: result.data,
        });
    },
);

const getSingleSubscriptionPlan = catchAsync(
    async (req: Request, res: Response) => {
        const result =
            await subscriptionServices.getSingleSubscriptionPlanFromDB(
                req.params.id as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Single Subscription plan retrieved successfully',
            data: result,
        });
    },
);

const updateSubscriptionPlan = catchAsync(
    async (req: Request, res: Response) => {
        const result = await subscriptionServices.updateSubscriptionPlanIntoDB(
            req.params.id as string,
            req.body,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscription plan updated successfully',
            data: result,
        });
    },
);

const deleteSubscriptionPlan = catchAsync(
    async (req: Request, res: Response) => {
        const result = await subscriptionServices.deleteSubscriptionPlanFromDB(
            req.params.id as string,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscription plan deleted successfully',
            data: result,
        });
    },
);

const createSubscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.createSubscriptionIntoDB(
        userId as string,
        req.body,
    );

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Subscription created successfully',
        data: result,
    });
});

const getMySubscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.getMySubscriptionFromDB(
        userId as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Current subscription retrieved successfully',
        data: result,
    });
});

const getMySubscriptionHistory = catchAsync(
    async (req: Request, res: Response) => {
        const userId = req.user?.id;

        const result =
            await subscriptionServices.getMySubscriptionHistoryFromDB(
                userId as string,
            );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Subscription history retrieved successfully',
            data: result,
        });
    },
);

const cancelSubscription = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    const result = await subscriptionServices.cancelSubscriptionIntoDB(
        userId as string,
        req.params.id as string,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Subscription cancelled successfully',
        data: result,
    });
});

export const subscriptionControllers = {
    createSubscriptionPlan,
    getAllSubscriptionPlans,
    getSingleSubscriptionPlan,
    updateSubscriptionPlan,
    deleteSubscriptionPlan,

    createSubscription,
    getMySubscription,
    getMySubscriptionHistory,
    cancelSubscription,
};
