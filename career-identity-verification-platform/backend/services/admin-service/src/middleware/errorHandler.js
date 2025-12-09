/**
 * Error Handling & Response Design Spec
 * =====================================
 * 
 * Purpose: Ensure consistent JSON responses and centralized error management.
 * 
 * Standard Response Format
 * ------------------------
 * Success:
 * {
 *   "success": true,
 *   "data": { ... },       // The actual resource or result
 *   "message": "..."       // Optional human-readable status
 * }
 * 
 * Error:
 * {
 *   "success": false,
 *   "error": {
 *     "code": "ERROR_CODE", // e.g., 'VALIDATION_ERROR', 'AUTH_FAILED'
 *     "message": "...",     // Human-readable error
 *     "details": [ ... ]    // Optional validation array or context
 *   },
 *   "correlationId": "..."  // For tracking
 * }
 * 
 * Error Mapping Strategy
 * ----------------------
 * The error handler middleware will intercept errors from `next(err)` and map them:
 * 
 * 1. Joi/Zod Validation Errors -> 400 Bad Request
 *    - code: 'VALIDATION_ERROR'
 *    - details: [ { field: 'email', message: 'Invalid format' } ]
 * 
 * 2. 401 Unauthorized -> 401
 *    - code: 'UNAUTHORIZED'
 *    - message: 'Invalid or expired token'
 * 
 * 3. 403 Forbidden -> 403
 *    - code: 'FORBIDDEN'
 *    - message: 'Insufficient permissions'
 * 
 * 4. 404 Not Found -> 404
 *    - code: 'NOT_FOUND'
 *    - message: 'Resource not found'
 * 
 * 5. 409 Conflict -> 409
 *    - code: 'CONFLICT'
 *    - message: 'Resource already exists'
 * 
 * 6. Internal Client Failures (Axios)
 *    - ECONNREFUSED / ECONNABORTED -> 502 Bad Gateway
 *      - code: 'UPSTREAM_UNAVAILABLE'
 *      - message: 'Auth Service is unreachable'
 *    - 5xx from Auth Service -> 502 Bad Gateway
 *      - code: 'UPSTREAM_ERROR'
 * 
 * 7. Unhandled Exceptions -> 500 Internal Server Error
 *    - code: 'INTERNAL_SERVER_ERROR'
 *    - message: 'An unexpected error occurred'
 *    - action: Log stack trace (redacted) to Logger
 * 
 * Correlation ID
 * --------------
 * - Extract `x-correlation-id` from request headers or generate a UUID.
 * - Attach to every log entry and the error response.
 */
