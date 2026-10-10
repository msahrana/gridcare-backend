"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = exports.registrationZodSchema = void 0;
const zod_1 = require("zod");
exports.registrationZodSchema = zod_1.z.object({
    name: zod_1.z
        .string()
        .min(3, 'Name must be at least 2 characters')
        .max(100, 'Name must not exceed 100 characters')
        .trim(),
    email: zod_1.z
        .string()
        .email('Please provide a valid email address')
        .toLowerCase()
        .trim(),
    password: zod_1.z
        .string()
        .min(8, 'Password Must Minimum 8 Characters Long.')
        .regex(/[a-z]/, 'Password must contain at least 1 Lowercase Letter')
        .regex(/[A-Z]/, 'Password must contain at least 1 Uppercase Letter')
        .regex(/[0-9]/, 'Password must contain at least 1 Number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 Special Character')
        .max(100, 'Password must not exceed 100 characters'),
});
const emailVerifyZodSchema = zod_1.z.object({
    email: zod_1.z.email('Not email!!'),
    otp: zod_1.z.string().length(6),
});
const loginZodSchema = zod_1.z.object({
    email: zod_1.z.email(),
    password: zod_1.z
        .string()
        .min(8, 'Password Must Minimum 8 Characters Long.')
        .regex(/[a-z]/, 'Password must contain at least 1 Lowercase Letter')
        .regex(/[A-Z]/, 'Password must contain at least 1 Uppercase Letter')
        .regex(/[0-9]/, 'Password must contain at least 1 Number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 Special Character'),
});
const forgotPasswordZodSchema = zod_1.z.object({
    email: zod_1.z.email(),
});
const resetPasswordZodSchema = zod_1.z.object({
    email: zod_1.z.email(),
    newPassword: zod_1.z
        .string()
        .min(8, 'Password Must Minimum 8 Characters Long.')
        .regex(/[a-z]/, 'Password must contain at least 1 Lowercase Letter')
        .regex(/[A-Z]/, 'Password must contain at least 1 Uppercase Letter')
        .regex(/[0-9]/, 'Password must contain at least 1 Number')
        .regex(/[^A-Za-z0-9]/, 'Password must contain at least 1 Special Character'),
    otp: zod_1.z.string().length(6),
});
exports.userValidation = {
    registrationZodSchema: exports.registrationZodSchema,
    emailVerifyZodSchema,
    loginZodSchema,
    forgotPasswordZodSchema,
    resetPasswordZodSchema,
};
