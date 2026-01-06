# Candidate Service - API Documentation

## Base URL
```
http://localhost:3004
```

## Authentication

All candidate endpoints require JWT authentication:

```
Authorization: Bearer <jwt_token>
```

The JWT must contain:
- `userId` - The candidate's auth user ID
- `role` - Must be `"candidate"`

---

## API Endpoints

### Health & Observability

#### Health Check
```http
GET /health
```

**Response:**
```json
{
  "success": true,
  "status": "healthy",
  "service": "candidate-service",
  "timestamp": "2024-01-06T16:00:00.000Z"
}
```

#### Readiness Check
```http
GET /ready
```

#### Metrics
```http
GET /metrics
```

---

### Profile Management

#### Initialize Profile
```http
POST /api/v1/candidate/profile/init
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Profile initialized successfully",
  "data": {
    "profile": {
      "authUserId": "user123",
      "profileCompletionScore": 0,
      "isProfileComplete": false,
      "isActive": true,
      "createdAt": "2024-01-06T16:00:00.000Z"
    }
  }
}
```

#### Get Profile
```http
GET /api/v1/candidate/profile
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "profile": { ... },
    "education": [ ... ],
    "experience": [ ... ],
    "skills": [ ... ],
    "certifications": [ ... ],
    "documents": [ ... ]
  }
}
```

#### Update Profile
```http
PATCH /api/v1/candidate/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "headline": "Senior Software Engineer",
  "summary": "Experienced software engineer with 10+ years...",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA"
  },
  "preferences": {
    "desiredRole": "Tech Lead",
    "desiredLocation": "Remote",
    "salaryRange": {
      "min": 150000,
      "max": 200000,
      "currency": "USD"
    },
    "workType": "remote"
  }
}
```

#### Get Profile Status
```http
GET /api/v1/candidate/profile/status
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "score": 60,
    "isComplete": false,
    "missingFields": [
      "at least 3 skills (currently 2)",
      "resume document"
    ]
  }
}
```

---

### Education

#### Add Education
```http
POST /api/v1/candidate/education
Authorization: Bearer <token>
Content-Type: application/json

{
  "degree": "Bachelor of Science",
  "fieldOfStudy": "Computer Science",
  "institution": "Stanford University",
  "startDate": "2010-09-01",
  "endDate": "2014-06-01",
  "grade": "3.8 GPA",
  "description": "Focused on algorithms and distributed systems"
}
```

#### Update Education
```http
PATCH /api/v1/candidate/education/:educationId
Authorization: Bearer <token>
Content-Type: application/json

{
  "grade": "3.9 GPA"
}
```

#### Delete Education
```http
DELETE /api/v1/candidate/education/:educationId
Authorization: Bearer <token>
```

---

### Experience

#### Add Experience
```http
POST /api/v1/candidate/experience
Authorization: Bearer <token>
Content-Type: application/json

{
  "company": "Google",
  "title": "Senior Software Engineer",
  "employmentType": "full-time",
  "location": "Mountain View, CA",
  "startDate": "2018-01-01",
  "endDate": null,
  "description": "Led development of...",
  "isCurrentRole": true
}
```

#### Update Experience
```http
PATCH /api/v1/candidate/experience/:experienceId
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Staff Software Engineer"
}
```

#### Delete Experience
```http
DELETE /api/v1/candidate/experience/:experienceId
Authorization: Bearer <token>
```

---

### Skills

#### Add Skill
```http
POST /api/v1/candidate/skills
Authorization: Bearer <token>
Content-Type: application/json

{
  "skillName": "Node.js",
  "proficiencyLevel": "expert",
  "yearsOfExperience": 8,
  "isPrimary": true
}
```

#### Remove Skill
```http
DELETE /api/v1/candidate/skills/:skillId
Authorization: Bearer <token>
```

---

### Certifications

#### Add Certification
```http
POST /api/v1/candidate/certifications
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "AWS Solutions Architect",
  "issuingOrganization": "Amazon Web Services",
  "issueDate": "2023-01-15",
  "expiryDate": "2026-01-15",
  "credentialId": "AWS-SA-123456",
  "credentialUrl": "https://aws.amazon.com/verify/123456"
}
```

#### Remove Certification
```http
DELETE /api/v1/candidate/certifications/:certificationId
Authorization: Bearer <token>
```

---

### Documents

#### Upload Document Metadata
```http
POST /api/v1/candidate/documents
Authorization: Bearer <token>
Content-Type: application/json

{
  "documentType": "resume",
  "fileName": "john_doe_resume.pdf",
  "fileSize": 245678,
  "mimeType": "application/pdf",
  "storageUrl": "/uploads/resumes/john_doe_resume.pdf"
}
```

#### List Documents
```http
GET /api/v1/candidate/documents?documentType=resume
Authorization: Bearer <token>
```

#### Delete Document
```http
DELETE /api/v1/candidate/documents/:documentId
Authorization: Bearer <token>
```

---

### Applications

#### Submit Application
```http
POST /api/v1/candidate/applications
Authorization: Bearer <token>
Content-Type: application/json

{
  "jobId": "job123",
  "coverLetter": "I am excited to apply for...",
  "resumeDocumentId": "doc456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Application submitted successfully",
  "data": {
    "application": {
      "_id": "app789",
      "candidateId": "user123",
      "jobId": "job123",
      "status": "submitted",
      "appliedAt": "2024-01-06T16:00:00.000Z",
      "snapshot": { ... }
    }
  }
}
```

#### List Applications
```http
GET /api/v1/candidate/applications?status=submitted&limit=20&skip=0
Authorization: Bearer <token>
```

#### Get Application Details
```http
GET /api/v1/candidate/applications/:applicationId
Authorization: Bearer <token>
```

---

### Activity Logs

#### List Activity
```http
GET /api/v1/candidate/activity?eventType=profile_updated&limit=50&skip=0
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "activities": [
      {
        "candidateId": "user123",
        "eventType": "profile_updated",
        "metadata": { "fields": ["firstName", "lastName"] },
        "source": "user",
        "ipAddress": "192.168.1.1",
        "userAgent": "Mozilla/5.0...",
        "timestamp": "2024-01-06T16:00:00.000Z"
      }
    ],
    "pagination": {
      "limit": 50,
      "skip": 0
    }
  }
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message",
    "details": {}
  }
}
```

### Common Error Codes

| Code | Status | Description |
|------|--------|-------------|
| `UNAUTHORIZED` | 401 | Missing or invalid JWT token |
| `FORBIDDEN` | 403 | Insufficient permissions (not candidate role) |
| `VALIDATION_ERROR` | 400 | Request validation failed |
| `PROFILE_NOT_FOUND` | 404 | Candidate profile doesn't exist |
| `EDUCATION_NOT_FOUND` | 404 | Education entry not found |
| `EXPERIENCE_NOT_FOUND` | 404 | Experience entry not found |
| `SKILL_NOT_FOUND` | 404 | Skill not found |
| `DUPLICATE_SKILL` | 400 | Skill already exists |
| `CERTIFICATION_NOT_FOUND` | 404 | Certification not found |
| `DOCUMENT_NOT_FOUND` | 404 | Document not found |
| `APPLICATION_NOT_FOUND` | 404 | Application not found |
| `DUPLICATE_APPLICATION` | 400 | Application already submitted for this job |
| `PROFILE_INCOMPLETE` | 400 | Profile doesn't meet completion criteria |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Internal Admin Endpoints

> **Note:** These endpoints are for internal service-to-service communication only.

#### Get Candidate Profile (Admin)
```http
GET /internal/candidate/:candidateId
```

#### Verify Document (Admin)
```http
PATCH /internal/candidate/documents/:documentId/verify
Content-Type: application/json

{
  "verificationStatus": "verified",
  "rejectionReason": null
}
```

Or reject:

```json
{
  "verificationStatus": "rejected",
  "rejectionReason": "Document quality insufficient"
}
```
