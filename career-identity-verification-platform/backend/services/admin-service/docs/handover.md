# Handoff Package: Admin Service

**Service Owner**: Antigravity (AI Agent)
**Date**: 2025-12-09

## 1. Quick Start (Local Dev)
1.  **Prerequisites**: Docker, Node.js 18+.
2.  **Keys**: Ensure `jwt_private.pem` and `jwt_public.pem` exist in `../../secrets/`.
3.  **Run**:
    ```bash
    cd backend/services/admin-service
    docker-compose -f docker-compose.admin.yml up --build
    ```
4.  **Verify**: Visit `http://localhost:3003/health`.

## 2. API Usage
*   **Documentation**: See `docs/api_endpoints.md` for full contract.
*   **Auth**: You need a valid JWT with `role: admin`.
    *   *How to get*: Use Postman to call `POST /auth/login` on Auth Service (port 3002) with admin credentials.
    *   *Header*: `Authorization: Bearer <token>`.

## 3. Directory Map
*   `src/config`: Environment & Secrets.
*   `src/controllers`: Business logic (create users, ban, etc).
*   `src/middleware`: RBAC (`requireAdmin`) and Auth (`verifyJwt`).
*   `src/services`: `authInternalClient` (Upstream calls to Auth Service).
*   `src/models`: `AdminAction` (Audit logs).
*   `docs/`: All design specs, security checklists, and CI guides.

## 4. Key Context
*   **Inter-Service Auth**: Uses `x-internal-secret` header to talk to Auth Service.
*   **Audit**: All write actions are permanently logged to MongoDB `admin-service.adminactions`.

## 5. Contact
*   Maintainer: Engineering Team (Platform)
*   On-Call: DevOps Channel
