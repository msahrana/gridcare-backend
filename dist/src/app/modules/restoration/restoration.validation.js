"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateRestorationValidationSchema = exports.createRestorationValidationSchema = void 0;
const zod_1 = require("zod");
exports.createRestorationValidationSchema = zod_1.z.object({
    outageId: zod_1.z.string().uuid('Invalid outage ID'),
    technicianId: zod_1.z.string().uuid('Invalid technician ID'),
    remarks: zod_1.z
        .string()
        .max(1000, 'Remarks cannot exceed 1000 characters')
        .optional(),
});
exports.updateRestorationValidationSchema = zod_1.z.object({
    remarks: zod_1.z
        .string()
        .max(1000, 'Remarks cannot exceed 1000 characters')
        .optional(),
});
