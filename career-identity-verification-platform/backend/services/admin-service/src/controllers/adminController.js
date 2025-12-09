/**
 * Admin Controller Design Spec
 * ============================
 * 
 * Purpose: Orchestrates admin operations by validating inputs, calling the Auth Service via internal client, 
 * and recording audit logs.
 * 
 * Shared Behavior
 * ---------------
 * - All functions must catch errors and pass them to next(err).
 * - All successful modification actions (create, update, ban) MUST create an AdminAction record.
 * 
 * 1. createRecruiter
 * ------------------
 * - Method: POST
 * - Validation:
 *   - name: required, string
 *   - email: required, valid email
 *   - password: required, min 8 chars
 *   - companyId: optional, string
 * - Logic:
 *   1. Build payload: { ..., role: 'recruiter', isEmailVerified: true, status: 'active' }
 *   2. Call authInternalClient.createUserInternal(payload)
 *   3. If success:
 *      - Create AdminAction: { action: 'CREATE_RECRUITER', performedBy: req.user.userId, targetUserId: result.userId, ... }
 *      - Return 201: { success: true, data: { userId, role, ... } }
 *   4. Error Handling:
 *      - 409 Conflict (from client) -> Return 409 "Email already exists"
 *      - 5xx -> Map to 502/503
 * 
 * 2. createAdmin
 * --------------
 * - Method: POST
 * - Validation: Same as above.
 * - Logic:
 *   1. Build payload: { ..., role: 'admin', isEmailVerified: true, status: 'active' }
 *   2. Call authInternalClient.createUserInternal(payload)
 *   3. If success:
 *      - Create AdminAction: { action: 'CREATE_ADMIN', performedBy: req.user.userId, targetUserId: result.userId }
 *      - Return 201
 * 
 * 3. listUsers
 * ------------
 * - Method: GET
 * - Inputs: req.query (role, status, page, limit, search)
 * - Logic:
 *   1. Call authInternalClient.listUsersInternal(req.query)
 *   2. Return 200: { success: true, count, pagination, data: [...] }
 * - Audit: 'VIEW_USERS' (Optional, or only log if search param is present to track snooping)
 * 
 * 4. getUser
 * ----------
 * - Method: GET
 * - Input: req.params.id
 * - Logic:
 *   1. Call authInternalClient.getUserInternal(id)
 *   2. Return 200: { success: true, data: userProfile }
 * 
 * 5. updateRole
 * -------------
 * - Method: PATCH
 * - Input: req.params.id, req.body.role
 * - Validation: role must be one of ['candidate', 'recruiter', 'executive', 'admin']
 * - Logic:
 *   1. Call authInternalClient.updateUserRoleInternal(id, role)
 *   2. Create AdminAction: { action: 'UPDATE_ROLE', performedBy: req.user.userId, targetUserId: id, payload: { newRole: role } }
 *   3. Return 200: { success: true, message: 'Role updated' }
 * 
 * 6. banUser / unbanUser
 * ----------------------
 * - Method: PATCH
 * - Input: req.params.id, req.body.reason (for ban)
 * - Logic:
 *   1. Call authInternalClient.banUserInternal(id, reason) (switch for unban)
 *   2. Create AdminAction: { action: 'BAN_USER', performedBy: req.user.userId, targetUserId: id, payload: { reason } }
 *   3. Return 200: { success: true, message: 'User banned' }
 */
