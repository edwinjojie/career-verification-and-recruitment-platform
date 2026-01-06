const CandidateProfile = require('../models/CandidateProfile.model');
const Education = require('../models/Education.model');
const Experience = require('../models/Experience.model');
const Skill = require('../models/Skill.model');
const Certification = require('../models/Certification.model');
const Document = require('../models/Document.model');
const AppError = require('../errors/AppError');

/**
 * Admin: Get candidate profile by ID
 * GET /internal/candidate/:candidateId
 */
const adminGetCandidateProfile = async (req, res, next) => {
    try {
        const { candidateId } = req.params;

        const profile = await CandidateProfile.findOne({ authUserId: candidateId });

        if (!profile) {
            throw new AppError('Candidate profile not found', 404, 'PROFILE_NOT_FOUND');
        }

        // Fetch all related data
        const education = await Education.find({ candidateId }).sort({ startDate: -1 });
        const experience = await Experience.find({ candidateId }).sort({ startDate: -1 });
        const skills = await Skill.find({ candidateId });
        const certifications = await Certification.find({ candidateId });
        const documents = await Document.find({ candidateId });

        res.status(200).json({
            success: true,
            data: {
                profile,
                education,
                experience,
                skills,
                certifications,
                documents
            }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Admin: Verify or reject candidate document
 * PATCH /internal/candidate/documents/:documentId/verify
 */
const adminVerifyDocument = async (req, res, next) => {
    try {
        const { documentId } = req.params;
        const { verificationStatus, rejectionReason } = req.body;

        if (!['verified', 'rejected'].includes(verificationStatus)) {
            throw new AppError('Invalid verification status', 400, 'INVALID_STATUS');
        }

        const updateData = { verificationStatus };
        if (verificationStatus === 'rejected' && rejectionReason) {
            updateData.rejectionReason = rejectionReason;
        }

        const document = await Document.findByIdAndUpdate(
            documentId,
            updateData,
            { new: true }
        );

        if (!document) {
            throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
        }

        res.status(200).json({
            success: true,
            message: 'Document verification status updated',
            data: { document }
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    adminGetCandidateProfile,
    adminVerifyDocument
};
