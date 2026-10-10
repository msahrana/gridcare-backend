"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authServices = void 0;
const AppError_1 = require("../../errors/AppError");
const prisma_1 = require("../../lib/prisma");
const http_status_1 = __importDefault(require("http-status"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const redis_1 = require("../../lib/redis");
const crypto_1 = __importDefault(require("crypto"));
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const nodemailer_1 = require("../../lib/nodemailer");
const config_1 = __importDefault(require("../../config"));
const jwt_1 = require("../../utils/jwt");
const enums_1 = require("../../../generated/prisma/enums");
const googleAuth_1 = require("../../lib/googleAuth");
const cloudinary_1 = require("../../lib/cloudinary");
const registerUserIntoDB = async (payload) => {
    const { name, password } = payload;
    const email = payload.email.trim().toLowerCase();
    const isUserExists = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (isUserExists) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'User with this email already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 8);
    const expirationSeconds = 5 * 60; // 5 min
    const otpKey = `user-registration-otp:${email}`;
    const otpValue = crypto_1.default.randomInt(100000, 1000000).toString();
    if (config_1.default.node_env === 'development') {
        console.log(`[dev] ${email} : ${otpValue}`);
    }
    await redis_1.redisClient.set(otpKey, otpValue, {
        expiration: {
            type: 'EX',
            value: expirationSeconds,
        },
    });
    const userRegistrationKey = `user-registration-data:${email}`;
    const redisUserDataPayload = {
        name,
        email,
        password: hashedPassword,
    };
    await redis_1.redisClient.set(userRegistrationKey, JSON.stringify(redisUserDataPayload), {
        expiration: {
            type: 'EX',
            value: expirationSeconds,
        },
    });
    const templatePath = path_1.default.join(process.cwd(), 'src/app/templates/registration-user-otp.ejs');
    const templateData = {
        name,
        email,
        otp: otpValue,
        expirationMinutes: expirationSeconds / 60,
    };
    const html = await ejs_1.default.renderFile(templatePath, templateData);
    await nodemailer_1.transporter.sendMail({
        from: config_1.default.email_sender,
        to: email,
        subject: 'Email Verification',
        html,
    });
};
const verifyEmailIntoDB = async (payload) => {
    const otp = payload.otp;
    const email = payload.email.trim().toLowerCase();
    const isUserExists = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (isUserExists?.status === 'BLOCKED') {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User is Blocked!');
    }
    if (isUserExists?.emailVerified) {
        throw new AppError_1.AppError(http_status_1.default.CONFLICT, 'Email ALready Verified!');
    }
    if (isUserExists?.isDeleted || isUserExists?.status === 'DELETED') {
        throw new AppError_1.AppError(http_status_1.default.GONE, 'User is Deleted!');
    }
    const otpKey = `user-registration-otp:${email}`;
    const redisOtp = await redis_1.redisClient.get(otpKey);
    if (!redisOtp) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid OTP!');
    }
    if (redisOtp !== otp) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'OTP Does Not Match!');
    }
    await redis_1.redisClient.del([otpKey]);
    const userRegistrationKey = `user-registration-data:${email}`;
    const redisUserData = await redis_1.redisClient.get(userRegistrationKey);
    if (!redisUserData) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Does not Exist!');
    }
    const userPayload = JSON.parse(redisUserData);
    const createdUser = await prisma_1.prisma.user.create({
        data: {
            name: userPayload.name,
            email: userPayload.email,
            password: userPayload.password,
            role: enums_1.UserRole.CUSTOMER,
            emailVerified: true,
            status: enums_1.UserStatus.ACTIVE,
        },
        omit: { password: true },
    });
    await redis_1.redisClient.del(userRegistrationKey);
    const templatePath = path_1.default.join(process.cwd(), 'src/app/templates/user-welcome-email.ejs');
    const templateData = {
        name: createdUser.name,
    };
    const html = await ejs_1.default.renderFile(templatePath, templateData);
    await nodemailer_1.transporter.sendMail({
        from: config_1.default.email_sender,
        to: email,
        subject: 'Welcome To GridCare System',
        html,
    });
    const { ...user } = createdUser;
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        user,
        accessToken,
        refreshToken,
    };
};
const loginUserIntoDB = async (payload) => {
    const { password } = payload;
    const email = payload.email.trim().toLowerCase();
    const user = await prisma_1.prisma.user.findUnique({
        where: { email },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    if (user.status === enums_1.UserStatus.BLOCKED) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User is blocked');
    }
    if (user.isDeleted || user.status === enums_1.UserStatus.DELETED) {
        throw new AppError_1.AppError(http_status_1.default.GONE, 'User is deleted');
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(password, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid credentials');
    }
    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const getMeIntoDB = async (user) => {
    const isUserExists = await prisma_1.prisma.user.findUnique({
        where: {
            id: user.id,
        },
        omit: {
            password: true,
        },
    });
    if (!isUserExists) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User not found');
    }
    return isUserExists;
};
const refreshTokenIntoDB = async (token) => {
    const verifiedRefreshToken = jwt_1.jwtUtils.verifyToken(token, config_1.default.jwt_refresh_secret);
    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, config_1.default.node_env === 'development'
            ? verifiedRefreshToken.error
            : 'Invalid refresh token');
    }
    const data = verifiedRefreshToken.data;
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: data.userId },
    });
    if (!user || user.isDeleted || user.status !== enums_1.UserStatus.ACTIVE) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'User is inactive or not found');
    }
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const getAllUsersFromDB = async () => {
    const users = await prisma_1.prisma.user.findMany({
        omit: { password: true },
    });
    return users;
};
const getUserByIdFromDB = async (userId) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Not Found...!');
    }
    return user;
};
const updateMyProfileIntoDB = async (userId, payload) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Not Found...!');
    }
    const { name } = payload;
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { name },
    });
    return updatedUser;
};
const changePasswordIntoDB = async (userId, oldPassword, newPassword) => {
    const user = await prisma_1.prisma.user.findUnique({
        where: { id: userId },
    });
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Not Found...!');
    }
    const isPasswordMatched = await bcryptjs_1.default.compare(oldPassword, user.password);
    if (!isPasswordMatched) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid old password');
    }
    const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    const updatedUser = await prisma_1.prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });
    return updatedUser;
};
const googleLoginIntoDB = async (payload) => {
    let googleIdTokenPayload = null;
    try {
        const ticket = await googleAuth_1.googleClient.verifyIdToken({
            idToken: payload.idToken,
            audience: config_1.default.google_client_id,
        });
        googleIdTokenPayload = ticket.getPayload();
    }
    catch (error) {
        console.log('Google ID Token Verification Failed', error);
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid Or Expired Google Id Token');
    }
    if (!googleIdTokenPayload) {
        throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid Or Expired Google Id Token');
    }
    if (!googleIdTokenPayload.email) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Google Email Not Found');
    }
    if (!googleIdTokenPayload.name) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Google Email User Name Not Found');
    }
    const ifUserExistWithGoogleAuth = await prisma_1.prisma.user.findUnique({
        where: {
            email: googleIdTokenPayload.email,
            role: enums_1.UserRole.CUSTOMER,
            googleId: googleIdTokenPayload.sub,
        },
    });
    let user = ifUserExistWithGoogleAuth;
    if (!ifUserExistWithGoogleAuth) {
        const ifUserExistWithCredentials = await prisma_1.prisma.user.findUnique({
            where: {
                email: googleIdTokenPayload.email,
                role: enums_1.UserRole.CUSTOMER,
                authProvider: enums_1.AuthProvider.CREDENTIAL,
            },
        });
        if (ifUserExistWithCredentials) {
            if (!ifUserExistWithCredentials.emailVerified) {
                throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Email Not Verified');
            }
            if (ifUserExistWithCredentials.status === enums_1.UserStatus.BLOCKED) {
                throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User Is Blocked');
            }
            if (ifUserExistWithCredentials.isDeleted ||
                ifUserExistWithCredentials.status === enums_1.UserStatus.DELETED) {
                throw new AppError_1.AppError(http_status_1.default.GONE, 'User Is Deleted');
            }
            user = await prisma_1.prisma.user.update({
                where: {
                    id: ifUserExistWithCredentials.id,
                },
                data: {
                    googleId: googleIdTokenPayload.sub,
                },
            });
        }
        else {
            // Google Register
            user = await prisma_1.prisma.user.create({
                data: {
                    name: googleIdTokenPayload.name,
                    email: googleIdTokenPayload.email,
                    role: enums_1.UserRole.CUSTOMER,
                    googleId: googleIdTokenPayload.sub,
                    authProvider: enums_1.AuthProvider.GOOGLE,
                    emailVerified: true,
                },
            });
            // WelCome Message
            const templatePath = path_1.default.join(process.cwd(), 'src/app/templates/user-welcome-email.ejs');
            const templateData = {
                name: user.name,
            };
            const html = await ejs_1.default.renderFile(templatePath, templateData);
            await nodemailer_1.transporter.sendMail({
                from: config_1.default.email_sender,
                to: user.email,
                subject: 'Welcome To GridCare System',
                html,
            });
        }
    }
    if (!user) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Not Found');
    }
    if (user.status === enums_1.UserStatus.BLOCKED) {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User Is Blocked');
    }
    if (user.isDeleted || user.status === enums_1.UserStatus.DELETED) {
        throw new AppError_1.AppError(http_status_1.default.GONE, 'User Is Deleted');
    }
    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };
    const accessToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_access_secret, config_1.default.jwt_access_expires_in);
    const refreshToken = jwt_1.jwtUtils.createToken(jwtPayload, config_1.default.jwt_refresh_secret, config_1.default.jwt_refresh_expires_in);
    return {
        accessToken,
        refreshToken,
    };
};
const forgotPasswordIntoDB = async (payload) => {
    const { email } = payload;
    const isUserExist = await prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Does Not Exist!');
    }
    if (isUserExist.status === 'BLOCKED') {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User is Blocked!');
    }
    if (!isUserExist.emailVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User Not Verified!');
    }
    if (isUserExist.isDeleted || isUserExist.status === 'DELETED') {
        throw new AppError_1.AppError(http_status_1.default.GONE, 'User is Deleted!');
    }
    if (isUserExist.googleId && isUserExist.authProvider === 'GOOGLE') {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User Has Account With Google!');
    }
    const otp = crypto_1.default.randomInt(100000, 1000000).toString();
    if (config_1.default.node_env === 'development') {
        console.log(`[dev] ${email} : ${otp}`);
    }
    const key = `forgot-password-otp:${isUserExist.email}`;
    const expirationSeconds = 5 * 60; // 5 min
    await redis_1.redisClient.set(key, otp, {
        expiration: {
            type: 'EX',
            value: expirationSeconds,
        },
    });
    const templatePath = path_1.default.join(process.cwd(), 'src/app/templates/forgot-password.ejs');
    const templateData = {
        name: isUserExist.name,
        otp,
        expirationMinutes: expirationSeconds / 60,
    };
    const html = await ejs_1.default.renderFile(templatePath, templateData);
    await nodemailer_1.transporter.sendMail({
        from: config_1.default.email_sender,
        to: isUserExist.email,
        subject: 'Forgot Password',
        html,
    });
};
const resetPasswordIntoDB = async (payload) => {
    const { email, otp, newPassword } = payload;
    const isUserExist = await prisma_1.prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (!isUserExist) {
        throw new AppError_1.AppError(http_status_1.default.NOT_FOUND, 'User Does Not Exist!');
    }
    if (isUserExist.status === 'BLOCKED') {
        throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'User is Blocked!');
    }
    if (!isUserExist.emailVerified) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User Not Verified!');
    }
    if (isUserExist.isDeleted || isUserExist.status === 'DELETED') {
        throw new AppError_1.AppError(http_status_1.default.GONE, 'User is Deleted!');
    }
    if (isUserExist.googleId && isUserExist.authProvider === 'GOOGLE') {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'User Has Account With Google!');
    }
    const key = `forgot-password-otp:${isUserExist.email}`;
    const redisOtp = await redis_1.redisClient.get(key);
    if (!redisOtp) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'Invalid OTP!');
    }
    if (redisOtp !== otp) {
        throw new AppError_1.AppError(http_status_1.default.BAD_REQUEST, 'OTP Does Not Match!');
    }
    const hashedNewPassword = await bcryptjs_1.default.hash(newPassword, Number(config_1.default.bcrypt_salt_rounds));
    await prisma_1.prisma.user.update({
        where: {
            email: isUserExist.email,
        },
        data: {
            password: hashedNewPassword,
        },
    });
    await redis_1.redisClient.del([key]);
    const templatePath = path_1.default.join(process.cwd(), 'src/app/templates/reset-password-success.ejs');
    const templateData = {
        name: isUserExist.name,
    };
    const html = await ejs_1.default.renderFile(templatePath, templateData);
    await nodemailer_1.transporter.sendMail({
        from: config_1.default.email_sender,
        to: isUserExist.email,
        subject: 'Password Changed',
        html,
    });
};
const uploadProfileImageIntoDB = async (buffer, userId) => {
    const currentUser = await prisma_1.prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            imageUrl: true,
            imagePublicId: true,
        },
    });
    const cloudinaryResult = await new Promise((resolve, reject) => {
        cloudinary_1.cloudinary.uploader
            .upload_stream({
            resource_type: 'auto',
        }, async (error, result) => {
            if (error) {
                return reject(error);
            }
            if (!result) {
                return reject(new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'No result returned from Cloudinary'));
            }
            resolve(result);
        })
            .end(buffer);
    });
    const updatedUser = await prisma_1.prisma.user.update({
        where: {
            id: userId,
        },
        data: {
            imageUrl: cloudinaryResult.secure_url,
            imagePublicId: cloudinaryResult.public_id,
        },
        omit: {
            password: true,
        },
    });
    if (currentUser?.imagePublicId && currentUser.imageUrl) {
        await cloudinary_1.cloudinary.uploader.destroy(currentUser.imagePublicId);
    }
    return updatedUser;
};
exports.authServices = {
    registerUserIntoDB,
    verifyEmailIntoDB,
    loginUserIntoDB,
    getMeIntoDB,
    refreshTokenIntoDB,
    getAllUsersFromDB,
    getUserByIdFromDB,
    updateMyProfileIntoDB,
    changePasswordIntoDB,
    googleLoginIntoDB,
    forgotPasswordIntoDB,
    resetPasswordIntoDB,
    uploadProfileImageIntoDB,
};
