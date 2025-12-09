/**
 * Purpose: Middleware to verify JWT Access Tokens.
 * Decodes the token using the RS256 Public Key and attaches user info to req.user.
 *
 * Inputs: Authorization header (Bearer token).
 * Outputs: calls next() if valid, or returns 401/403.
 * Acceptance Criteria: Successfully invalidates bad tokens and passes valid ones with decoded payload.
 */

// Implementation will go here
