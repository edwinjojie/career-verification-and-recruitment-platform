/**
 * Require Admin Middleware Design Spec
 * ====================================
 * 
 * Purpose: Authorization guard to ensure only admins can access protected routes.
 * 
 * Dependencies
 * ------------
 * - Must strictly follow `verifyJwt` middleware.
 * - Assumes `req.user` is populated.
 * 
 * Behavior
 * --------
 * 1. Check existence:
 *    - If `req.user` is missing -> Return 401 (Internal Logic Error / Auth Missing).
 * 
 * 2. Role Check:
 *    - If `req.user.role` !== 'admin' -> Return 403 Forbidden.
 * 
 * 3. Security Logging:
 *    - If check fails (403), Log detailed security alert:
 *      {
 *        event: 'UNAUTHORIZED_ACCESS_ATTEMPT',
 *        userId: req.user.userId,
 *        role: req.user.role,
 *        ip: req.ip,
 *        userAgent: req.headers['user-agent'],
 *        path: req.originalUrl
 *      }
 * 
 * 4. Success:
 *    - If role === 'admin' -> Call `next()`.
 * 
 * Unit Test Scenarios
 * -------------------
 * - req.user missing -> 401 or 500
 * - req.user.role = 'candidate' -> 403
 * - req.user.role = 'recruiter' -> 403
 * - req.user.role = 'admin' -> Allow
 */
