"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuditLogValidation = void 0;
const zod_1 = require("zod");
const createAuditLogValidationSchema = zod_1.z.object({
    action: zod_1.z
        .string({ message: 'Action is required' })
        .min(2, 'Action must be at least 2 characters')
        .max(100, 'Action cannot exceed 100 characters'),
    entity: zod_1.z
        .string({ message: 'Entity is required' })
        .min(2, 'Entity must be at least 2 characters')
        .max(100, 'Entity cannot exceed 100 characters'),
    entityId: zod_1.z
        .string({ message: 'Entity ID is required' })
        .uuid('Invalid Entity ID'),
    oldValue: zod_1.z.unknown().optional(),
    newValue: zod_1.z.unknown().optional(),
    ipAddress: zod_1.z.string().max(100, 'IP address is invalid').optional(),
});
exports.AuditLogValidation = {
    createAuditLogValidationSchema,
};
