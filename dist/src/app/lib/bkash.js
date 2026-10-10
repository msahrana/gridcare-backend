"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getBKashIdToken = void 0;
const http_status_1 = __importDefault(require("http-status"));
const config_1 = __importDefault(require("../config"));
const AppError_1 = require("../errors/AppError");
const redis_1 = require("./redis");
const ID_TOKEN_KEY = 'bkash:idToken';
const REFRESH_TOKEN_KEY = 'bkash:refreshToken';
const ID_TOKEN_TTL = 60 * 60;
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 28;
// Refresh 10 minutes before expiry
const TOKEN_BUFFER = 60 * 10;
// ======================================================
// Parse Response
// ======================================================
const parseResponse = async (response) => {
    const text = await response.text();
    if (!text) {
        return {};
    }
    try {
        return JSON.parse(text);
    }
    catch {
        return {};
    }
};
// ======================================================
// Error Message
// ======================================================
const getErrorMessage = (result, fallback) => {
    return result.statusMessage || result.errorMessage || fallback;
};
// ======================================================
// Token TTL
// ======================================================
const getTokenTTL = (expiresIn) => {
    if (typeof expiresIn !== 'number' ||
        !Number.isFinite(expiresIn) ||
        expiresIn <= 0) {
        return ID_TOKEN_TTL;
    }
    return Math.max(expiresIn - 60, 60);
};
// ======================================================
// Save Tokens
// ======================================================
const saveTokens = async (idToken, refreshToken, expiresIn) => {
    await redis_1.redisClient.set(ID_TOKEN_KEY, idToken, {
        expiration: {
            type: 'EX',
            value: getTokenTTL(expiresIn),
        },
    });
    if (refreshToken) {
        await redis_1.redisClient.set(REFRESH_TOKEN_KEY, refreshToken, {
            expiration: {
                type: 'EX',
                value: REFRESH_TOKEN_TTL,
            },
        });
    }
};
// ======================================================
// Grant New Token
// ======================================================
const grantNewToken = async () => {
    try {
        const response = await fetch(`${config_1.default.bkash_base_url}/tokenized/checkout/token/grant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                username: config_1.default.bkash_username,
                password: config_1.default.bkash_password,
            },
            body: JSON.stringify({
                app_key: config_1.default.bkash_app_key,
                app_secret: config_1.default.bkash_app_secret,
            }),
        });
        const result = await parseResponse(response);
        console.log('BKASH GRANT TOKEN STATUS:', response.status);
        if (!response.ok || !result.id_token) {
            throw new AppError_1.AppError(http_status_1.default.BAD_GATEWAY, getErrorMessage(result, 'bKash token grant failed'));
        }
        if (!result.refresh_token) {
            throw new AppError_1.AppError(http_status_1.default.BAD_GATEWAY, 'bKash refresh token was not returned');
        }
        await saveTokens(result.id_token, result.refresh_token, result.expires_in);
        return result.id_token;
    }
    catch (error) {
        console.error('BKASH GRANT TOKEN ERROR:', error instanceof Error ? error.message : error);
        if (error instanceof AppError_1.AppError) {
            throw error;
        }
        throw new AppError_1.AppError(http_status_1.default.BAD_GATEWAY, 'Failed to grant bKash token');
    }
};
// ======================================================
// Refresh Token
// ======================================================
const refreshBKashToken = async (refreshToken) => {
    try {
        const response = await fetch(`${config_1.default.bkash_base_url}/tokenized/checkout/token/refresh`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                username: config_1.default.bkash_username,
                password: config_1.default.bkash_password,
            },
            body: JSON.stringify({
                app_key: config_1.default.bkash_app_key,
                app_secret: config_1.default.bkash_app_secret,
                refresh_token: refreshToken,
            }),
        });
        const result = await parseResponse(response);
        console.log('BKASH REFRESH TOKEN STATUS:', response.status);
        if (!response.ok || !result.id_token) {
            console.warn('bKash refresh failed. Trying new token grant.', getErrorMessage(result, 'bKash refresh token failed'));
            return null;
        }
        await saveTokens(result.id_token, result.refresh_token, result.expires_in);
        return result.id_token;
    }
    catch (error) {
        console.warn('BKASH REFRESH TOKEN ERROR:', error instanceof Error ? error.message : error);
        return null;
    }
};
// ======================================================
// Get Valid bKash ID Token
// ======================================================
const getBKashIdToken = async () => {
    try {
        // --------------------------------------------------
        // 1. Get tokens from Redis
        // --------------------------------------------------
        const idToken = await redis_1.redisClient.get(ID_TOKEN_KEY);
        const refreshToken = await redis_1.redisClient.get(REFRESH_TOKEN_KEY);
        const idTokenTTL = await redis_1.redisClient.ttl(ID_TOKEN_KEY);
        const refreshTokenTTL = await redis_1.redisClient.ttl(REFRESH_TOKEN_KEY);
        // --------------------------------------------------
        // 2. Existing ID token is valid
        // --------------------------------------------------
        if (idToken && idTokenTTL > TOKEN_BUFFER) {
            return idToken;
        }
        // --------------------------------------------------
        // 3. Try refresh token
        // --------------------------------------------------
        if (refreshToken && refreshTokenTTL > TOKEN_BUFFER) {
            const newToken = await refreshBKashToken(refreshToken);
            if (newToken) {
                return newToken;
            }
        }
        // --------------------------------------------------
        // 4. Grant completely new token
        // --------------------------------------------------
        return await grantNewToken();
    }
    catch (error) {
        console.error('BKASH TOKEN ERROR:', error instanceof Error ? error.message : error);
        if (error instanceof AppError_1.AppError) {
            throw error;
        }
        throw new AppError_1.AppError(http_status_1.default.INTERNAL_SERVER_ERROR, 'Failed to obtain bKash ID token');
    }
};
exports.getBKashIdToken = getBKashIdToken;
