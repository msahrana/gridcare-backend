"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authControllers = void 0;
const catchAsync_1 = __importDefault(require("../../utils/catchAsync"));
const auth_service_1 = require("./auth.service");
const sendResponse_1 = require("../../utils/sendResponse");
const http_status_1 = __importDefault(require("http-status"));
const AppError_1 = require("../../errors/AppError");
const config_1 = __importDefault(require("../../config"));
const registerUser = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    await auth_service_1.authServices.registerUserIntoDB(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.CREATED,
        success: true,
        message: 'Verification OTP Sent & Verification Your Account...!',
        data: null,
    });
});
const verifyEmail = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authServices.verifyEmailIntoDB(payload);
    const { user, accessToken, refreshToken } = result;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Email Verified Successfully!!',
        data: { user, accessToken, refreshToken },
    });
});
const loginUser = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authServices.loginUserIntoDB(payload);
    const { accessToken, refreshToken } = result;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged in Successfully!',
        data: {
            accessToken,
            refreshToken,
        },
    });
});
const getMe = (0, catchAsync_1.default)(async (req, res) => {
    const user = req.user;
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User information is missing in the request');
    }
    const result = await auth_service_1.authServices.getMeIntoDB(user);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User Profile Fetched Successfully!',
        data: result,
    });
});
const refreshToken = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.cookies.refreshToken) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Refresh token is missing');
    }
    const result = await auth_service_1.authServices.refreshTokenIntoDB(req.cookies.refreshToken);
    const { accessToken, refreshToken: newRefreshToken } = result;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', newRefreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New tokens generated successfully!',
        data: {
            accessToken,
            refreshToken: newRefreshToken,
        },
    });
});
const getAllUsers = (0, catchAsync_1.default)(async (req, res) => {
    const result = await auth_service_1.authServices.getAllUsersFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'All Users Fetched Successfully!',
        data: result,
    });
});
const getUserById = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.params.id;
    const result = await auth_service_1.authServices.getUserByIdFromDB(userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Single User Found Successfully!',
        data: result,
    });
});
const updateMyProfile = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const payload = req.body;
    const result = await auth_service_1.authServices.updateMyProfileIntoDB(userId, payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile Updated Successfully!',
        data: result,
    });
});
const changePassword = (0, catchAsync_1.default)(async (req, res) => {
    const userId = req.user?.id;
    const { oldPassword, newPassword } = req.body;
    const result = await auth_service_1.authServices.changePasswordIntoDB(userId, oldPassword, newPassword);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Changed Successfully!',
        data: result,
    });
});
const googleLogin = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    const result = await auth_service_1.authServices.googleLoginIntoDB(payload);
    const { accessToken, refreshToken } = result;
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24, // 24 hour or 1 day
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development' ? 'lax' : 'none',
        maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days
    });
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'New tokens generated successfully!',
        data: {
            accessToken,
            refreshToken,
        },
    });
});
const forgotPassword = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    await auth_service_1.authServices.forgotPasswordIntoDB(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: `OTP Sent To Email : ${payload.email}`,
        data: null,
    });
});
const resetPassword = (0, catchAsync_1.default)(async (req, res) => {
    const payload = req.body;
    await auth_service_1.authServices.resetPasswordIntoDB(payload);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Password Changed Successfully!',
        data: null,
    });
});
const logout = (0, catchAsync_1.default)(async (req, res) => {
    const cookieOptions = {
        httpOnly: true,
        secure: config_1.default.node_env === 'development' ? false : true,
        sameSite: config_1.default.node_env === 'development'
            ? 'lax'
            : 'none',
        path: '/',
    };
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'User logged out successfully!',
        data: null,
    });
});
const uploadProfileImage = (0, catchAsync_1.default)(async (req, res) => {
    if (!req.file) {
        res.status(http_status_1.default.BAD_REQUEST).json({
            success: false,
            message: 'No file uploaded.',
        });
        return;
    }
    const userId = req.user?.id;
    const fileBuffer = req.file.buffer;
    const result = await auth_service_1.authServices.uploadProfileImageIntoDB(fileBuffer, userId);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: http_status_1.default.OK,
        success: true,
        message: 'Profile image uploaded successfully!',
        data: result,
    });
});
exports.authControllers = {
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
    logout,
    uploadProfileImage,
};
