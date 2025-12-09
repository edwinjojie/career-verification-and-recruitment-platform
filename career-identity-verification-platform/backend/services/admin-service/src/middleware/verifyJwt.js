/**
 * JWT Verification Middleware Design Spec
 * =======================================
 * 
 * Purpose: Authenticate requests by validating RS256 JWT Access Tokens.
 * 
 * Behavior
 * --------
 * 1. Configuration:
 *    - Load Public Key from file path defined in process.env.JWT_PUBLIC_KEY_PATH.
 *    - Algorithm: RS256
 * 
 * 2. Extraction:
 *    - Parse header `Authorization: Bearer <token>`.
 *    - If missing or malformed -> Return 401 Unauthorized.
 * 
 * 3. Validation:
 *    - Use jsonwebtoken.verify(token, publicKey).
 *    - Check expiration (exp).
 *    - Check issuer/audience if configured.
 * 
 * 4. Success:
 *    - Attach decoded payload to `req.user`.
 *    - Payload Object structure:
 *      {
 *        userId: string (sub),
 *        email: string,
 *        role: string,
 *        tenantId: string (optional),
 *        iat: number,
 *        exp: number
 *      }
 *    - Call `next()`.
 * 
 * 5. Failure:
 *    - TokenExpired -> 401 "Token expired"
 *    - JsonWebTokenError -> 401 "Invalid token"
 * 
 * Unit Test Scenarios
 * -------------------
 * - No header -> 401
 * - Invalid header format -> 401
 * - Expired token -> 401
 * - Wrong signature (different private key) -> 401
 * - Valid token -> req.user is populated, next() called.
 */
