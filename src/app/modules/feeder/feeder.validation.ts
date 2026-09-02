import { z } from 'zod';

export const createFeederValidationSchema = z.object({
    name: z
        .string({
            error: 'Feeder name is required',
        })
        .min(2, 'Feeder name must be at least 2 characters long')
        .max(100, 'Feeder name must not exceed 100 characters')
        .trim(),

    code: z
        .string({
            error: 'Feeder code is required',
        })
        .min(2, 'Feeder code must be at least 2 characters long')
        .max(30, 'Feeder code must not exceed 30 characters')
        .regex(
            /^[A-Z0-9_-]+$/,
            'Feeder code can contain only uppercase letters, numbers, underscore and hyphen',
        )
        .trim(),

    substationId: z
        .string({
            error: 'Substation ID is required',
        })
        .uuid('Invalid substation ID'),

    status: z
        .string()
        .min(2, 'Status must be at least 2 characters long')
        .max(30, 'Status must not exceed 30 characters')
        .trim()
        .optional(),
});

export const updateFeederValidationSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Feeder name must be at least 2 characters long')
            .max(100, 'Feeder name must not exceed 100 characters')
            .trim()
            .optional(),

        code: z
            .string()
            .min(2, 'Feeder code must be at least 2 characters long')
            .max(30, 'Feeder code must not exceed 30 characters')
            .regex(
                /^[A-Z0-9_-]+$/,
                'Feeder code can contain only uppercase letters, numbers, underscore and hyphen',
            )
            .trim()
            .optional(),

        substationId: z.string().uuid('Invalid substation ID').optional(),

        status: z
            .string()
            .min(2, 'Status must be at least 2 characters long')
            .max(30, 'Status must not exceed 30 characters')
            .trim()
            .optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required to update the feeder',
    });
