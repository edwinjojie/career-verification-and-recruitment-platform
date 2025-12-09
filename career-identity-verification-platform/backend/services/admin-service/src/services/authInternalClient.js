/**
 * Auth Internal Client Design Spec
 * =================================
 * 
 * Purpose: This client manages reliable communication with the Auth Service's internal API.
 * It handles request construction, headers, error mapping, and retry logic.
 * 
 * Configuration
 * -------------
 * - Base URL: process.env.AUTH_SERVICE_BASE_URL
 * - Secret: process.env.INTERNAL_SERVICE_SECRET (Header: x-internal-secret)
 * - Timeout: 5000ms (5 seconds)
 * 
 * Retry Logic
 * -----------
 * - Strategy: Exponential Backoff (e.g., 500ms, 1000ms, 2000ms)
 * - Max Attempts: 3
 * - Conditions:
 *   - Network errors (ECONNRESET, ETIMEDOUT)
 *   - status >= 500 (Internal Server Error)
 * 
 * Functions & Contracts
 * ---------------------
 * 
 * 1. createUserInternal(payload)
 *    - Purpose: Create privileged users (recruiter, admin, executive)
 *    - Method: POST /internal/register
 *    - Request Payload:
 *      {
 *        name: string,
 *        email: string,
 *        password: string,
 *        role: 'recruiter' | 'admin' | 'executive',
 *        isEmailVerified: boolean (true),
 *        status: 'active',
 *        tenantId: string (optional)
 *      }
 *    - Success Response (200/201):
 *      {
 *        success: true,
 *        data: { userId: string, ...userFields }
 *      }
 * 
 * 2. updateUserRoleInternal(userId, role)
 *    - Purpose: Change a user's role
 *    - Method: PATCH /internal/update-role
 *    - Request Payload: { userId: string, role: string }
 *    - Success Response (200): { success: true, message: 'Role updated' }
 * 
 * 3. banUserInternal(userId, reason)
 *    - Purpose: Ban a user
 *    - Method: PATCH /internal/ban-user
 *    - Request Payload: { userId: string, reason: string }
 *    - Success Response (200): { success: true, message: 'User banned' }
 * 
 * 4. listUsersInternal(query)
 *    - Purpose: Fetch paginated users
 *    - Method: GET /internal/users
 *    - Query Params: page, limit, role, status, search
 *    - Success Response (200):
 *      {
 *        success: true,
 *        count: number,
 *        pagination: { ... },
 *        data: [ ...users ]
 *      }
 * 
 * 5. getUserInternal(userId)
 *    - Purpose: Get single user details
 *    - Method: GET /internal/users/:id
 *    - Success Response (200): { success: true, data: { ...user } }
 * 
 * Error Mapping
 * -------------
 * - 400 Bad Request: Throw Validation Error
 * - 401 Unauthorized: Throw Auth Error (Invalid Secret) - Log Critical Alert
 * - 403 Forbidden: Throw Auth Error (Role mismatch)
 * - 404 Not Found: Throw NotFound Error
 * - 409 Conflict: Throw Conflict Error (e.g., "Email already exists")
 * - 5xx Server Error: Trigger Retry Logic -> Throw UpstreamServiceError if exhausted
 */
