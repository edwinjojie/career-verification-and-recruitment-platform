const Response = require('../utils/response');
const authInternalClient = require('../services/authInternalClient');

async function createRecruiter(req, res, next) {
    try {
        const result = await authInternalClient.createRecruiterInternal(req.body, req.requestId);
        Response.success(res, result.data, 'Recruiter Created via Auth Service');
    } catch (error) {
        next(error);
    }
}

async function listPendingRecruiters(req, res, next) {
    // Stub
    Response.success(res, { stub: 'listPendingRecruiters' }, 'Stub: List Pending');
}

async function approveRecruiter(req, res, next) {
    // Stub
    Response.success(res, { stub: 'approveRecruiter' }, 'Stub: Recruiter Approved');
}

async function createAdmin(req, res, next) {
    try {
        const result = await authInternalClient.createAdminInternal(req.body, req.requestId);
        Response.success(res, result.data, 'Admin Created via Auth Service');
    } catch (error) {
        next(error);
    }
}

async function listUsers(req, res, next) {
    try {
        const result = await authInternalClient.fetchAllUsers(req.requestId);
        Response.success(res, result.data, 'Users Fetched from Auth Service');
    } catch (error) {
        next(error);
    }
}

async function updateRole(req, res, next) {
    try {
        const { id } = req.params;
        const { newRole } = req.body;
        const result = await authInternalClient.updateUserRole(id, newRole, req.requestId);
        Response.success(res, result.data, 'User Role Updated via Auth Service');
    } catch (error) {
        next(error);
    }
}

async function banUser(req, res, next) {
    try {
        const { id } = req.params;
        const { reason, duration } = req.body;
        const result = await authInternalClient.banUser(id, reason, duration, req.requestId);
        Response.success(res, result.data, 'User Banned via Auth Service');
    } catch (error) {
        next(error);
    }
}

async function listAuditLogs(req, res, next) {
    Response.success(res, { stub: 'listAuditLogs' }, 'Stub: Audit Logs');
}

module.exports = {
    createRecruiter,
    listPendingRecruiters,
    approveRecruiter,
    createAdmin,
    listUsers,
    updateRole,
    banUser,
    listAuditLogs
};
