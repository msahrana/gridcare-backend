import { AppError } from '../../errors/AppError';
import { prisma } from '../../lib/prisma';
import httpStatus from 'http-status';
import {
    ILoginUserPayload,
    IRegisterUserPayload,
    IVerifyEmailPayload,
} from './auth.interface';
import bcrypt from 'bcryptjs';
import { redisClient } from '../../lib/redis';
import crypto from 'crypto';
import ejs from 'ejs';
import path from 'path';
import { transporter } from '../../lib/nodemailer';
import config from '../../config';
import { SignOptions } from 'jsonwebtoken';
import { jwtUtils } from '../../utils/jwt';
import { UserRole, UserStatus } from '../../../generated/prisma/enums';

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

export const authServices = {
    registerUserIntoDB,
    verifyEmailIntoDB,
    loginUserIntoDB,
};
