# Admin Service Test Plan

This document outlines the testing strategy for the Admin Service.

## 1. Unit Tests

### Controllers (`src/controllers/adminController.test.js`)
*   **Dependencies**: Mock `authInternalClient` and `AdminAction.create`.
*   **Test Cases**:
    *   **createRecruiter**:
        *   Input: Valid name, email, password.
        *   Expectation: Calls `createUserInternal` with correct role, saves `AdminAction`, returns 201.
    *   **createAdmin**:
        *   Input: Valid payload.
        *   Expectation: Calls `createUserInternal` with role='admin', saves `AdminAction`.
    *   **updateRole**:
        *   Input: valid userId, newRole='recruiter'.
        *   Expectation: Calls `updateUserRoleInternal`, saves `AdminAction`.
    *   **Validation Failure**: Empty email -> Returns 400, no internal call.
    *   **Conflict**: Internal client throws 409 -> Controller returns 409.

### Middleware (`src/middleware/*.test.js`)
*   **verifyJwt**:
    *   Input: Valid signed token. Expect: `req.user` populated, `next()` called.
    *   Input: Expired token. Expect: 401.
    *   Input: Bad signature. Expect: 401.
*   **requireAdmin**:
    *   Input: `req.user.role = 'admin'`. Expect: `next()` called.
    *   Input: `req.user.role = 'recruiter'`. Expect: 403.
    *   Input: `req.user` undefined. Expect: 401/500.

## 2. Integration Tests (Smoke)
*   **Simulated Flow**:
    *   Spin up Admin Service + MongoDB (Memory Server).
    *   Mock Auth Service (using Nock or a stub server).
    *   **Scenario**: Admin creates a recruiter.
        1.  POST /admin/recruiters with valid Admin Token.
        2.  System validates input.
        3.  System calls Mock Auth Service (responds 200).
        4.  System writes to MongoDB AdminAction collection.
        5.  System returns 201.
        6.  Verify: AdminAction exists in DB.

## 3. Error Handling & Resiliency Tests
*   **Scenario: Auth Service Down**
    *   Mock Auth Service to return 500 or timeout.
    *   Action: Call createRecruiter.
    *   Expectation: Admin Service returns 502/503 (after internal retry logic).
*   **Scenario: Malformed Inputs**
    *   Send huge payload or injection strings.
    *   Expectation: 400 Bad Request (Joi/Zod caught it).

## Tooling
*   **Runner**: Jest
*   **Mocks**: Jest Mocks, Nock (for HTTP requests)
*   **DB**: mongodb-memory-server
