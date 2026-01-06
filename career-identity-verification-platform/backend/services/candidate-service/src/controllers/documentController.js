const Document = require('../models/Document.model');
const AppError = require('../errors/AppError');
const { updateProfileCompletion } = require('../services/profileCompletionService');
const { logActivity } = require('../services/activityLogService');

/**
 * Upload document metadata
 * POST /api/v1/candidate/documents
 */
const uploadDocument = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const documentData = { ...req.body, candidateId };

        const document = await Document.create(documentData);

        // Update profile completion if resume
        if (document.documentType === 'resume') {
            await updateProfileCompletion(candidateId);
        }

        // Log activity
        await logActivity(candidateId, 'document_uploaded', {
            documentId: document._id,
            documentType: document.documentType
        }, req);

        res.status(201).json({
            success: true,
            message: 'Document uploaded successfully',
            data: { document }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * List documents
 * GET /api/v1/candidate/documents
 */
const listDocuments = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { documentType } = req.query;

        const query = { candidateId, isDeleted: false };
        if (documentType) {
            query.documentType = documentType;
        }

        const documents = await Document.find(query).sort({ uploadedAt: -1 });

        res.status(200).json({
            success: true,
            data: { documents }
        });

    } catch (error) {
        next(error);
    }
};

/**
 * Delete document (soft delete)
 * DELETE /api/v1/candidate/documents/:documentId
 */
const deleteDocument = async (req, res, next) => {
    try {
        const candidateId = req.user.userId;
        const { documentId } = req.params;

        const document = await Document.findOneAndUpdate(
            { _id: documentId, candidateId, isDeleted: false },
            { isDeleted: true },
            { new: true }
        );

        if (!document) {
            throw new AppError('Document not found', 404, 'DOCUMENT_NOT_FOUND');
        }

        // Update profile completion if resume
        if (document.documentType === 'resume') {
            await updateProfileCompletion(candidateId);
        }

        // Log activity
        await logActivity(candidateId, 'document_deleted', { documentId, documentType: document.documentType }, req);

        res.status(200).json({
            success: true,
            message: 'Document deleted successfully'
        });

    } catch (error) {
        next(error);
    }
};

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument
};
