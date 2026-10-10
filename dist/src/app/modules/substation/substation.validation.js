"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSubstationValidationSchema = exports.createSubstationValidationSchema = void 0;
const zod_1 = require("zod");
exports.createSubstationValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        error: 'Substation name is required',
    })
        .min(2, 'Substation name must be at least 2 characters long')
        .max(100, 'Substation name must not exceed 100 characters')
        .trim(),
    code: zod_1.z
        .string({
        error: 'Substation code is required',
    })
        .min(2, 'Substation code must be at least 2 characters long')
        .max(30, 'Substation code must not exceed 30 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Substation code can contain only uppercase letters, numbers, underscore and hyphen')
        .trim(),
    zoneId: zod_1.z
        .string({
        error: 'Zone ID is required',
    })
        .uuid('Invalid zone ID'),
    capacity: zod_1.z
        .number({
        error: 'Capacity must be a number',
    })
        .positive('Capacity must be greater than 0')
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateSubstationValidationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(2, 'Substation name must be at least 2 characters long')
        .max(100, 'Substation name must not exceed 100 characters')
        .trim()
        .optional(),
    code: zod_1.z
        .string()
        .min(2, 'Substation code must be at least 2 characters long')
        .max(30, 'Substation code must not exceed 30 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Substation code can contain only uppercase letters, numbers, underscore and hyphen')
        .trim()
        .optional(),
    zoneId: zod_1.z.string().uuid('Invalid zone ID').optional(),
    capacity: zod_1.z
        .number({
        error: 'Capacity must be a number',
    })
        .positive('Capacity must be greater than 0')
        .optional(),
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update the substation',
});
