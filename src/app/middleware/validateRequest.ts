import { z } from 'zod';
import httpStatus from 'http-status';
import { Request, Response, NextFunction } from 'express';

import { AppError } from '../errors/AppError';

export const validateRequest = (zodSchema: z.ZodType) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = zodSchema.safeParse(req.body ?? {});

        if (!result.success) {
            throw new AppError(
                httpStatus.BAD_REQUEST,
                result.error.issues[0]?.message ?? 'Validation failed',
            );
        }

        req.body = result.data;

        next();
    };
};
