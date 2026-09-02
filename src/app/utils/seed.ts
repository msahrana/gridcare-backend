import bcrypt from 'bcryptjs';
import httpStatus from 'http-status';

import { UserRole } from '../../generated/prisma/enums';

import config from '../config';
import { AppError } from '../errors/AppError';
import { prisma } from '../lib/prisma';

// ======================================================
// Create Admin
// ======================================================

export const seedAdmin = async (): Promise<void> => {
    try {
        const name = config.admin_name;
        const email = config.admin_email;
        const password = config.admin_password;

        if (!name || !email || !password) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Admin name, email, or password is missing in the environment file.',
            );
        }

        const existingAdmin = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingAdmin) {
            console.log('🔴 Admin already exists. Skipping admin seed.');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds),
        );

        const superAdmin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.ADMIN,
                emailVerified: true,
            },
        });

        console.log(`Super Admin created successfully: ${superAdmin.email}`);
    } catch (error) {
        console.error('Error seeding Super Admin:', error);
    }
};

// ======================================================
// Create Operator
// ======================================================

export const seedOperator = async (): Promise<void> => {
    try {
        const name = config.operator_name;
        const email = config.operator_email;
        const password = config.operator_password;

        if (!name || !email || !password) {
            throw new AppError(
                httpStatus.INTERNAL_SERVER_ERROR,
                'Operator name, email, or password is missing in the environment file.',
            );
        }

        const existingOperator = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (existingOperator) {
            console.log('🏆 Operator already exists. Skipping operator seed.');
            return;
        }

        const hashedPassword = await bcrypt.hash(
            password,
            Number(config.bcrypt_salt_rounds),
        );

        const operator = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: UserRole.OPERATOR,
                emailVerified: true,
            },
        });

        console.log(`Operator created successfully: ${operator.email}`);
    } catch (error) {
        console.error('Error seeding Operator:', error);
    }
};
