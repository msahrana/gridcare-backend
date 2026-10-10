"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedTechnician = exports.seedOperator = exports.seedAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_status_1 = __importDefault(require("http-status"));
const enums_1 = require("../../generated/prisma/enums");
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const prisma_1 = require("../lib/prisma");
// ======================================================
// Create Admin
// ======================================================
const seedAdmin = async () => {
    try {
        const name = config_1.default.admin_name;
        const email = config_1.default.admin_email;
        const password = config_1.default.admin_password;
        if (!name || !email || !password) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Admin name, email, or password is missing in the environment file.');
        }
        const existingAdmin = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingAdmin) {
            console.log('🔴 Admin already exists. Skipping admin seed.');
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
        const superAdmin = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: enums_1.UserRole.ADMIN,
                emailVerified: true,
            },
        });
        console.log(`Super Admin created successfully: ${superAdmin.email}`);
    }
    catch (error) {
        console.error('Error seeding Super Admin:', error);
    }
};
exports.seedAdmin = seedAdmin;
// ======================================================
// Create Operator
// ======================================================
const seedOperator = async () => {
    try {
        const name = config_1.default.operator_name;
        const email = config_1.default.operator_email;
        const password = config_1.default.operator_password;
        if (!name || !email || !password) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Operator name, email, or password is missing in the environment file.');
        }
        const existingOperator = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingOperator) {
            console.log('🏆 Operator already exists. Skipping operator seed.');
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
        const operator = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: enums_1.UserRole.OPERATOR,
                emailVerified: true,
            },
        });
        console.log(`Operator created successfully: ${operator.email}`);
    }
    catch (error) {
        console.error('Error seeding Operator:', error);
    }
};
exports.seedOperator = seedOperator;
// ======================================================
// Create Technician
// ======================================================
const seedTechnician = async () => {
    try {
        const name = config_1.default.technician_name;
        const email = config_1.default.technician_email;
        const password = config_1.default.technician_password;
        if (!name || !email || !password) {
            throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Technician name, email, or password is missing in the environment file.');
        }
        const existingTechnician = await prisma_1.prisma.user.findUnique({
            where: {
                email,
            },
        });
        if (existingTechnician) {
            console.log('📦 Technician already exists. Skipping technician seed.');
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, Number(config_1.default.bcrypt_salt_rounds));
        const technician = await prisma_1.prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: enums_1.UserRole.TECHNICIAN,
                emailVerified: true,
            },
        });
        console.log(`Technician created successfully: ${technician.email}`);
    }
    catch (error) {
        console.error('Error seeding Technician:', error);
    }
};
exports.seedTechnician = seedTechnician;
