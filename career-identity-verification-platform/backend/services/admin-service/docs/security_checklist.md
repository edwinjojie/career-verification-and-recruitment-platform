# Security Review Checklist

This document serves as a verification checklist for the Admin Service security posture.

## Authentication & Authorization
- [ ] **RS256 Verification**: Verify that `verifyJwt` middleware actively checks the token signature against the correct Public Key (`jwt_public.pem`).
- [ ] **Role Enforcement**: Ensure `requireAdmin` middleware is applied to ALL routes under `/api/v1/admin`.
- [ ] **Internal Secrets**: Verify `INTERNAL_SERVICE_SECRET` is complex, stored in env vars, and never logged.
- [ ] **Token Expiry**: Assert that expired tokens are strictly rejected (401).

## Input Validation & Sanitization
- [ ] **Strict Typing**: All controller inputs (body, query, params) must be validated (Joi/Zod) before processing.
- [ ] **No Injection**: Sanitize inputs to prevent NoSQL injection (e.g., blocking `$` operators in queries).
- [ ] **Email Validation**: Enforce strict email format for user creation.

## Logging & Auditing
- [ ] **PII Redaction**: Ensure passwords, secrets, and raw tokens are redacted from all logs.
- [ ] **Audit Trails**: Confirm `AdminAction` records are created for EVERY modification (Create, Update, Ban).
- [ ] **Immutability**: Ensure Audit logs are append-only (no update/delete APIs exposed for them).

## Network & Transport
- [ ] **HTTPS**: Enforce HTTPS at the API Gateway level (Admin Service assumes secure tunnel or local network).
- [ ] **HSTS**: Enable Strict-Transport-Security headers via Helmet.
- [ ] **CORS**: Restrict CORS to specific admin dashboard domains only.

## Operational Security
- [ ] **Rate Limiting**: Apply rate limits to `/login` (in Auth Service) and Admin endpoints to prevent brute force or DoS.
- [ ] **Dependency Scan**: Run `npm audit` regularly to catch vulnerable packages.
- [ ] **Error Leaks**: Ensure production mode suppresses stack traces in API responses.
