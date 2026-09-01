import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { authServices } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';

const registerUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    await authServices.registerUserIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'Verification OTP Sent & Verification Your Account...!',
        data: null,
    });
});

const verifyEmail = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await authServices.verifyEmailIntoDB(payload);

    const { user, accessToken, refreshToken } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Email Verified Successfully!!',
        data: { user, accessToken, refreshToken },
    });
});

const loginUser = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await authServices.loginUserIntoDB(payload);

    const { accessToken, refreshToken } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });

    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User logged in Successfully!',
        data: {
            accessToken,
            refreshToken,
        },
    });
});

export const authControllers = { registerUser, verifyEmail, loginUser };
