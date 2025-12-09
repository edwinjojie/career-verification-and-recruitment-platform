class ApiError extends Error {
    constructor(message, statusCode, details = null) {
        super(message);
        this.statusCode = statusCode;
        this.details = details;
        this.timestamp = new Date().toISOString();
        Error.captureStackTrace(this, this.constructor);
    }

    static badRequest(message = 'Bad Request', details = null) {
        return new ApiError(message, 400, details);
    }

    static unauthorized(message = 'Unauthorized') {
        return new ApiError(message, 401);
    }

    static forbidden(message = 'Forbidden') {
        return new ApiError(message, 403);
    }

    static notFound(message = 'Not Found') {
        return new ApiError(message, 404);
    }

    static internal(message = 'Internal Server Error') {
        return new ApiError(message, 500);
    }

    static upstream(message = 'Upstream Service Error') {
        return new ApiError(message, 502);
    }
}

module.exports = ApiError;
