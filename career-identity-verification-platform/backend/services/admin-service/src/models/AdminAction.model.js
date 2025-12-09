/**
 * Admin Action Audit Model Design Spec
 * ====================================
 * 
 * Purpose: Provide immutable, traceable logs for all administrative actions.
 * 
 * Schema Definition (Mongoose)
 * ----------------------------
 * 
 * Fields:
 * - _id: ObjectId (Auto)
 * - action: String (Required, Enum recommended)
 *   - Values: 'CREATE_USER', 'UPDATE_ROLE', 'BAN_USER', 'UNBAN_USER', 'VIEW_SENSITIVE_DATA'
 * - performedBy: ObjectId (Ref: User, Required)
 *   - The ID of the admin who performed the action.
 * - targetUserId: ObjectId (Ref: User, Optional)
 *   - The ID of the user being affected (e.g., the user being banned).
 * - payload: Object (Optional)
 *   - Snapshot of the input data (e.g., { reason: 'violation', role: 'admin' }).
 *   - SENSITIVE DATA WARNING: Do not store passwords or full PII if possible.
 * - result: Object (Optional)
 *   - Snapshot of the outcome (e.g., { success: true, newStatus: 'banned' }).
 * - ip: String
 *   - Client IP address.
 * - userAgent: String
 *   - Client User Agent.
 * - correlationId: String (Optional)
 *   - For tracing requests across microservices.
 * - createdAt: Date (Default: Date.now)
 * 
 * Indexes
 * -------
 * 1. Compound Index: { performedBy: 1, createdAt: -1 }
 *    - Optimized for "Show me what Admin X did recently".
 * 2. Compound Index: { targetUserId: 1, createdAt: -1 }
 *    - Optimized for "Show me audit history for User Y".
 * 3. Single Index: { createdAt: -1 }
 *    - Global timeline view.
 * 
 * Retention Policy (Future)
 * -------------------------
 * - Consider TTL index on `createdAt` if logs should auto-expire (e.g., after 1 year).
 * - Current: Permanent retention.
 */
