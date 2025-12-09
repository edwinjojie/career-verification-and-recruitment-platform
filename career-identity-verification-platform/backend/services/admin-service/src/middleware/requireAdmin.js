/**
 * Purpose: Authorization middleware to ensure only Admins can access routes.
 * Checks req.user.role for 'admin' privileges.
 *
 * Inputs: req.user object (populated by verifyJwt).
 * Outputs: calls next() if admin, 403 Forbidden otherwise.
 * Acceptance Criteria: Blocks non-admin users from accessing protected endpoints.
 */

// Implementation will go here
