"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateZoneValidationSchema = exports.createZoneValidationSchema = void 0;
const zod_1 = require("zod");
exports.createZoneValidationSchema = zod_1.z.object({
    name: zod_1.z
        .string({
        error: 'Zone name is required',
    })
        .min(2, 'Zone name must be at least 2 characters long')
        .max(100, 'Zone name must not exceed 100 characters')
        .trim(),
    code: zod_1.z
        .string({
        error: 'Zone code is required',
    })
        .min(2, 'Zone code must be at least 2 characters long')
        .max(20, 'Zone code must not exceed 20 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Zone code can contain only uppercase letters, numbers, underscore and hyphen')
        .trim(),
    description: zod_1.z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.updateZoneValidationSchema = zod_1.z
    .object({
    name: zod_1.z
        .string()
        .min(2, 'Zone name must be at least 2 characters long')
        .max(100, 'Zone name must not exceed 100 characters')
        .trim()
        .optional(),
    code: zod_1.z
        .string()
        .min(2, 'Zone code must be at least 2 characters long')
        .max(20, 'Zone code must not exceed 20 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Zone code can contain only uppercase letters, numbers, underscore and hyphen')
        .trim()
        .optional(),
    description: zod_1.z
        .string()
        .max(500, 'Description must not exceed 500 characters')
        .trim()
        .optional(),
    isActive: zod_1.z.boolean().optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field is required to update the zone',
});
