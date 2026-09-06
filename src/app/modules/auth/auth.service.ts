import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import httpStatus from 'http-status';
import {
    IForgotPasswordPayload,
    IGoogleLoginPayload,
    ILoginUserPayload,
    IRegisterUserPayload,
    IRequestUser,
    IResetPasswordPayload,
    IVerifyEmailPayload,
} from './auth.interface';
import bcrypt from 'bcryptjs';
import { redisClient } from '../../lib/redis';
import crypto from 'crypto';
import ejs from 'ejs';
import path from 'path';
import { transporter } from '../../lib/nodemailer';
import config from '../../config';
import { JwtPayload, SignOptions } from 'jsonwebtoken';
import { jwtUtils } from '../../utils/jwt';
import {
    AuthProvider,
    UserRole,
    UserStatus,
} from '../../../generated/prisma/enums';
import { Prisma } from '../../../generated/prisma/client';
import { googleClient } from '../../lib/googleAuth';
import { TokenPayload } from 'google-auth-library';
import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../../lib/cloudinary';

const registerUserIntoDB = async (payload: IRegisterUserPayload) => {
    const { name, password } = payload;

    const email = payload.email.trim().toLowerCase();

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists) {
        throw new AppError(
            httpStatus.CONFLICT,
            'User with this email already exists',
        );
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const expirationSeconds = 5 * 60; // 5 min

    const otpKey = `user-registration-otp:${email}`;
    const otpValue = crypto.randomInt(100000, 1000000).toString();

    await redisClient.set(otpKey, otpValue, {
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

    await redisClient.set(
        userRegistrationKey,
        JSON.stringify(redisUserDataPayload),
        {
            expiration: {
                type: 'EX',
                value: expirationSeconds,
            },
        },
    );

    const templatePath = path.join(
        process.cwd(),
        'src/app/templates/registration-user-otp.ejs',
    );

    const templateData = {
        name,
        email,
        otp: otpValue,
        expirationMinutes: expirationSeconds / 60,
    };

    const html = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: email,
        subject: 'Email Verification',
        html,
    });
};

const verifyEmailIntoDB = async (payload: IVerifyEmailPayload) => {
    const otp = payload.otp;

    const email = payload.email.trim().toLowerCase();

    const isUserExists = await prisma.user.findUnique({
        where: { email },
    });

    if (isUserExists?.status === 'BLOCKED') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked!');
    }

    if (isUserExists?.emailVerified) {
        throw new AppError(httpStatus.CONFLICT, 'Email ALready Verified!');
    }

    if (isUserExists?.isDeleted || isUserExists?.status === 'DELETED') {
        throw new AppError(httpStatus.GONE, 'User is Deleted!');
    }

    const otpKey = `user-registration-otp:${email}`;

    const redisOtp = await redisClient.get(otpKey);

    if (!redisOtp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP!');
    }

    if (redisOtp !== otp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP Does Not Match!');
    }

    await redisClient.del([otpKey]);

    const userRegistrationKey = `user-registration-data:${email}`;

    const redisUserData = await redisClient.get(userRegistrationKey);

    if (!redisUserData) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Does not Exist!');
    }

    const userPayload: IRegisterUserPayload = JSON.parse(redisUserData);

    const createdUser = await prisma.user.create({
        data: {
            name: userPayload.name,
            email: userPayload.email,
            password: userPayload.password,
            role: UserRole.CUSTOMER,
            emailVerified: true,
            status: UserStatus.ACTIVE,
        },
        omit: { password: true },
    });

    await redisClient.del(userRegistrationKey);

    const templatePath = path.join(
        process.cwd(),
        'src/app/templates/user-welcome-email.ejs',
    );

    const templateData = {
        name: createdUser.name,
    };

    const html = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: email,
        subject: 'Welcome To GridCare System',
        html,
    });

    const { ...user } = createdUser;

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        user,
        accessToken,
        refreshToken,
    };
};

const loginUserIntoDB = async (payload: ILoginUserPayload) => {
    const { password } = payload;

    const email = payload.email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
        where: { email },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, 'User is blocked');
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new AppError(httpStatus.GONE, 'User is deleted');
    }

    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid credentials');
    }

    const jwtPayload = {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const getMeIntoDB = async (user: IRequestUser) => {
    const isUserExists = await prisma.user.findUnique({
        where: {
            id: user.id,
        },
        omit: {
            password: true,
        },
    });

    if (!isUserExists) {
        throw new AppError(httpStatus.NOT_FOUND, 'User not found');
    }

    return isUserExists;
};

const refreshTokenIntoDB = async (token: string) => {
    const verifiedRefreshToken = jwtUtils.verifyToken(
        token,
        config.jwt_refresh_secret,
    );

    if (!verifiedRefreshToken.success || !verifiedRefreshToken.data) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            config.node_env === 'development'
                ? verifiedRefreshToken.error
                : 'Invalid refresh token',
        );
    }

    const data = verifiedRefreshToken.data as JwtPayload;

    const user = await prisma.user.findUnique({
        where: { id: data.userId },
    });

    if (!user || user.isDeleted || user.status !== UserStatus.ACTIVE) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'User is inactive or not found',
        );
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const getAllUsersFromDB = async () => {
    const users = await prisma.user.findMany({
        omit: { password: true },
    });

    return users;
};

const getUserByIdFromDB = async (userId: string) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
        omit: { password: true },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Not Found...!');
    }

    return user;
};

const updateMyProfileIntoDB = async (
    userId: string,
    payload: Prisma.UserUpdateInput,
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Not Found...!');
    }

    const { name } = payload;

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name },
    });

    return updatedUser;
};

const changePasswordIntoDB = async (
    userId: string,
    oldPassword: string,
    newPassword: string,
) => {
    const user = await prisma.user.findUnique({
        where: { id: userId },
    });

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Not Found...!');
    }

    const isPasswordMatched = await bcrypt.compare(
        oldPassword,
        user.password as string,
    );

    if (!isPasswordMatched) {
        throw new AppError(httpStatus.UNAUTHORIZED, 'Invalid old password');
    }

    const hashedNewPassword = await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { password: hashedNewPassword },
    });

    return updatedUser;
};

const googleLoginIntoDB = async (payload: IGoogleLoginPayload) => {
    let googleIdTokenPayload: TokenPayload | null | undefined = null;

    try {
        const ticket = await googleClient.verifyIdToken({
            idToken: payload.idToken,
            audience: config.google_client_id,
        });

        googleIdTokenPayload = ticket.getPayload();
    } catch (error) {
        console.log('Google ID Token Verification Failed', error);
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Invalid Or Expired Google Id Token',
        );
    }

    if (!googleIdTokenPayload) {
        throw new AppError(
            httpStatus.UNAUTHORIZED,
            'Invalid Or Expired Google Id Token',
        );
    }

    if (!googleIdTokenPayload.email) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Google Email Not Found');
    }
    if (!googleIdTokenPayload.name) {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'Google Email User Name Not Found',
        );
    }

    const ifUserExistWithGoogleAuth = await prisma.user.findUnique({
        where: {
            email: googleIdTokenPayload.email,
            role: UserRole.CUSTOMER,
            googleId: googleIdTokenPayload.sub,
        },
    });

    let user = ifUserExistWithGoogleAuth;

    if (!ifUserExistWithGoogleAuth) {
        const ifUserExistWithCredentials = await prisma.user.findUnique({
            where: {
                email: googleIdTokenPayload.email,
                role: UserRole.CUSTOMER,
                authProvider: AuthProvider.CREDENTIAL,
            },
        });

        if (ifUserExistWithCredentials) {
            if (!ifUserExistWithCredentials.emailVerified) {
                throw new AppError(
                    httpStatus.BAD_REQUEST,
                    'Email Not Verified',
                );
            }

            if (ifUserExistWithCredentials.status === UserStatus.BLOCKED) {
                throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked');
            }

            if (
                ifUserExistWithCredentials.isDeleted ||
                ifUserExistWithCredentials.status === UserStatus.DELETED
            ) {
                throw new AppError(httpStatus.GONE, 'User Is Deleted');
            }

            user = await prisma.user.update({
                where: {
                    id: ifUserExistWithCredentials.id,
                },

                data: {
                    googleId: googleIdTokenPayload.sub,
                },
            });
        } else {
            // Google Register
            user = await prisma.user.create({
                data: {
                    name: googleIdTokenPayload.name,
                    email: googleIdTokenPayload.email,
                    role: UserRole.CUSTOMER,
                    googleId: googleIdTokenPayload.sub,
                    authProvider: AuthProvider.GOOGLE,
                    emailVerified: true,
                },
            });

            // WelCome Message
            const templatePath = path.join(
                process.cwd(),
                'src/app/templates/user-welcome-email.ejs',
            );

            const templateData = {
                name: user.name,
            };

            const html = await ejs.renderFile(templatePath, templateData);

            await transporter.sendMail({
                from: config.email_sender,
                to: user.email,
                subject: 'Welcome To GridCare System',
                html,
            });
        }
    }

    if (!user) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Not Found');
    }

    if (user.status === UserStatus.BLOCKED) {
        throw new AppError(httpStatus.FORBIDDEN, 'User Is Blocked');
    }

    if (user.isDeleted || user.status === UserStatus.DELETED) {
        throw new AppError(httpStatus.GONE, 'User Is Deleted');
    }

    const jwtPayload = {
        userId: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
    };

    const accessToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_access_secret,
        config.jwt_access_expires_in as SignOptions,
    );

    const refreshToken = jwtUtils.createToken(
        jwtPayload,
        config.jwt_refresh_secret,
        config.jwt_refresh_expires_in as SignOptions,
    );

    return {
        accessToken,
        refreshToken,
    };
};

const forgotPasswordIntoDB = async (payload: IForgotPasswordPayload) => {
    const { email } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Does Not Exist!');
    }

    if (isUserExist.status === 'BLOCKED') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked!');
    }

    if (!isUserExist.emailVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Not Verified!');
    }

    if (isUserExist.isDeleted || isUserExist.status === 'DELETED') {
        throw new AppError(httpStatus.GONE, 'User is Deleted!');
    }

    if (isUserExist.googleId && isUserExist.authProvider === 'GOOGLE') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User Has Account With Google!',
        );
    }

    const otp = crypto.randomInt(100000, 1000000).toString();

    const key = `forgot-password-otp:${isUserExist.email}`;

    const expirationSeconds = 5 * 60; // 5 min

    await redisClient.set(key, otp, {
        expiration: {
            type: 'EX',
            value: expirationSeconds,
        },
    });

    const templatePath = path.join(
        process.cwd(),
        'src/app/templates/forgot-password.ejs',
    );

    const templateData = {
        name: isUserExist.name,
        otp,
        expirationMinutes: expirationSeconds / 60,
    };

    const html = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: isUserExist.email,
        subject: 'Forgot Password',
        html,
    });
};

const resetPasswordIntoDB = async (payload: IResetPasswordPayload) => {
    const { email, otp, newPassword } = payload;

    const isUserExist = await prisma.user.findUnique({
        where: {
            email,
        },
    });

    if (!isUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, 'User Does Not Exist!');
    }

    if (isUserExist.status === 'BLOCKED') {
        throw new AppError(httpStatus.FORBIDDEN, 'User is Blocked!');
    }

    if (!isUserExist.emailVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User Not Verified!');
    }

    if (isUserExist.isDeleted || isUserExist.status === 'DELETED') {
        throw new AppError(httpStatus.GONE, 'User is Deleted!');
    }

    if (isUserExist.googleId && isUserExist.authProvider === 'GOOGLE') {
        throw new AppError(
            httpStatus.BAD_REQUEST,
            'User Has Account With Google!',
        );
    }

    const key = `forgot-password-otp:${isUserExist.email}`;

    const redisOtp = await redisClient.get(key);

    if (!redisOtp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Invalid OTP!');
    }

    if (redisOtp !== otp) {
        throw new AppError(httpStatus.BAD_REQUEST, 'OTP Does Not Match!');
    }

    const hashedNewPassword = await bcrypt.hash(
        newPassword,
        Number(config.bcrypt_salt_rounds),
    );

    await prisma.user.update({
        where: {
            email: isUserExist.email,
        },
        data: {
            password: hashedNewPassword,
        },
    });

    await redisClient.del([key]);

    const templatePath = path.join(
        process.cwd(),
        'src/app/templates/reset-password-success.ejs',
    );

    const templateData = {
        name: isUserExist.name,
    };

    const html = await ejs.renderFile(templatePath, templateData);

    await transporter.sendMail({
        from: config.email_sender,
        to: isUserExist.email,
        subject: 'Password Changed',
        html,
    });
};

const uploadProfileImageIntoDB = async (buffer: Buffer, userId: string) => {
    const currentUser = await prisma.user.findUnique({
        where: {
            id: userId,
        },
        select: {
            imageUrl: true,
            imagePublicId: true,
        },
    });

    const cloudinaryResult = await new Promise<UploadApiResponse>(
        (resolve, reject) => {
            cloudinary.uploader
                .upload_stream(
                    {
                        resource_type: 'auto',
                    },

                    async (error, result) => {
                        if (error) {
                            return reject(error);
                        }

                        if (!result) {
                            return reject(
                                new AppError(
                                    httpStatus.INTERNAL_SERVER_ERROR,
                                    'No result returned from Cloudinary',
                                ),
                            );
                        }

                        resolve(result);
                    },
                )
                .end(buffer);
        },
    );

    const updatedUser = await prisma.user.update({
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
        await cloudinary.uploader.destroy(currentUser.imagePublicId);
    }

    return updatedUser;
};

export const authServices = {
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
