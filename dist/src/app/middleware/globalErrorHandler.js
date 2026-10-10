"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.globalErrorHandler = void 0;
const client_1 = require("../../generated/prisma/client");
const http_status_1 = __importDefault(require("http-status"));
const zod_1 = require("zod");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jsonwebtoken_1.default;
const globalErrorHandler = (err, _req, res, _next) => {
    // =====================================================
    // Development Error Logging
    // =====================================================
    if (config_1.default.node_env === 'development') {
        if (err instanceof AppError_1.AppError) {
            if (err.statusCode >= 500) {
                console.error('Global Error Handler:', err);
            }
            else {
                console.warn(`[HTTP ${err.statusCode}] ${err.message}`);
            }
        }
        else {
            console.error('Global Error Handler:', err);
        }
    }
    let statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let details;
    // =====================================================
    // 1. Custom Application Error
    // =====================================================
    if (err instanceof AppError_1.AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }
    // =====================================================
    // 2. Zod Validation Error
    // =====================================================
    else if (err instanceof zod_1.ZodError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = 'Validation failed.';
        details = err.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
        }));
    }
    // =====================================================
    // 3. JWT Token Expired Error
    // =====================================================
    else if (err instanceof TokenExpiredError) {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Your authentication token has expired.';
    }
    // =====================================================
    // 4. JWT Token Not Active Error
    // =====================================================
    else if (err instanceof NotBeforeError) {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Your authentication token is not active yet.';
    }
    // =====================================================
    // 5. JWT Invalid Token Error
    // =====================================================
    else if (err instanceof JsonWebTokenError) {
        statusCode = http_status_1.default.UNAUTHORIZED;
        message = 'Invalid authentication token.';
    }
    // =====================================================
    // 6. Prisma Validation Error
    // =====================================================
    else if (err instanceof client_1.Prisma.PrismaClientValidationError) {
        statusCode = http_status_1.default.BAD_REQUEST;
        message = 'Invalid data provided.';
    }
    // =====================================================
    // 7. Prisma Known Request Error
    // =====================================================
    else if (err instanceof client_1.Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                statusCode = http_status_1.default.CONFLICT;
                message =
                    'A record with the provided unique value already exists.';
                details = err.meta;
                break;
            case 'P2003':
                statusCode = http_status_1.default.BAD_REQUEST;
                message = 'Foreign key constraint failed.';
                details = err.meta;
                break;
            case 'P2014':
                statusCode = http_status_1.default.BAD_REQUEST;
                message = 'The change violates a required database relation.';
                break;
            case 'P2025':
                statusCode = http_status_1.default.NOT_FOUND;
                message = 'The requested record was not found.';
                break;
            case 'P2021':
            case 'P2022':
                statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
                message = 'Database configuration error.';
                break;
            default:
                statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
                message = 'A database error occurred.';
                break;
        }
    }
    // =====================================================
    // 8. Prisma Initialization Error
    // =====================================================
    else if (err instanceof client_1.Prisma.PrismaClientInitializationError) {
        statusCode = http_status_1.default.SERVICE_UNAVAILABLE;
        switch (err.errorCode) {
            case 'P1000':
                message = 'Database authentication failed.';
                break;
            case 'P1001':
                message = 'Unable to connect to the database server.';
                break;
            case 'P1002':
                message = 'Database connection timed out.';
                break;
            default:
                message = 'Unable to initialize the database connection.';
                break;
        }
    }
    // =====================================================
    // 9. Prisma Unknown Request Error
    // =====================================================
    else if (err instanceof client_1.Prisma.PrismaClientUnknownRequestError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = 'An unexpected database error occurred.';
    }
    // =====================================================
    // 10. Prisma Rust Panic Error
    // =====================================================
    else if (err instanceof client_1.Prisma.PrismaClientRustPanicError) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = 'A critical database error occurred.';
    }
    // =====================================================
    // 11. Generic JavaScript Error
    // =====================================================
    else if (err instanceof Error) {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message =
            config_1.default.node_env === 'development'
                ? err.message
                : 'Internal Server Error';
    }
    // =====================================================
    // 12. Unknown Error
    // =====================================================
    else {
        statusCode = http_status_1.default.INTERNAL_SERVER_ERROR;
        message = 'An unexpected error occurred.';
    }
    // =====================================================
    // Final Response
    // =====================================================
    const response = {
        success: false,
        statusCode,
        message,
    };
    // =====================================================
    // Development Only Debug Information
    // =====================================================
    if (config_1.default.node_env === 'development') {
        response.error = err;
        if (err instanceof Error) {
            response.stack = err.stack;
        }
        if (details) {
            response.details = details;
        }
    }
    // =====================================================
    // Send Response
    // =====================================================
    res.status(statusCode).json(response);
};
exports.globalErrorHandler = globalErrorHandler;
