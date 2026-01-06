# Candidate Service

**Candidate Service** for the Career Identity Verification & Recruitment Platform. This microservice manages all career-related data and actions performed by candidates after authentication.

## Overview

The Candidate Service provides a secure, auditable, and extensible career identity backend that allows candidates to:
- Build and manage their professional profile
- Track education and work experience
- Showcase skills and certifications
- Upload and manage documents
- Submit job applications
- View activity history

## Features

- ✅ **Profile Management** - Create, update, and manage candidate profiles
- ✅ **Education & Experience** - CRUD operations with soft delete support
- ✅ **Skills & Certifications** - Manage professional competencies
- ✅ **Document Management** - Upload and track career documents (metadata-only)
- ✅ **Job Applications** - Submit applications with immutable snapshots
- ✅ **Activity Logging** - Complete audit trail of candidate actions
- ✅ **Profile Completion** - Automated scoring and readiness tracking
- ✅ **Health & Metrics** - Service observability endpoints

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (RS256) with RSA key pairs
- **Validation**: Joi schemas
- **Logging**: Winston
- **Security**: Helmet, CORS

## Prerequisites

- Node.js >= 16.x
- MongoDB >= 5.x
- JWT public key from Auth Service (for token verification)

## Installation

1. **Clone the repository** (if not already done)

2. **Navigate to the service directory**:
   ```bash
   cd backend/services/candidate-service
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Configure environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `PORT` - Service port (default: 3004)
   - `MONGO_URI` - MongoDB connection string
   - `JWT_PUBLIC_KEY_PATH` - Path to JWT public key file
   - `LOG_LEVEL` - Logging level (info, debug, error)

5. **Ensure JWT public key is available**:
   - The public key should be located at the path specified in `JWT_PUBLIC_KEY_PATH`
   - Typically: `../../secrets/jwt_public.pem` (shared with other services)

## Running the Service

### Development Mode
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

### Run Tests
```bash
npm test
```

### Lint Code
```bash
npm run lint
```

## API Endpoints

### Health & Observability

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Basic health check |
| GET | `/ready` | Readiness check (includes DB status) |
| GET | `/metrics` | Service metrics (uptime, memory) |

### Profile Management

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/profile/init` | Initialize profile (idempotent) | ✅ Candidate |
| GET | `/api/v1/candidate/profile` | Get full profile | ✅ Candidate |
| PATCH | `/api/v1/candidate/profile` | Update profile | ✅ Candidate |
| GET | `/api/v1/candidate/profile/status` | Get completion status | ✅ Candidate |
| POST | `/api/v1/candidate/profile/complete` | Mark profile complete | ✅ Candidate |
| POST | `/api/v1/candidate/profile/deactivate` | Deactivate profile | ✅ Candidate |

### Education

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/education` | Add education | ✅ Candidate |
| PATCH | `/api/v1/candidate/education/:id` | Update education | ✅ Candidate |
| DELETE | `/api/v1/candidate/education/:id` | Delete education (soft) | ✅ Candidate |

### Experience

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/experience` | Add experience | ✅ Candidate |
| PATCH | `/api/v1/candidate/experience/:id` | Update experience | ✅ Candidate |
| DELETE | `/api/v1/candidate/experience/:id` | Delete experience (soft) | ✅ Candidate |

### Skills

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/skills` | Add skill | ✅ Candidate |
| DELETE | `/api/v1/candidate/skills/:id` | Remove skill | ✅ Candidate |

### Certifications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/certifications` | Add certification | ✅ Candidate |
| DELETE | `/api/v1/candidate/certifications/:id` | Remove certification (soft) | ✅ Candidate |

### Documents

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/documents` | Upload document metadata | ✅ Candidate |
| GET | `/api/v1/candidate/documents` | List documents | ✅ Candidate |
| DELETE | `/api/v1/candidate/documents/:id` | Delete document (soft) | ✅ Candidate |

### Applications

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/v1/candidate/applications` | Submit application | ✅ Candidate |
| GET | `/api/v1/candidate/applications` | List applications | ✅ Candidate |
| GET | `/api/v1/candidate/applications/:id` | Get application details | ✅ Candidate |

### Activity Logs

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/candidate/activity` | List activity history | ✅ Candidate |

### Internal Admin Endpoints

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/internal/candidate/:candidateId` | Get candidate profile | Internal |
| PATCH | `/internal/candidate/documents/:id/verify` | Verify/reject document | Internal |

## Authentication

All candidate endpoints require:
- **JWT Token** in `Authorization: Bearer <token>` header
- **Role**: `candidate` (verified from JWT payload)
- **User ID**: Extracted from JWT `userId` field

### JWT Verification

The service verifies JWTs using:
- **Algorithm**: RS256 (RSA with SHA-256)
- **Public Key**: Loaded from `JWT_PUBLIC_KEY_PATH`
- **Issuer**: Auth Service

## Data Models

### CandidateProfile
- Core profile information (name, location, headline, summary)
- Career preferences (desired role, location, salary range)
- Profile completion tracking

### Education
- Academic qualifications
- Soft delete support
- Future verification support

### Experience
- Work history
- Employment types (full-time, part-time, contract, etc.)
- Current role tracking

### Skill
- Skill name and proficiency level
- Years of experience
- Primary skill flagging

### Certification
- Professional certifications
- Expiry tracking
- Credential verification support

### Document
- Metadata-only storage (resume, certificates, ID proof, portfolio)
- Verification status tracking
- Soft delete support

### Application
- Job application records
- Immutable profile snapshots
- Duplicate prevention (candidateId + jobId unique constraint)

### ActivityLog
- Comprehensive audit trail
- Event types (profile updates, document uploads, applications, etc.)
- Source tracking (user, system, admin)

## Profile Completion Criteria

A profile is considered complete (score ≥ 80%) when:

| Criteria | Weight |
|----------|--------|
| Profile summary ≥ 50 characters | 20% |
| At least 1 education entry | 20% |
| At least 1 work experience | 20% |
| At least 3 skills | 20% |
| At least 1 resume uploaded | 10% |
| Preferences filled (role + location) | 10% |

## Error Handling

All errors follow a standardized format:

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

Common error codes:
- `UNAUTHORIZED` - Missing or invalid JWT
- `FORBIDDEN` - Insufficient permissions
- `VALIDATION_ERROR` - Request validation failed
- `PROFILE_NOT_FOUND` - Profile does not exist
- `DUPLICATE_APPLICATION` - Application already submitted
- `PROFILE_INCOMPLETE` - Profile doesn't meet completion criteria

## Logging

The service uses Winston for structured logging:

- **Levels**: error, warn, info, debug
- **Format**: JSON with timestamps
- **Context**: Request IDs, user IDs, event metadata

## Development

### Project Structure

```
candidate-service/
├── src/
│   ├── config/           # Environment configuration
│   ├── controllers/      # Request handlers
│   ├── errors/           # Custom error classes
│   ├── health/           # Health check endpoints
│   ├── metrics/          # Metrics endpoints
│   ├── middleware/       # Express middleware
│   ├── models/           # Mongoose schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic services
│   ├── utils/            # Utility functions
│   ├── validators/       # Joi validation schemas
│   ├── app.js            # Express app setup
│   └── server.js         # Entry point
├── .env.example          # Environment template
├── .gitignore
├── package.json
└── README.md
```

### Adding New Features

1. **Create Model** in `src/models/`
2. **Add Validator** in `src/validators/`
3. **Implement Controller** in `src/controllers/`
4. **Define Routes** in `src/routes/`
5. **Mount Routes** in `src/routes/index.js`
6. **Add Tests** (when test suite is set up)

## Security Considerations

- ✅ JWT verification on all protected endpoints
- ✅ Role-based access control (candidate role required)
- ✅ Data isolation (candidates can only access their own data)
- ✅ Helmet for security headers
- ✅ CORS configuration
- ✅ Input validation with Joi
- ✅ Soft deletes for audit safety
- ✅ Activity logging for all actions

## Future Enhancements

- [ ] Document file upload to S3/cloud storage
- [ ] Email notifications for profile milestones
- [ ] Profile visibility settings
- [ ] Resume parsing and auto-fill
- [ ] Skill recommendations
- [ ] Profile export (PDF)
- [ ] Integration with Job Service
- [ ] Advanced search and filtering

## License

ISC

## Support

For issues or questions, please contact the development team.
