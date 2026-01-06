const Certification = require('../models/Certification.model');
const AppError = require('../errors/AppError');
const { logActivity } = require('../services/activityLogService');

/**
 * Add certification
 * POST /api/v1/candidate/certifications
 */
const addCertification = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const certificationData = { ...req.body, candidateId };

        const certification = await Certification.create(certificationData);

        // Log activity
        await logActivity(candidateId, 'certification_added', { certificationId: certification._id }, req);

        res.status(201).json({
            success: true,
            message: 'Certification added successfully',
            data: { certification }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Remove certification (soft delete)
 * DELETE /api/v1/candidate/certifications/:certificationId
 */
const removeCertification = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { certificationId } = req.params;

        const certification = await Certification.findOneAndUpdate(
            { _id: certificationId, candidateId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!certification) {
            throw new AppError('Certification not found', 404, 'CERTIFICATION_NOT_FOUND');
        }

        // Log activity
        await logActivity(candidateId, 'certification_removed', { certificationId }, req);

        res.status(200).json({
            success: true,
            message: 'Certification removed successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    addCertification,
    removeCertification
};
