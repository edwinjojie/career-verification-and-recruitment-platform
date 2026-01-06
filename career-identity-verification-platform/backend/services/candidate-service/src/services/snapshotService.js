const CandidateProfile = require('../models/CandidateProfile.model');
const Education = require('../models/Education.model');
const Experience = require('../models/Experience.model');
const Skill = require('../models/Skill.model');
const Document = require('../models/Document.model');

/**
 * Build immutable snapshot of candidate profile for job application
 * 
 * Snapshot includes:
 * - Profile core info
 * - Education entries
 * - Experience entries
 * - Skills
 * - Resume metadata
 * 
 * @param {String} candidateId - The candidate's authUserId
 * @param {String} resumeDocumentId - Optional specific resume to include
 * @returns {Object} Snapshot object
 */
const buildApplicationSnapshot = async (candidateId, resumeDocumentId = null) => {
    try {
        // Fetch profile
        const profile = await CandidateProfile.findOne({ authUserId: candidateId }).lean();

        if (!profile) {
            throw new Error('Candidate profile not found');
        }

        // Fetch education (non-deleted)
        const education = await Education.find({
            candidateId,
            isDeleted: false
        }).sort({ startDate: -1 }).lean();

        // Fetch experience (non-deleted)
        const experience = await Experience.find({
            candidateId,
            isDeleted: false
        }).sort({ startDate: -1 }).lean();

        // Fetch skills
        const skills = await Skill.find({ candidateId }).lean();

        // Fetch resume document
        let resume = null;
        if (resumeDocumentId) {
            resume = await Document.findOne({
                _id: resumeDocumentId,
                candidateId,
                documentType: 'resume',
                isDeleted: false
            }).lean();
        } else {
            // Get most recent resume
            resume = await Document.findOne({
                candidateId,
                documentType: 'resume',
                isDeleted: false
            }).sort({ uploadedAt: -1 }).lean();
        }

        // Build snapshot
        const snapshot = {
            profile: {
                firstName: profile.firstName,
                lastName: profile.lastName,
                phone: profile.phone,
                location: profile.location,
                headline: profile.headline,
                summary: profile.summary,
                preferences: profile.preferences
            },
            education: education.map(edu => ({
                degree: edu.degree,
                fieldOfStudy: edu.fieldOfStudy,
                institution: edu.institution,
                startDate: edu.startDate,
                endDate: edu.endDate,
                grade: edu.grade,
                description: edu.description
            })),
            experience: experience.map(exp => ({
                company: exp.company,
                title: exp.title,
                employmentType: exp.employmentType,
                location: exp.location,
                startDate: exp.startDate,
                endDate: exp.endDate,
                description: exp.description,
                isCurrentRole: exp.isCurrentRole
            })),
            skills: skills.map(skill => ({
                skillName: skill.skillName,
                proficiencyLevel: skill.proficiencyLevel,
                yearsOfExperience: skill.yearsOfExperience
            })),
            resume: resume ? {
                fileName: resume.fileName,
                storageUrl: resume.storageUrl,
                uploadedAt: resume.uploadedAt
            } : null,
            snapshotCreatedAt: new Date()
        };

        return snapshot;

    } catch (error) {
        throw new Error(`Failed to build application snapshot: ${error.message}`);
    }
};

module.exports = {
    buildApplicationSnapshot
};
