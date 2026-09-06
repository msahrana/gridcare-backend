import httpStatus from 'http-status';

import config from '../config';
import { AppError } from '../errors/AppError';
import { redisClient } from './redis';

const ID_TOKEN_KEY = 'bkash:idToken';
const REFRESH_TOKEN_KEY = 'bkash:refreshToken';

const ID_TOKEN_TTL = 60 * 60;
const REFRESH_TOKEN_TTL = 60 * 60 * 24 * 28;

// Refresh 10 minutes before expiry
const TOKEN_BUFFER = 60 * 10;

interface IBkashTokenResponse {
    id_token?: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    statusCode?: string;
    statusMessage?: string;
    errorCode?: string;
    errorMessage?: string;
}

// ======================================================
// Parse Response
// ======================================================

const parseResponse = async (
    response: Response,
): Promise<IBkashTokenResponse> => {
    const text = await response.text();

    if (!text) {
        return {};
    }

    try {
        return JSON.parse(text) as IBkashTokenResponse;
    } catch {
        return {};
    }
};

// ======================================================
// Error Message
// ======================================================

const getErrorMessage = (
    result: IBkashTokenResponse,
    fallback: string,
): string => {
    return result.statusMessage || result.errorMessage || fallback;
};

// ======================================================
// Token TTL
// ======================================================

const getTokenTTL = (expiresIn?: number): number => {
    if (
        typeof expiresIn !== 'number' ||
        !Number.isFinite(expiresIn) ||
        expiresIn <= 0
    ) {
        return ID_TOKEN_TTL;
    }

    return Math.max(expiresIn - 60, 60);
};

// ======================================================
// Save Tokens
// ======================================================

const saveTokens = async (
    idToken: string,
    refreshToken?: string,
    expiresIn?: number,
): Promise<void> => {
    await redisClient.set(ID_TOKEN_KEY, idToken, {
        expiration: {
            type: 'EX',
            value: getTokenTTL(expiresIn),
        },
    });

    if (refreshToken) {
        await redisClient.set(REFRESH_TOKEN_KEY, refreshToken, {
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

const grantNewToken = async (): Promise<string> => {
    try {
        const response = await fetch(
            `${config.bkash_base_url}/tokenized/checkout/token/grant`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    username: config.bkash_username,
                    password: config.bkash_password,
                },
                body: JSON.stringify({
                    app_key: config.bkash_app_key,
                    app_secret: config.bkash_app_secret,
                }),
            },
        );

        const result = await parseResponse(response);

        console.log('BKASH GRANT TOKEN STATUS:', response.status);

        if (!response.ok || !result.id_token) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                getErrorMessage(result, 'bKash token grant failed'),
            );
        }

        if (!result.refresh_token) {
            throw new AppError(
                httpStatus.BAD_GATEWAY,
                'bKash refresh token was not returned',
            );
        }

        await saveTokens(
            result.id_token,
            result.refresh_token,
            result.expires_in,
        );

        return result.id_token;
    } catch (error: unknown) {
        console.error(
            'BKASH GRANT TOKEN ERROR:',
            error instanceof Error ? error.message : error,
        );

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            httpStatus.BAD_GATEWAY,
            'Failed to grant bKash token',
        );
    }
};

// ======================================================
// Refresh Token
// ======================================================

const refreshBKashToken = async (
    refreshToken: string,
): Promise<string | null> => {
    try {
        const response = await fetch(
            `${config.bkash_base_url}/tokenized/checkout/token/refresh`,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                    username: config.bkash_username,
                    password: config.bkash_password,
                },
                body: JSON.stringify({
                    app_key: config.bkash_app_key,
                    app_secret: config.bkash_app_secret,
                    refresh_token: refreshToken,
                }),
            },
        );

        const result = await parseResponse(response);

        console.log('BKASH REFRESH TOKEN STATUS:', response.status);

        if (!response.ok || !result.id_token) {
            console.warn(
                'bKash refresh failed. Trying new token grant.',
                getErrorMessage(result, 'bKash refresh token failed'),
            );

            return null;
        }

        await saveTokens(
            result.id_token,
            result.refresh_token,
            result.expires_in,
        );

        return result.id_token;
    } catch (error: unknown) {
        console.warn(
            'BKASH REFRESH TOKEN ERROR:',
            error instanceof Error ? error.message : error,
        );

        return null;
    }
};

// ======================================================
// Get Valid bKash ID Token
// ======================================================

export const getBKashIdToken = async (): Promise<string> => {
    try {
        // --------------------------------------------------
        // 1. Get tokens from Redis
        // --------------------------------------------------

        const idToken = await redisClient.get(ID_TOKEN_KEY);

        const refreshToken = await redisClient.get(REFRESH_TOKEN_KEY);

        const idTokenTTL = await redisClient.ttl(ID_TOKEN_KEY);

        const refreshTokenTTL = await redisClient.ttl(REFRESH_TOKEN_KEY);

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
    } catch (error: unknown) {
        console.error(
            'BKASH TOKEN ERROR:',
            error instanceof Error ? error.message : error,
        );

        if (error instanceof AppError) {
            throw error;
        }

        throw new AppError(
            httpStatus.INTERNAL_SERVER_ERROR,
            'Failed to obtain bKash ID token',
        );
    }
};
