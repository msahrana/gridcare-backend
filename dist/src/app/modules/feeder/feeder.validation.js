"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFeederValidationSchema = exports.createFeederValidationSchema = void 0;
const zod_1 = require("zod");
exports.createFeederValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        error: 'Feeder name is required',
    })
        .min(2, 'Feeder name must be at least 2 characters long')
        .max(100, 'Feeder name must not exceed 100 characters')
        .trim(),
    code: zod_1.z
        .string({
        error: 'Feeder code is required',
    })
        .min(2, 'Feeder code must be at least 2 characters long')
        .max(30, 'Feeder code must not exceed 30 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Feeder code can contain only uppercase letters, numbers, underscore and hyphen')
        .trim(),
    substationId: zod_1.z
        .string({
        error: 'Substation ID is required',
    })
        .uuid('Invalid substation ID'),
    status: zod_1.z
        .string()
        .min(2, 'Status must be at least 2 characters long')
        .max(30, 'Status must not exceed 30 characters')
        .trim()
        .optional(),
});
exports.updateFeederValidationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(2, 'Feeder name must be at least 2 characters long')
        .max(100, 'Feeder name must not exceed 100 characters')
        .trim()
        .optional(),
    code: zod_1.z
        .string()
        .min(2, 'Feeder code must be at least 2 characters long')
        .max(30, 'Feeder code must not exceed 30 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Feeder code can contain only uppercase letters, numbers, underscore and hyphen')
        .trim()
        .optional(),
    substationId: zod_1.z.string().uuid('Invalid substation ID').optional(),
    status: zod_1.z
        .string()
        .min(2, 'Status must be at least 2 characters long')
        .max(30, 'Status must not exceed 30 characters')
        .trim()
        .optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update the feeder',
});
