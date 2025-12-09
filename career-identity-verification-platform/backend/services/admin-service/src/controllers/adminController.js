const Response = require('../utils/response');
const adminService = require('../services/adminService');
const { extractAdminContext } = require('../utils/adminContext');

async function createRecruiter(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const result = await adminService.createRecruiter(req.body, context);
        Response.success(res, result, 'Recruiter Created Successfully');
    } catch (error) {
        next(error);
    }
}

async function listPendingRecruiters(req, res, next) {
    // Note: Assuming listRecruiters logic or simple database query
    const RecruiterApproval = require('../models/RecruiterApproval.model');
    const pending = await RecruiterApproval.find({ status: 'pending' });
    Response.success(res, pending, 'Pending Recruiters List');
}

async function approveRecruiter(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const { id } = req.params;
        const result = await adminService.approveRecruiter(id, context);
        Response.success(res, result, 'Recruiter Approved');
    } catch (error) {
        next(error);
    }
}

async function createAdmin(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const result = await adminService.createAdmin(req.body, context);
        Response.success(res, result, 'Admin Created Successfully');
    } catch (error) {
        next(error);
    }
}

async function listUsers(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const result = await adminService.listUsers(req.query, context);
        Response.success(res, result, 'Users List');
    } catch (error) {
        next(error);
    }
}

async function updateRole(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const { id } = req.params;
        const { newRole } = req.body;
        const result = await adminService.updateRole(id, newRole, context);
        Response.success(res, result, 'User Role Updated');
    } catch (error) {
        next(error);
    }
}

async function banUser(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const { id } = req.params;
        const { reason, duration } = req.body;
        const result = await adminService.banUser(id, reason, duration, context);
        Response.success(res, result, 'User Banned');
    } catch (error) {
        next(error);
    }
}

async function listAuditLogs(req, res, next) {
    try {
        const context = extractAdminContext(req);
        const result = await adminService.listAuditLogs(req.query, context);
        Response.success(res, result, 'Audit Logs');
    } catch (error) {
        next(error);
    }
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
