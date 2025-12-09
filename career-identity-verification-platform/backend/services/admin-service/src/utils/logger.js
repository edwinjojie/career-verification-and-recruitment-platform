/**
 * Logger Utility Design Spec
 * ==========================
 * 
 * Purpose: Provide structured, JSON-formatted logs for observability, debugging, and auditing.
 * 
 * library: winston (recommended)
 * 
 * Configuration
 * -------------
 * - Log Level: process.env.LOG_LEVEL (default: info)
 * - Format: JSON
 * - Transports: Console (for container logs)
 * 
 * Schema (Standard Fields)
 * ------------------------
 * {
 *   "timestamp": "ISO-8601 String",
 *   "level": "info" | "warn" | "error" | "debug",
 *   "service": "admin-service",
 *   "message": "Human readable message",
 *   "correlationId": "UUID" (Critical for distributed tracing),
 *   "userId": "ObjectId" (if authenticated),
 *   "ip": "Client IP",
 *   "route": "/api/v1/admin/...",
 *   "method": "POST",
 *   "durationMs": 123, (for access logs)
 *   "context": { ... } (Optional extra data)
 * }
 * 
 * Redaction Rules (Security)
 * --------------------------
 * The logger must auto-redact specific keys in the `context` object before writing:
 * - password
 * - token
 * - authorization
 * - secret
 * - creditCard
 * 
 * Integration Points
 * ------------------
 * 1. Request/Response Middleware: 
 *    - Log START of request (level: debug).
 *    - Log END of request (level: info) with duration and status code.
 *    - Middleware extracts `x-correlation-id` header. If missing, generate UUID v4.
 *    - Attach `logger` instance to `req` object (e.g., `req.logger`) pre-populated with correlationId.
 * 
 * 2. Auth Internal Client:
 *    - Log outgoing requests (url, method) with correlationId header provided.
 *    - Log failures (level: warn/error).
 * 
 * 3. Error Handler:
 *    - Log full error stack trace (level: error) with correlationId.
 * 
 * 4. Audit:
 *    - While separate from Audit Logic, the logger tracks the *event* of an audit write.
 */
