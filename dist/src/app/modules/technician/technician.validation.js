"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.rejectTechnicianValidationSchema = exports.updateTechnicianVerificationValidationSchema = exports.updateTechnicianStatusValidationSchema = exports.updateTechnicianValidationSchema = exports.applyTechnicianValidationSchema = void 0;
const zod_1 = require("zod");
const enums_1 = require("../../../generated/prisma/enums");
exports.applyTechnicianValidationSchema = zod_1.z.object({
    user: zod_1.z.object({
        name: zod_1.z.string().trim().min(2, 'Name must be at least 2 characters'),
        email: zod_1.z.string().trim().email('Invalid email address'),
    }),
    technician: zod_1.z.object({
        phone: zod_1.z
            .string()
            .trim()
            .min(11, 'Phone number must be at least 11 characters'),
        employeeId: zod_1.z
            .string()
            .trim()
            .min(2, 'Employee ID must be at least 2 characters'),
        skills: zod_1.z.string().trim().optional(),
        experienceYears: zod_1.z.number().int().min(0).default(0),
        zoneId: zod_1.z.string().uuid().optional(),
        bio: zod_1.z
            .string()
            .trim()
            .max(1000, 'Bio must not exceed 1000 characters')
            .optional(),
    }),
});
exports.updateTechnicianValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        phone: zod_1.z.string().trim().min(11).max(20).optional(),
        employeeId: zod_1.z.string().trim().min(2).max(50).optional(),
        skills: zod_1.z.string().trim().max(500).optional(),
        experienceYears: zod_1.z.number().int().min(0).max(60).optional(),
        resume: zod_1.z.string().optional(),
        resumePublicId: zod_1.z.string().optional(),
        additionalFiles: zod_1.z
            .union([zod_1.z.record(zod_1.z.string(), zod_1.z.unknown()), zod_1.z.array(zod_1.z.unknown())])
            .optional(),
        technicianFee: zod_1.z.number().min(0).optional(),
        zoneId: zod_1.z.string().uuid().nullable().optional(),
        bio: zod_1.z.string().trim().max(1000).optional(),
    }),
});
exports.updateTechnicianStatusValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        status: zod_1.z.enum(enums_1.TechnicianStatus),
    }),
});
exports.updateTechnicianVerificationValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        verificationStatus: zod_1.z.enum(enums_1.TechnicianVerificationStatus),
        rejectionReason: zod_1.z.string().max(500).optional(),
    }),
});
exports.rejectTechnicianValidationSchema = zod_1.z.object({
    body: zod_1.z.object({
        rejectionReason: zod_1.z
            .string()
            .min(5, 'Rejection reason must be at least 5 characters')
            .max(500, 'Rejection reason must not exceed 500 characters'),
    }),
});
