import app from './app';
import config from './app/config';
import {
    deleteRejectedTechnicians,
    deleteUnverifiedTechnicians,
} from './app/lib/cron';
import { transporter } from './app/lib/nodemailer';
import { prisma } from './app/lib/prisma';
import { redisClient } from './app/lib/redis';
import { seedAdmin, seedOperator, seedTechnician } from './app/utils/seed';

const PORT = config.port;

const main = async () => {
    try {
        await prisma.$connect();
        console.log('🗃️ Database connected successfully!!!');

        await redisClient.connect();

        await transporter.verify();
        console.log('⭐ Nodemailer Connected Successfully.');

        await seedAdmin();
        await seedOperator();
        await seedTechnician();

        await deleteUnverifiedTechnicians();
        await deleteRejectedTechnicians();

        app.listen(PORT, () => {
            console.log(`🚀 Server is running on port: ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error starting the server:', error);

        await redisClient.quit().catch(() => {});
        await prisma.$disconnect().catch(() => {});

        process.exit(1);
    }
};

main();
