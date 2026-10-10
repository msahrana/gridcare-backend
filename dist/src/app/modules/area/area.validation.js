"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AreaValidation = void 0;
const zod_1 = require("zod");
const createAreaSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(2, 'Area name must be at least 2 characters')
        .max(100, 'Area name cannot exceed 100 characters'),
    code: zod_1.z
        .string()
        .min(2, 'Area code must be at least 2 characters')
        .max(50, 'Area code cannot exceed 50 characters')
        .regex(/^[A-Z0-9_-]+$/, 'Area code can only contain uppercase letters, numbers, _ and -'),
    zoneId: zod_1.z.string().uuid('Invalid zone ID'),
    substationId: zod_1.z
        .string()
        .uuid('Invalid substation ID')
        .optional()
        .nullable(),
    feederId: zod_1.z.string().uuid('Invalid feeder ID').optional().nullable(),
    address: zod_1.z
        .string()
        .max(255, 'Address cannot exceed 255 characters')
        .optional()
        .nullable(),
    latitude: zod_1.z
        .number()
        .min(-90, 'Latitude must be between -90 and 90')
        .max(90, 'Latitude must be between -90 and 90')
        .optional()
        .nullable(),
    longitude: zod_1.z
        .number()
        .min(-180, 'Longitude must be between -180 and 180')
        .max(180, 'Longitude must be between -180 and 180')
        .optional()
        .nullable(),
    isActive: zod_1.z.boolean().optional(),
});
const updateAreaSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100).optional(),
    code: zod_1.z
        .string()
        .min(2)
        .max(50)
        .regex(/^[A-Z0-9_-]+$/, 'Area code can only contain uppercase letters, numbers, _ and -')
        .optional(),
    zoneId: zod_1.z.string().uuid('Invalid zone ID').optional(),
    substationId: zod_1.z
        .string()
        .uuid('Invalid substation ID')
        .optional()
        .nullable(),
    feederId: zod_1.z.string().uuid('Invalid feeder ID').optional().nullable(),
    address: zod_1.z.string().max(255).optional().nullable(),
    latitude: zod_1.z.number().min(-90).max(90).optional().nullable(),
    longitude: zod_1.z.number().min(-180).max(180).optional().nullable(),
    isActive: zod_1.z.boolean().optional(),
});
const areaQuerySchema = zod_1.z.object({
    page: zod_1.z.coerce.number().int().min(1).optional(),
    limit: zod_1.z.coerce.number().int().min(1).max(100).optional(),
    search: zod_1.z.string().optional(),
    zoneId: zod_1.z.string().uuid().optional(),
    substationId: zod_1.z.string().uuid().optional(),
    feederId: zod_1.z.string().uuid().optional(),
    isActive: zod_1.z
        .enum(['true', 'false'])
        .transform((value) => value === 'true')
        .optional(),
});
exports.AreaValidation = {
    createAreaSchema,
    updateAreaSchema,
    areaQuerySchema,
};
