import { z } from 'zod';

export const createZoneValidationSchema = z.object({
    name: z
        .string({
            error: 'Zone name is required',
        })
        .min(2, 'Zone name must be at least 2 characters long')
        .max(100, 'Zone name must not exceed 100 characters')
        .trim(),

    code: z
        .string({
            error: 'Zone code is required',
        })
        .min(2, 'Zone code must be at least 2 characters long')
        .max(20, 'Zone code must not exceed 20 characters')
        .regex(
            /^[A-Z0-9_-]+$/,
            'Zone code can contain only uppercase letters, numbers, underscore and hyphen',
        )
        .trim(),

    description: z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),

    isActive: z.boolean().optional(),
});

export const updateZoneValidationSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Zone name must be at least 2 characters long')
            .max(100, 'Zone name must not exceed 100 characters')
            .trim()
            .optional(),

        code: z
            .string()
            .min(2, 'Zone code must be at least 2 characters long')
            .max(20, 'Zone code must not exceed 20 characters')
            .regex(
                /^[A-Z0-9_-]+$/,
                'Zone code can contain only uppercase letters, numbers, underscore and hyphen',
            )
            .trim()
            .optional(),

        description: z
            .string()
            .max(500, 'Description must not exceed 500 characters')
            .trim()
            .optional(),

        isActive: z.boolean().optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required to update the zone',
    });
