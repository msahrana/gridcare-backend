import { z } from 'zod';

import {
    TechnicianStatus,
    TechnicianVerificationStatus,
} from '../../../generated/prisma/enums';

export const applyTechnicianValidationSchema = z.object({
    user: z.object({
        name: z.string().min(2, 'Name must be at least 2 characters'),

        email: z.string().email('Invalid email address'),
    }),

    technician: z.object({
        phone: z
            .string()
            .min(11, 'Phone number must be at least 11 characters'),

        employeeId: z
            .string()
            .min(2, 'Employee ID must be at least 2 characters'),

        skills: z.string().optional(),

        experienceYears: z.number().int().min(0).default(0),

        technicianFee: z.number().min(0).optional(),

        zoneId: z.string().uuid().optional(),
    }),
});

export const updateTechnicianValidationSchema = z.object({
    body: z.object({
        phone: z.string().min(11).max(20).optional(),

        employeeId: z.string().min(2).max(50).optional(),

        skills: z.string().max(500).optional(),

        experienceYears: z.number().int().min(0).max(60).optional(),

        resume: z.string().optional(),

        resumePublicId: z.string().optional(),

        additionalFiles: z
            .union([z.record(z.string(), z.unknown()), z.array(z.unknown())])
            .optional(),

        technicianFee: z.number().min(0).optional(),

        zoneId: z.string().uuid().nullable().optional(),
    }),
});

export const updateTechnicianStatusValidationSchema = z.object({
    body: z.object({
        status: z.enum(TechnicianStatus),
    }),
});

export const updateTechnicianVerificationValidationSchema = z.object({
    body: z.object({
        verificationStatus: z.enum(TechnicianVerificationStatus),

        rejectionReason: z.string().max(500).optional(),
    }),
});

export const rejectTechnicianValidationSchema = z.object({
    body: z.object({
        rejectionReason: z
            .string()
            .min(5, 'Rejection reason must be at least 5 characters')
            .max(500, 'Rejection reason must not exceed 500 characters'),
    }),
});
