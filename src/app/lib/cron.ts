import cron from 'node-cron';
import { prisma } from './prisma';
import {
    TechnicianVerificationStatus,
    UserRole,
} from '../../generated/prisma/enums';

export const deleteUnverifiedTechnicians = async () => {
    cron.schedule('* */59 * * * *', async () => {
        try {
            const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

            const deletedTechnicians = await prisma.user.deleteMany({
                where: {
                    role: UserRole.TECHNICIAN,
                    emailVerified: false,
                    createdAt: { lt: oneHourAgo },
                    technician: {
                        verificationStatus:
                            TechnicianVerificationStatus.PENDING,
                    },
                },
            });

            if (deletedTechnicians.count > 0) {
                console.log(`
                Cron: Deleted ${deletedTechnicians.count} unverified email technician  applications older than 1 hour!
                `);
            }
        } catch (error) {
            console.log(
                'Cron: Failed to delete unverified technician applications!',
                error,
            );
        }

        console.log(
            '⚡ Unverified technician Delete cron schedule (every 59 minutes)!',
        );
    });
};

export const deleteRejectedTechnicians = async () => {
    cron.schedule('* * */23 * * *', async () => {
        try {
            const oneMonthAgo = new Date(Date.now() - 60 * 60 * 24 * 30 * 1000);

            const deletedTechnicians = await prisma.user.deleteMany({
                where: {
                    role: UserRole.TECHNICIAN,
                    emailVerified: false,
                    createdAt: { lt: oneMonthAgo },
                    technician: {
                        verificationStatus:
                            TechnicianVerificationStatus.REJECTED,
                    },
                },
            });

            if (deletedTechnicians.count > 0) {
                console.log(`
                Cron: Deleted ${deletedTechnicians.count} rejected email technician applications older than 1 month!
                `);
            }
        } catch (error) {
            console.log(
                'Cron: Failed to delete rejected technician applications!',
                error,
            );
        }

        console.log(
            '⭐ Rejected technician Delete cron schedule (every 23 hours)!',
        );
    });
};
