"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./app/config"));
const cron_1 = require("./app/lib/cron");
const nodemailer_1 = require("./app/lib/nodemailer");
const prisma_1 = require("./app/lib/prisma");
const redis_1 = require("./app/lib/redis");
const seed_1 = require("./app/utils/seed");
const PORT = config_1.default.port;
const main = async () => {
    try {
        await prisma_1.prisma.$connect();
        console.log('🗃️  Database connected successfully!!!');
        await redis_1.redisClient.connect();
        await nodemailer_1.transporter.verify();
        console.log('⭐ Nodemailer Connected Successfully.');
        await (0, seed_1.seedAdmin)();
        await (0, seed_1.seedOperator)();
        await (0, seed_1.seedTechnician)();
        (0, cron_1.initializeCronJobs)();
        app_1.default.listen(PORT, () => {
            console.log(`🚀 Server is running on port: ${PORT}`);
        });
    }
    catch (error) {
        console.error('❌ Error starting the server:', error);
        await redis_1.redisClient.quit().catch(() => { });
        await prisma_1.prisma.$disconnect().catch(() => { });
        process.exit(1);
    }
};
main();
