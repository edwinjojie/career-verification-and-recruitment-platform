const axios = require('axios');
const env = require('../config/env');
const logger = require('../utils/logger');
const ApiError = require('../errors/ApiError');

// --- Circuit Breaker State ---
let failureCount = 0;
let lastFailureTime = 0;
const FAILURE_THRESHOLD = 5;
const RESET_TIMEOUT_MS = 30000;
let isOpen = false;

const checkCircuit = () => {
    if (isOpen) {
        if (Date.now() - lastFailureTime > RESET_TIMEOUT_MS) {
            // Half-open: Allow retry
            logger.warn('Circuit Breaker: Half-Open (Resetting test)', {});
            return;
        }
        throw ApiError.upstream('Service Unavailable: Circuit Breaker Open', { service: 'AUTH_SERVICE' });
    }
};

const recordFailure = () => {
    failureCount++;
    lastFailureTime = Date.now();
    if (failureCount >= FAILURE_THRESHOLD) {
        isOpen = true;
        logger.error('Circuit Breaker: OPENED due to failures', { failureCount });
    }
};

const recordSuccess = () => {
    if (isOpen) {
        isOpen = false;
        failureCount = 0;
        logger.info('Circuit Breaker: CLOSED (Recovered)', {});
    } else if (failureCount > 0) {
        failureCount = 0;
    }
};

// --- Client Instance ---
const client = axios.create({
    baseURL: env.AUTH_SERVICE_BASE_URL,
    timeout: env.AUTH_INTERNAL_TIMEOUT_MS,
    headers: {
        'Content-Type': 'application/json',
        'x-internal-secret': env.INTERNAL_SERVICE_SECRET
    },
    validateStatus: () => true // Handle status codes manually
});

// Logging Interceptors
client.interceptors.request.use(req => {
    logger.debug(`[AuthClient] Request: ${req.method.toUpperCase()} ${req.url}`, {
        correlationId: req.headers['x-request-id']
    });
    return req;
});

client.interceptors.response.use(res => {
    logger.debug(`[AuthClient] Response: ${res.status}`, {
        correlationId: res.config.headers['x-request-id']
    });
    return res;
});

// --- Retry Logic ---
const withRetry = async (fn, options = {}) => {
    const maxRetries = 3;
    let attempt = 0;

    while (attempt <= maxRetries) {
        try {
            checkCircuit();
            const response = await fn();

            // Check for Upstream Errors (5xx)
            if (response.status >= 500) {
                throw new Error(`Upstream 5xx: ${response.status}`);
            }

            recordSuccess();
            return response;

        } catch (error) {
            recordFailure();
            attempt++;

            const isRetryable =
                error.code === 'ECONNREFUSED' ||
                error.code === 'ETIMEDOUT' ||
                error.code === 'ENOTFOUND' ||
                error.message.includes('Upstream 5xx');

            if (attempt > maxRetries || !isRetryable) {
                // Final Failure logic
                logger.error(`[AuthClient] Final Failure: ${error.message}`, {});
                if (error instanceof ApiError) throw error; // Re-throw circuit errors
                throw ApiError.upstream('Auth Service Unreachable', { cause: error.message });
            }

            // Exponential Backoff
            const delay = Math.pow(2, attempt) * 100; // 200, 400, 800ms
            logger.warn(`[AuthClient] Retry attempt ${attempt} in ${delay}ms`, { error: error.message });
            await new Promise(r => setTimeout(r, delay));
        }
    }
};

// --- Public Methods ---

const createRecruiterInternal = async (payload, requestId) => {
    return withRetry(() => client.post('/internal/register', {
        ...payload, role: 'recruiter', isEmailVerified: true
    }, { headers: { 'x-request-id': requestId } }));
};

const createAdminInternal = async (payload, requestId) => {
    return withRetry(() => client.post('/internal/register', {
        ...payload, role: 'admin', isEmailVerified: true
    }, { headers: { 'x-request-id': requestId } }));
};

const fetchAllUsers = async (requestId) => {
    return withRetry(() => client.get('/internal/users', {
        headers: { 'x-request-id': requestId }
    }));
};

const updateUserRole = async (id, newRole, requestId) => {
    return withRetry(() => client.patch(`/internal/users/${id}/role`, { role: newRole }, {
        headers: { 'x-request-id': requestId }
    }));
};

const banUser = async (id, reason, duration, requestId) => {
    return withRetry(() => client.patch(`/internal/users/${id}/ban`, { reason, duration }, {
        headers: { 'x-request-id': requestId }
    }));
};

const healthCheck = async () => {
    try {
        await client.head('/health'); // Assuming Auth service has /health
        return true;
    } catch (e) {
        return false;
    }
};


module.exports = {
    createRecruiterInternal,
    createAdminInternal,
    fetchAllUsers,
    updateUserRole,
    banUser,
    healthCheck
};
