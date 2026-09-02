import type { NextFunction, Request, Response } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import httpStatus from 'http-status';

import { UserRole, UserStatus } from '../../generated/prisma/enums';

import config from '../config';
import { prisma } from '../lib/prisma';
import { AppError } from '../errors/AppError';
import { jwtUtils } from '../utils/jwt';
import catchAsync from '../utils/catchAsync';

export interface RequestUser {
    id: string;
    email: string;
    name: string;
    role: UserRole;
}

declare global {
    namespace Express {
        interface Request {
            user?: RequestUser;
        }
    }
}

export const auth = (...requiredRoles: UserRole[]) => {
    return catchAsync(
        async (req: Request, _res: Response, next: NextFunction) => {
            // =====================================================
            // 1. Get Access Token
            // =====================================================

            const token = req.cookies.accessToken
                ? req.cookies.accessToken
                : req.headers.authorization?.startsWith('Bearer ')
                  ? req.headers.authorization.split(' ')[1]
                  : req.headers.authorization;

            // =====================================================
            // 2. Check Token
            // =====================================================

            if (!token) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'You are not logged in. Please log in to access this resource.',
                );
            }

            // =====================================================
            // 3. Verify JWT
            // =====================================================

            const verifiedToken = jwtUtils.verifyToken(
                token,
                config.jwt_access_secret,
            );

            if (!verifiedToken.success) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    verifiedToken.error,
                );
            }

            // =====================================================
            // 4. Get User ID From JWT
            // =====================================================

            const { id } = verifiedToken.data as JwtPayload;

            // =====================================================
            // 5. Validate User ID
            // =====================================================

            if (!id || typeof id !== 'string') {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'Invalid authentication token.',
                );
            }

            // =====================================================
            // 6. Find User From Database
            // =====================================================

            const user = await prisma.user.findUnique({
                where: {
                    id,
                },
            });

            // =====================================================
            // 7. Check User Exists
            // =====================================================

            if (!user) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'User not found. Please log in again.',
                );
            }

            // =====================================================
            // 8. Check Deleted User
            // =====================================================

            if (user.isDeleted) {
                throw new AppError(
                    httpStatus.UNAUTHORIZED,
                    'Your account has been deleted.',
                );
            }

            // =====================================================
            // 9. Check Blocked User
            // =====================================================

            if (user.status === UserStatus.BLOCKED) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    'Your account has been blocked. Please contact support.',
                );
            }

            // =====================================================
            // 10. Check Required Roles
            // =====================================================

            if (
                requiredRoles.length > 0 &&
                !requiredRoles.includes(user.role)
            ) {
                throw new AppError(
                    httpStatus.FORBIDDEN,
                    "Forbidden. You don't have permission to access this resource.",
                );
            }

            // =====================================================
            // 11. Attach User To Request
            // =====================================================

            req.user = {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
            };

            // =====================================================
            // 12. Continue
            // =====================================================

            next();
        },
    );
};
