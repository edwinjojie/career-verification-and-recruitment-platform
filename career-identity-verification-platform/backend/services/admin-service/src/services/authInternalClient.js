/**
 * Auth Internal Client Design Spec (Updated)
 * ==========================================
 * 
 * Purpose: This client manages reliable communication with the Auth Service's internal API.
 * It handles request construction, headers, error mapping, retry logic, and circuit breaking.
 * 
 * Configuration
 * -------------
 * - Base URL: process.env.AUTH_SERVICE_BASE_URL
 * - Secret: process.env.INTERNAL_SERVICE_SECRET (Header: x-internal-secret)
 * - Timeout: 5000ms (5 seconds)
 * 
 * Resiliency Strategy
 * -------------------
 * 
 * 1. Retry Policy (Network & 5xx Errors)
 *    - Strategy: Exponential Backoff
 *    - Base Delay: 300ms
 *    - Multiplier: 2.0
 *    - Max Attempts: 3
 *    - Conditions: Connection Refused, Timeout, HTTP 500, 502, 503, 504.
 *    - Library: `axios-retry` or custom interceptor.
 * 
 * 2. Circuit Breaker (Protecting the Admin Service)
 *    - Threshold: 5 consecutive failures (failures = timeouts or 5xx).
 *    - State: OPEN
 *    - Reset Timeout: 60 seconds.
 *    - Behavior when OPEN: Immediately return 503 "Service Unavailable - Circuit Open" without calling Auth Service.
 *    - Library: `opossum` or `brakes`.
 * 
 * 3. Fallbacks (Degraded Mode)
 *    - Non-critical reads (e.g., listUsers) could return empty list or cached data (if caching implemented).
 *    - Critical writes (createRecruiter) must fail fast.
 * 
 * Functions & Contracts
 * ---------------------
 * 
 * 1. createUserInternal(payload)
 *    - Method: POST /internal/register
 * 
 * 2. updateUserRoleInternal(userId, role)
 *    - Method: PATCH /internal/update-role
 * 
 * 3. banUserInternal(userId, reason)
 *    - Method: PATCH /internal/ban-user
 * 
 * 4. listUsersInternal(query)
 *    - Method: GET /internal/users
 * 
 * 5. getUserInternal(userId)
 *    - Method: GET /internal/users/:id
 * 
 * Error Mapping
 * -------------
 * - 400: Validation Error
 * - 401/403: Security Config Error (Critical)
 * - 404: NotFound
 * - 409: Conflict
 * - 5xx/Timeout: Retry -> Circuit Breaker -> UpstreamServiceError
 */
