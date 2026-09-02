import type {
    ErrorRequestHandler,
    Request,
    Response,
    NextFunction,
} from 'express';
import { Prisma } from '../../generated/prisma/client';
import httpStatus from 'http-status';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';
import config from '../config';
import { AppError } from '../errors/AppError';

const { JsonWebTokenError, TokenExpiredError, NotBeforeError } = jwt;

type ErrorResponse = {
    success: false;
    statusCode: number;
    message: string;
    error?: unknown;
    stack?: string;
    details?: unknown;
};

export const globalErrorHandler: ErrorRequestHandler = (
    err: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction,
): void => {
    // =====================================================
    // Development Error Logging
    // =====================================================

    if (config.node_env === 'development') {
        console.error('Global Error Handler:', err);
    }

    let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal Server Error';
    let details: unknown;

    // =====================================================
    // 1. Custom Application Error
    // =====================================================

    if (err instanceof AppError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    // =====================================================
    // 2. Zod Validation Error
    // =====================================================
    else if (err instanceof ZodError) {
        statusCode = httpStatus.BAD_REQUEST;
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
        statusCode = httpStatus.UNAUTHORIZED;
        message = 'Your authentication token has expired.';
    }

    // =====================================================
    // 4. JWT Token Not Active Error
    // =====================================================
    else if (err instanceof NotBeforeError) {
        statusCode = httpStatus.UNAUTHORIZED;
        message = 'Your authentication token is not active yet.';
    }

    // =====================================================
    // 5. JWT Invalid Token Error
    // =====================================================
    else if (err instanceof JsonWebTokenError) {
        statusCode = httpStatus.UNAUTHORIZED;
        message = 'Invalid authentication token.';
    }

    // =====================================================
    // 6. Prisma Validation Error
    // =====================================================
    else if (err instanceof Prisma.PrismaClientValidationError) {
        statusCode = httpStatus.BAD_REQUEST;
        message = 'Invalid data provided.';
    }

    // =====================================================
    // 7. Prisma Known Request Error
    // =====================================================
    else if (err instanceof Prisma.PrismaClientKnownRequestError) {
        switch (err.code) {
            case 'P2002':
                statusCode = httpStatus.CONFLICT;
                message =
                    'A record with the provided unique value already exists.';
                details = err.meta;
                break;

            case 'P2003':
                statusCode = httpStatus.BAD_REQUEST;
                message = 'Foreign key constraint failed.';
                details = err.meta;
                break;

            case 'P2014':
                statusCode = httpStatus.BAD_REQUEST;
                message = 'The change violates a required database relation.';
                break;

            case 'P2025':
                statusCode = httpStatus.NOT_FOUND;
                message = 'The requested record was not found.';
                break;

            case 'P2021':
            case 'P2022':
                statusCode = httpStatus.INTERNAL_SERVER_ERROR;
                message = 'Database configuration error.';
                break;

            default:
                statusCode = httpStatus.INTERNAL_SERVER_ERROR;
                message = 'A database error occurred.';
                break;
        }
    }

    // =====================================================
    // 8. Prisma Initialization Error
    // =====================================================
    else if (err instanceof Prisma.PrismaClientInitializationError) {
        statusCode = httpStatus.SERVICE_UNAVAILABLE;

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
    else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unexpected database error occurred.';
    }

    // =====================================================
    // 10. Prisma Rust Panic Error
    // =====================================================
    else if (err instanceof Prisma.PrismaClientRustPanicError) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = 'A critical database error occurred.';
    }

    // =====================================================
    // 11. Generic JavaScript Error
    // =====================================================
    else if (err instanceof Error) {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;

        message =
            config.node_env === 'development'
                ? err.message
                : 'Internal Server Error';
    }

    // =====================================================
    // 12. Unknown Error
    // =====================================================
    else {
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = 'An unexpected error occurred.';
    }

    // =====================================================
    // Final Response
    // =====================================================

    const response: ErrorResponse = {
        success: false,
        statusCode,
        message,
    };

    // =====================================================
    // Development Only Debug Information
    // =====================================================

    if (config.node_env === 'development') {
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
