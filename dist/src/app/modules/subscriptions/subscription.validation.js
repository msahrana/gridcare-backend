"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createSubscriptionValidationSchema = exports.updateSubscriptionPlanValidationSchema = exports.createSubscriptionPlanValidationSchema = void 0;
const zod_1 = require("zod");
exports.createSubscriptionPlanValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Plan name must be at least 2 characters')
        .max(100, 'Plan name cannot exceed 100 characters'),
    description: zod_1.z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    price: zod_1.z.number().positive('Price must be greater than 0'),
    durationDays: zod_1.z
        .number()
        .int('Duration must be an integer')
        .positive('Duration must be greater than 0'),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
});
exports.updateSubscriptionPlanValidationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(2, 'Plan name must be at least 2 characters')
        .max(100, 'Plan name cannot exceed 100 characters')
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description cannot exceed 500 characters')
        .optional(),
    price: zod_1.z.number().positive('Price must be greater than 0').optional(),
    durationDays: zod_1.z
        .number()
        .int('Duration must be an integer')
        .positive('Duration must be greater than 0')
        .optional(),
    status: zod_1.z.enum(['ACTIVE', 'INACTIVE']).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required for update',
});
exports.createSubscriptionValidationSchema = zod_1.z.object({
    planId: zod_1.z.string().uuid('Invalid subscription plan ID'),
});
