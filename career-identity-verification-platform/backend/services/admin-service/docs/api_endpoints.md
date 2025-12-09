# Admin Service API Endpoints

**Base URL**: `/api/v1/admin`
**Authentication**: Required for all endpoints (Bearer Token - JWT). User role must be `admin`.

## Endpoints

### 1. Create Recruiter
*   **Method**: `POST`
*   **Path**: `/recruiters`
*   **Description**: Creates a new user with the `recruiter` role.
*   **Auth**: Admin JWT
*   **Body**:
    *   `name` (string, required)
    *   `email` (string, required, valid email)
    *   `password` (string, required, strong password)
    *   `companyId` (string, optional)
*   **Expected Status Codes**:
    *   `201 Created`: User successfully created.
    *   `400 Bad Request`: Invalid input or email already exists.
    *   `401 Unauthorized`: Missing or invalid token.
    *   `403 Forbidden`: User is not an admin.
*   **Internal Service Call**: Calls Auth Service `POST /internal/register`.

### 2. Create Admin
*   **Method**: `POST`
*   **Path**: `/users/admins`
*   **Description**: Creates a new user with the `admin` role.
*   **Auth**: Admin JWT
*   **Body**:
    *   `name` (string, required)
    *   `email` (string, required)
    *   `password` (string, required)
*   **Expected Status Codes**: `201`, `400`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `POST /internal/register`.

### 3. Create Executive
*   **Method**: `POST`
*   **Path**: `/users/executives`
*   **Description**: Creates a new user with the `executive` role.
*   **Auth**: Admin JWT
*   **Body**:
    *   `name` (string, required)
    *   `email` (string, required)
    *   `password` (string, required)
*   **Expected Status Codes**: `201`, `400`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `POST /internal/register`.

### 4. Get All Users
*   **Method**: `GET`
*   **Path**: `/users`
*   **Description**: Retrieves a paginated list of users.
*   **Auth**: Admin JWT
*   **Query Parameters**:
    *   `role` (optional): Filter by role (e.g., candidate, recruiter).
    *   `status` (optional): Filter by status (active, banned, pending).
    *   `page` (optional, default 1): Page number.
    *   `limit` (optional, default 10): Items per page.
    *   `search` (optional): Search by name or email.
*   **Expected Status Codes**: `200`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `GET /internal/users`.

### 5. Get User Details
*   **Method**: `GET`
*   **Path**: `/users/:id`
*   **Description**: Retrieves details for a specific user by ID.
*   **Auth**: Admin JWT
*   **Expected Status Codes**: `200`, `404`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `GET /internal/users/:id`.

### 6. Change User Role
*   **Method**: `PATCH`
*   **Path**: `/users/:id/role`
*   **Description**: Updates the role of a user.
*   **Auth**: Admin JWT
*   **Body**:
    *   `role` (string, required): New role (e.g., admin, recruiter).
*   **Expected Status Codes**: `200`, `400`, `404`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `PATCH /internal/update-role`.

### 7. Ban User
*   **Method**: `PATCH`
*   **Path**: `/users/:id/ban`
*   **Description**: Bans a user, preventing them from logging in.
*   **Auth**: Admin JWT
*   **Body**:
    *   `reason` (string, optional): Reason for banning.
*   **Expected Status Codes**: `200`, `400`, `404`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `PATCH /internal/ban-user`.

### 8. Unban User
*   **Method**: `PATCH`
*   **Path**: `/users/:id/unban`
*   **Description**: Unbans a user, restoring their access.
*   **Auth**: Admin JWT
*   **Expected Status Codes**: `200`, `400`, `404`, `401`, `403`
*   **Internal Service Call**: Calls Auth Service `PATCH /internal/unban-user` (or toggles ban status via ban endpoint).

### 9. Get Audit Logs
*   **Method**: `GET`
*   **Path**: `/audit-logs`
*   **Description**: Retrieves paginated audit logs of admin actions.
*   **Auth**: Admin JWT
*   **Query Parameters**:
    *   `page` (optional, default 1)
    *   `limit` (optional, default 20)
*   **Expected Status Codes**: `200`, `401`, `403`
*   **Internal Service Call**: None. Reads from Admin Service MongoDB (`AdminAction` collection).
