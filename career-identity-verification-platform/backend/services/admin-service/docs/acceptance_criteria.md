# Acceptance Criteria & QA Plan

**Owner**: Product Owner / QA Lead
**Service**: Admin Service

## Functional Acceptance Criteria
The service is accepted if the following user stories verify successfully:

### 1. User Provisioning
- [ ] **Admin can create a Recruiter**: Input `email`, `name` -> Result: User created in Auth Service, `role=recruiter`, `AdminAction` log created.
- [ ] **Admin can create an Admin**: Input `email` -> Result: `role=admin`.
- [ ] **Conflict Handling**: Trying to create an existing email returns user-friendly error (409).

### 2. User Governance
- [ ] **Admin can Ban User**: PATCH `/users/:id/ban` -> Auth Service updates, user login rejected subsequently.
- [ ] **Admin can Unban User**: PATCH `/users/:id/unban` -> Access restored.
- [ ] **Role Updates**: Admin can promote `candidate` to `recruiter`.

### 3. Read Operations
- [ ] **List Users**: Returns paginated list. Filter by `role` works.
- [ ] **Get User**: Returns correct profile profile.

## Security Acceptance Criteria
- [ ] **Non-Admin Rejection**: Token from a `candidate` or `recruiter` returns 403 Forbidden on ALL endpoints.
- [ ] **Invalid Token**: Returns 401 Unauthorized.
- [ ] **Audit Trail**: Every write operation produces a MongoDB document in `AdminActions`.

## Performance Constraints
- [ ] **Latency**: 95th percentile < 500ms for user creation.
- [ ] **Throughput**: Handles 50 RPS (burst) locally without crashing.

## QA Checklist (Manual via Postman)
1.  **Setup**:
    *   Login as Super Admin (via Auth Service) -> Get Token.
    *   Login as Candidate -> Get Token.
2.  **Test 1 (Happy Path)**:
    *   Call `POST /admin/recruiters` with Admin Token.
    *   Verify 201 Created.
    *   Verify Audit Log matches.
3.  **Test 2 (Security)**:
    *   Call `POST /admin/recruiters` with Candidate Token.
    *   Verify 403 Forbidden.
4.  **Test 3 (Validation)**:
    *   Call `POST /admin/recruiters` with invalid email.
    *   Verify 400 Bad Request.
