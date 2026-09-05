import { z } from 'zod';

export const createSubscriptionPlanValidationSchema = z.object({
    name: z
        .string()
        .min(2, 'Plan name must be at least 2 characters')
        .max(100, 'Plan name cannot exceed 100 characters'),

    description: z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),

    price: z.number().positive('Price must be greater than 0'),

    durationDays: z
        .number()
        .int('Duration must be an integer')
        .positive('Duration must be greater than 0'),

    status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
});

export const updateSubscriptionPlanValidationSchema = z
    .object({
        name: z
            .string()
            .min(2, 'Plan name must be at least 2 characters')
            .max(100, 'Plan name cannot exceed 100 characters')
            .optional(),

        description: z
            .string()
            .max(500, 'Description cannot exceed 500 characters')
            .optional(),

        price: z.number().positive('Price must be greater than 0').optional(),

        durationDays: z
            .number()
            .int('Duration must be an integer')
            .positive('Duration must be greater than 0')
            .optional(),

        status: z.enum(['ACTIVE', 'INACTIVE']).optional(),
    })
    .refine((data) => Object.keys(data).length > 0, {
        message: 'At least one field is required for update',
    });

export const createSubscriptionValidationSchema = z.object({
    planId: z.string().uuid('Invalid subscription plan ID'),
});
