"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeCronJobs = void 0;
const node_cron_1 = __importDefault(require("node-cron"));
const prisma_1 = require("./prisma");
const enums_1 = require("../../generated/prisma/enums");
/**
 * =========================================================
 * DELETE UNVERIFIED TECHNICIANS
 * =========================================================
 *
 * Runs every hour.
 *
 * Deletes technicians who:
 * - have TECHNICIAN role
 * - have not verified their email
 * - were created more than 1 hour ago
 * - are still PENDING
 */
const deleteUnverifiedTechnicians = async () => {
    try {
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        const result = await prisma_1.prisma.user.deleteMany({
            where: {
                role: enums_1.UserRole.TECHNICIAN,
                emailVerified: false,
                createdAt: {
                    lt: oneHourAgo,
                },
                technician: {
                    verificationStatus: enums_1.TechnicianVerificationStatus.PENDING,
                },
            },
        });
        if (result.count > 0) {
            console.log(`🗑️ Cron: Deleted ${result.count} unverified technician application(s) older than 1 hour.`);
        }
        else {
            console.log('✅ Cron: No expired unverified technician applications found.');
        }
    }
    catch (error) {
        console.error('❌ Cron: Failed to delete unverified technician applications.', error);
    }
};
/**
 * =========================================================
 * DELETE REJECTED TECHNICIANS
 * =========================================================
 *
 * Runs once every day at 2:00 AM.
 *
 * Deletes technicians who:
 * - have TECHNICIAN role
 * - are REJECTED
 * - were created more than 30 days ago
 *
 * NOTE:
 * We intentionally do NOT check emailVerified here.
 *
 * A technician can verify their email first and
 * still be rejected by an admin later.
 */
const deleteRejectedTechnicians = async () => {
    try {
        const oneMonthAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const result = await prisma_1.prisma.user.deleteMany({
            where: {
                role: enums_1.UserRole.TECHNICIAN,
                createdAt: {
                    lt: oneMonthAgo,
                },
                technician: {
                    verificationStatus: enums_1.TechnicianVerificationStatus.REJECTED,
                },
            },
        });
        if (result.count > 0) {
            console.log(`🗑️ Cron: Deleted ${result.count} rejected technician application(s) older than 30 days.`);
        }
        else {
            console.log('✅ Cron: No expired rejected technician applications found.');
        }
    }
    catch (error) {
        console.error('❌ Cron: Failed to delete rejected technician applications.', error);
    }
};
/**
 * =========================================================
 * INITIALIZE ALL CRON JOBS
 * =========================================================
 *
 * IMPORTANT:
 * Call this function only once when the server starts.
 */
const initializeCronJobs = () => {
    /**
     * =======================================================
     * UNVERIFIED TECHNICIAN CLEANUP
     * =======================================================
     *
     * Cron expression:
     *
     * 0 * * * *
     *
     * Meaning:
     * Every hour at minute 0.
     *
     * Example:
     * 01:00
     * 02:00
     * 03:00
     * 04:00
     */
    node_cron_1.default.schedule('0 * * * *', async () => {
        console.log('⏰ Running unverified technician cleanup...');
        await deleteUnverifiedTechnicians();
    });
    /**
     * =======================================================
     * REJECTED TECHNICIAN CLEANUP
     * =======================================================
     *
     * Cron expression:
     *
     * 0 2 * * *
     *
     * Meaning:
     * Every day at 2:00 AM.
     */
    node_cron_1.default.schedule('0 2 * * *', async () => {
        console.log('⏰ Running rejected technician cleanup...');
        await deleteRejectedTechnicians();
    });
    console.log('⏰ Cron jobs initialized successfully.');
};
exports.initializeCronJobs = initializeCronJobs;
