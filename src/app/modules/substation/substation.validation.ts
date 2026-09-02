import { z } from 'zod';

export const createSubstationValidationSchema = z.object({
    name: z
        .string({
            error: 'Substation name is required',
        })
        .min(2, 'Substation name must be at least 2 characters long')
        .max(100, 'Substation name must not exceed 100 characters')
        .trim(),

    code: z
        .string({
            error: 'Substation code is required',
        })
        .min(2, 'Substation code must be at least 2 characters long')
        .max(30, 'Substation code must not exceed 30 characters')
        .regex(
            /^[A-Z0-9_-]+$/,
            'Substation code can contain only uppercase letters, numbers, underscore and hyphen',
        )
        .trim(),

    zoneId: z
        .string({
            error: 'Zone ID is required',
        })
        .uuid('Invalid zone ID'),

    capacity: z
        .number({
            error: 'Capacity must be a number',
        })
        .positive('Capacity must be greater than 0')
        .optional(),

    isActive: z.boolean().optional(),
});

export const updateSubstationValidationSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Substation name must be at least 2 characters long')
            .max(100, 'Substation name must not exceed 100 characters')
            .trim()
            .optional(),

        code: z
            .string()
            .min(2, 'Substation code must be at least 2 characters long')
            .max(30, 'Substation code must not exceed 30 characters')
            .regex(
                /^[A-Z0-9_-]+$/,
                'Substation code can contain only uppercase letters, numbers, underscore and hyphen',
            )
            .trim()
            .optional(),

        zoneId: z.string().uuid('Invalid zone ID').optional(),

        capacity: z
            .number({
                error: 'Capacity must be a number',
            })
            .positive('Capacity must be greater than 0')
            .optional(),

        isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required to update the substation',
    });
