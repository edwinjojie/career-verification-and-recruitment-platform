const ApiError = require('../errors/ApiError');
const authInternalClient = require('./authInternalClient');
const AdminAction = require('../models/AdminAction.model');
const RecruiterApproval = require('../models/RecruiterApproval.model');
const logger = require('../utils/logger');

// Helper to record audit log
const logAudit = async (action, data, context) => {
    try {
        await AdminAction.create({
            adminId: context.adminId,
            targetUserId: data.targetUserId,
            action,
            metadata: data.metadata,
            ip: context.ip,
            userAgent: context.userAgent
        });
    } catch (err) {
        // Log but don't fail operation if audit write (rarely) fails
        logger.error('Failed to write audit log', { error: err.message, action });
    }
};

const createRecruiter = async (data, context) => {
    // 1. Call Auth Service
    const authResponse = await authInternalClient.createRecruiterInternal(data, context.requestId);
    const user = authResponse.data; // Assuming wrapper returns { success: true, data: user }

    // 2. Create Approval Record
    await RecruiterApproval.create({
        recruiterId: user.userId,
        status: 'pending'
    });

    // 3. Audit Log
    await logAudit('CREATE_RECRUITER', {
        targetUserId: user.userId,
        metadata: { name: data.fullName, email: data.email }
    }, context);

    return { ...user, approvalStatus: 'pending' };
};

const approveRecruiter = async (recruiterId, context) => {
    // 1. Verify existence in Approval Table
    const approvalRecord = await RecruiterApproval.findOne({ recruiterId });
    if (!approvalRecord) {
        throw ApiError.notFound('Recruiter approval record not found');
    }

    // 2. Update status
    if (approvalRecord.status === 'approved') {
        throw ApiError.badRequest('Recruiter is already approved');
    }

    approvalRecord.status = 'approved';
    approvalRecord.approvedBy = context.adminId;
    approvalRecord.approvedAt = new Date();
    await approvalRecord.save();

    // 3. Audit
    await logAudit('APPROVE_RECRUITER', {
        targetUserId: recruiterId,
        metadata: { previousStatus: 'pending' }
    }, context);

    // 4. (Optional) Send webhook/notification here

    return approvalRecord;
};

const createAdmin = async (data, context) => {
    // 1. Call Auth Service
    const authResponse = await authInternalClient.createAdminInternal(data, context.requestId);
    const user = authResponse.data;

    // 2. Audit Log
    await logAudit('CREATE_ADMIN', {
        targetUserId: user.userId,
        metadata: { name: data.fullName, email: data.email }
    }, context);

    return user;
};

const updateRole = async (userId, newRole, context) => {
    // 1. Safety Checks
    if (userId === context.adminId && newRole !== 'admin') {
        throw ApiError.forbidden('Admins cannot demote themselves. Ask another admin.');
    }

    // 2. Fetch User to verify target exists & check their current role (optional but safe)
    // Note: Assuming fetchAllUsers logic for now as 'getUser' stub might vary
    // Ideally we would have a getUserInternal(id) method. Skipped for brevity based on request.

    // 3. Call Auth Update
    await authInternalClient.updateUserRole(userId, newRole, context.requestId);

    // 4. Audit
    await logAudit('UPDATE_ROLE', {
        targetUserId: userId,
        metadata: { newRole }
    }, context);

    return { userId, newRole };
};

const banUser = async (userId, reason, duration, context) => {
    // 1. Safety Check: Don't ban self
    if (userId === context.adminId) {
        throw ApiError.forbidden('You cannot ban yourself.');
    }

    // 2. Call Auth Ban
    await authInternalClient.banUser(userId, reason, duration, context.requestId);

    // 3. Audit
    await logAudit('BAN_USER', {
        targetUserId: userId,
        metadata: { reason, duration }
    }, context);

    return { userId, banned: true, reason };
};

const listUsers = async (filters, context) => {
    // 1. Fetch from Auth
    const authResponse = await authInternalClient.fetchAllUsers(context.requestId);
    let users = authResponse.data.data || []; // Adjust based on Auth Service response shape

    // 2. Local filtering (Naive implementation for MVP)
    if (filters.role) {
        users = users.filter(u => u.role === filters.role);
    }
    // More filters can be applied here or passed to Auth Service if supported

    return users;
};

const listAuditLogs = async (filters, context) => {
    const query = {};
    if (filters.adminId) query.adminId = filters.adminId;
    if (filters.targetUserId) query.targetUserId = filters.targetUserId;
    if (filters.action) query.action = filters.action;

    const logs = await AdminAction.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(filters.limit) || 100);

    return logs;
};

module.exports = {
    createRecruiter,
    approveRecruiter,
    createAdmin,
    updateRole,
    banUser,
    listUsers,
    listAuditLogs
};
