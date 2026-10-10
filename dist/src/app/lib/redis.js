"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const redis_1 = require("redis");
const config_1 = __importDefault(require("../config"));
exports.redisClient = (0, redis_1.createClient)({
    username: config_1.default.redis_user,
    password: config_1.default.redis_password,
    socket: {
        host: config_1.default.redis_host,
        port: Number(config_1.default.redis_port),
        reconnectStrategy: (retries) => {
            console.log(`🔄 Redis reconnecting... Attempt: ${retries}`);
            // Retry for maximum 10 seconds
            return Math.min(retries * 500, 10000);
        },
    },
});
// Redis error handler
exports.redisClient.on('error', (error) => {
    console.error('❌ Redis Client Error:', error);
});
// Redis connecting
exports.redisClient.on('connect', () => {
    console.log('🟥 Redis Connecting...');
});
// Redis ready
exports.redisClient.on('ready', () => {
    console.log('🔥 Redis Connected Successfully!!');
});
// Redis reconnecting
exports.redisClient.on('reconnecting', () => {
    console.log('🔄 Redis Reconnecting...');
});
// Redis connection ended
exports.redisClient.on('end', () => {
    console.log('🔴 Redis Connection Closed!');
});
