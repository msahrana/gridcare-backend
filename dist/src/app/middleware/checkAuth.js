"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../generated/prisma/enums");
const config_1 = __importDefault(require("../config"));
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../errors/AppError");
const jwt_1 = require("../utils/jwt");
const catchAsync_1 = __importDefault(require("../utils/catchAsync"));
const auth = (...requiredRoles) => {
    return (0, catchAsync_1.default)(async (req, _res, next) => {
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
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'You are not logged in. Please log in to access this resource.');
        }
        // =====================================================
        // 3. Verify JWT
        // =====================================================
        const verifiedToken = jwt_1.jwtUtils.verifyToken(token, config_1.default.jwt_access_secret);
        if (!verifiedToken.success) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, verifiedToken.error);
        }
        // =====================================================
        // 4. Get User ID From JWT
        // =====================================================
        const { id } = verifiedToken.data;
        // =====================================================
        // 5. Validate User ID
        // =====================================================
        if (!id || typeof id !== 'string') {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Invalid authentication token.');
        }
        // =====================================================
        // 6. Find User From Database
        // =====================================================
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                id,
            },
        });
        // =====================================================
        // 7. Check User Exists
        // =====================================================
        if (!user) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'User not found. Please log in again.');
        }
        // =====================================================
        // 8. Check Deleted User
        // =====================================================
        if (user.isDeleted) {
            throw new AppError_1.AppError(http_status_1.default.UNAUTHORIZED, 'Your account has been deleted.');
        }
        // =====================================================
        // 9. Check Blocked User
        // =====================================================
        if (user.status === enums_1.UserStatus.BLOCKED) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, 'Your account has been blocked. Please contact support.');
        }
        // =====================================================
        // 10. Check Required Roles
        // =====================================================
        if (requiredRoles.length > 0 &&
            !requiredRoles.includes(user.role)) {
            throw new AppError_1.AppError(http_status_1.default.FORBIDDEN, "Forbidden. You don't have permission to access this resource.");
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
    });
};
exports.auth = auth;
