import { createClient } from 'redis';
import config from '../config';

export const redisClient = createClient({
    username: config.redis_user,
    password: config.redis_password,

    socket: {
        host: config.redis_host,
        port: Number(config.redis_port),

        reconnectStrategy: (retries) => {
            console.log(`🔄 Redis reconnecting... Attempt: ${retries}`);

            // Retry for maximum 10 seconds
            return Math.min(retries * 500, 10000);
        },
    },
});

// Redis error handler
redisClient.on('error', (error) => {
    console.error('❌ Redis Client Error:', error);
});

// Redis connecting
redisClient.on('connect', () => {
    console.log('🔌 Redis Connecting...');
});

// Redis ready
redisClient.on('ready', () => {
    console.log('🔥 Redis Connected Successfully!!');
});

// Redis reconnecting
redisClient.on('reconnecting', () => {
    console.log('🔄 Redis Reconnecting...');
});

// Redis connection ended
redisClient.on('end', () => {
    console.log('🔴 Redis Connection Closed!');
});
