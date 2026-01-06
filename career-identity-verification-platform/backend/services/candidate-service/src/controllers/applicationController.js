const Application = require('../models/Application.model');
const AppError = require('../errors/AppError');
const { buildApplicationSnapshot } = require('../services/snapshotService');
const { logActivity } = require('../services/activityLogService');

/**
 * Submit job application
 * POST /api/v1/candidate/applications
 */
const submitApplication = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { jobId, coverLetter, resumeDocumentId } = req.body;

        // Check for duplicate application
        const existingApplication = await Application.findOne({ candidateId, jobId });
        if (existingApplication) {
            throw new AppError('Application already submitted for this job', 400, 'DUPLICATE_APPLICATION');
        }

        // Build immutable snapshot
        const snapshot = await buildApplicationSnapshot(candidateId, resumeDocumentId);

        // Create application
        const application = await Application.create({
            candidateId,
            jobId,
            coverLetter,
            resumeDocumentId,
            snapshot
        });

        // Log activity
        await logActivity(candidateId, 'application_submitted', {
            applicationId: application._id,
            jobId
        }, req);

        res.status(201).json({
            success: true,
            message: 'Application submitted successfully',
            data: { application }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * List candidate's applications
 * GET /api/v1/candidate/applications
 */
const listApplications = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { status, limit = 20, skip = 0 } = req.query;

        const query = { candidateId };
        if (status) {
            query.status = status;
        }

        const applications = await Application.find(query)
            .sort({ appliedAt: -1 })
            .limit(parseInt(limit))
            .skip(parseInt(skip))
            .select('-snapshot'); // Exclude snapshot from list view

        const total = await Application.countDocuments(query);

        res.status(200).json({
            success: true,
            data: {
                applications,
                pagination: {
                    total,
                    limit: parseInt(limit),
                    skip: parseInt(skip)
                }
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Get application details
 * GET /api/v1/candidate/applications/:applicationId
 */
const getApplicationDetails = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { applicationId } = req.params;

        const application = await Application.findOne({
            _id: applicationId,
            candidateId
        });

        if (!application) {
            throw new AppError('Application not found', 404, 'APPLICATION_NOT_FOUND');
        }

        res.status(200).json({
            success: true,
            data: { application }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    submitApplication,
    listApplications,
    getApplicationDetails
};
