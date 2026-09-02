import { Request, Response } from 'express';
import catchAsync from '../../utils/catchAsync';
import { authServices } from './auth.service';
import { sendResponse } from '../../utils/sendResponse';
import httpStatus from 'http-status';
import { IRequestUser } from './auth.interface';
import { AppError } from '../../errors/AppError';

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

const getMe = catchAsync(async (req: Request, res: Response) => {
    const user = req.user as unknown as IRequestUser;

    if (!user) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User information is missing in the request',
        );
    }

    const result = await authServices.getMeIntoDB(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'User Profile Fetched Successfully!',
        data: result,
    });
});

const refreshToken = catchAsync(async (req: Request, res: Response) => {
    if (!req.cookies.refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token is missing');
    }

    const result = await authServices.refreshTokenIntoDB(
        req.cookies.refreshToken,
    );

    const { accessToken, refreshToken: newRefreshToken } = result;

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });

    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New tokens generated successfully!',
        data: {
            accessToken,
            refreshToken: newRefreshToken,
        },
    });
});

const getAllUsers = catchAsync(async (req: Request, res: Response) => {
    const result = await authServices.getAllUsersFromDB();

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'All Users Fetched Successfully!',
        data: result,
    });
});

const getUserById = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id;
    const result = await authServices.getUserByIdFromDB(userId as string);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Single User Found Successfully!',
        data: result,
    });
});

const updateMyProfile = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const payload = req.body;

    const result = await authServices.updateMyProfileIntoDB(userId, payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Profile Updated Successfully!',
        data: result,
    });
});

const changePassword = catchAsync(async (req: Request, res: Response) => {
    const userId = req.user?.id as string;
    const { oldPassword, newPassword } = req.body;

    const result = await authServices.changePasswordIntoDB(
        userId,
        oldPassword,
        newPassword,
    );

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Changed Successfully!',
        data: result,
    });
});

const googleLogin = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    const result = await authServices.googleLoginIntoDB(payload);

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
        message: 'New tokens generated successfully!',
        data: {
            accessToken,
            refreshToken,
        },
    });
});

const forgotPassword = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    await authServices.forgotPasswordIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: `OTP Sent To Email : ${payload.email}`,
        data: null,
    });
});

const resetPassword = catchAsync(async (req: Request, res: Response) => {
    const payload = req.body;

    await authServices.resetPasswordIntoDB(payload);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Password Changed Successfully!',
        data: null,
    });
});

const uploadProfileImage = catchAsync(
    async (req: Request, res: Response): Promise<void> => {
        if (!req.file) {
            res.status(httpStatus.BAD_REQUEST).json({
                success: false,
                message: 'No file uploaded.',
            });
            return;
        }

        const userId = req.user?.id as string;
        const fileBuffer = req.file.buffer;

        const result = await authServices.uploadProfileImageIntoDB(
            fileBuffer,
            userId,
        );

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Profile image uploaded successfully!',
            data: result,
        });
    },
);

export const authControllers = {
    registerUser,
    verifyEmail,
    loginUser,
    getMe,
    refreshToken,
    getAllUsers,
    getUserById,
    updateMyProfile,
    changePassword,
    googleLogin,
    forgotPassword,
    resetPassword,
    uploadProfileImage,
};
