# Candidate Service - Testing Guide

Complete step-by-step guide to test the Candidate Service backend.

---

## 📋 Prerequisites

Before testing, ensure you have:

- ✅ **MongoDB** running locally (or remote connection string)
- ✅ **Node.js** installed (v16+)
- ✅ **Auth Service** running (to generate JWT tokens)
- ✅ **API Testing Tool** (Postman, Thunder Client, or curl)

---

## 🚀 Step 1: Initial Setup

### 1.1 Install Dependencies

```bash
cd backend/services/candidate-service
npm install
```

### 1.2 Create Environment File

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
PORT=3004
NODE_ENV=development
LOG_LEVEL=info
MONGO_URI=mongodb://localhost:27017/candidate-service
JWT_PUBLIC_KEY_PATH=../../secrets/jwt_public.pem
AUTH_SERVICE_BASE_URL=http://localhost:3002/api/v1/auth
```

> **Important:** Make sure the JWT public key exists at the specified path. This should be the same public key used by the Auth Service.

### 1.3 Start MongoDB

Ensure MongoDB is running:

```bash
# Windows
mongod

# Or if using MongoDB as a service, it should already be running
```

### 1.4 Start Auth Service

The Auth Service must be running to generate JWT tokens:

```bash
cd backend/services/auth-service
npm run dev
```

---

## 🏃 Step 2: Start Candidate Service

In a new terminal:

```bash
cd backend/services/candidate-service
npm run dev
```

You should see:

```
[candidate-service] info: Connected to MongoDB
[candidate-service] info: Candidate Service listening on port 3004
```

---

## ✅ Step 3: Test Health Endpoints

### 3.1 Health Check

```bash
curl http://localhost:3004/health
```

**Expected Response:**
```json
{
  "success": true,
  "status": "healthy",
  "service": "candidate-service",
  "timestamp": "2024-01-06T..."
}
```

### 3.2 Readiness Check

```bash
curl http://localhost:3004/ready
```

**Expected Response:**
```json
{
  "success": true,
  "status": "ready",
  "service": "candidate-service",
  "database": "connected",
  "timestamp": "2024-01-06T..."
}
```

### 3.3 Metrics

```bash
curl http://localhost:3004/metrics
```

**Expected Response:**
```json
{
  "success": true,
  "service": "candidate-service",
  "uptime": { ... },
  "memory": { ... }
}
```

✅ **If all three pass, your service is running correctly!**

---

## 🔐 Step 4: Get JWT Token

You need a JWT token with `candidate` role to test protected endpoints.

### 4.1 Register a Candidate User (via Auth Service)

```bash
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "Test123!@#",
    "name": "Test Candidate",
    "role": "candidate"
  }'
```

### 4.2 Login to Get Token

```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "candidate@test.com",
    "password": "Test123!@#"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "...",
    "user": {
      "userId": "abc123",
      "email": "candidate@test.com",
      "role": "candidate"
    }
  }
}
```

**Save the `accessToken`** - you'll use it in all subsequent requests!

---

## 🧪 Step 5: Test Profile Management

### 5.1 Initialize Profile

```bash
curl -X POST http://localhost:3004/api/v1/candidate/profile/init \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Profile initialized successfully",
  "data": {
    "profile": {
      "authUserId": "abc123",
      "profileCompletionScore": 0,
      "isProfileComplete": false,
      "isActive": true,
      "createdAt": "2024-01-06T..."
    }
  }
}
```

### 5.2 Get Profile

```bash
curl http://localhost:3004/api/v1/candidate/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 5.3 Update Profile

```bash
curl -X PATCH http://localhost:3004/api/v1/candidate/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "headline": "Senior Software Engineer",
    "summary": "Experienced software engineer with 10+ years in full-stack development, specializing in Node.js and React.",
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
  }'
```

### 5.4 Check Profile Completion Status

```bash
curl http://localhost:3004/api/v1/candidate/profile/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "score": 30,
    "isComplete": false,
    "missingFields": [
      "at least 1 education entry",
      "at least 1 work experience",
      "at least 3 skills (currently 0)",
      "resume document"
    ]
  }
}
```

---

## 📚 Step 6: Test Education

### 6.1 Add Education

```bash
curl -X POST http://localhost:3004/api/v1/candidate/education \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "degree": "Bachelor of Science",
    "fieldOfStudy": "Computer Science",
    "institution": "Stanford University",
    "startDate": "2010-09-01",
    "endDate": "2014-06-01",
    "grade": "3.8 GPA",
    "description": "Focused on algorithms and distributed systems"
  }'
```

**Save the education `_id` from the response!**

### 6.2 Update Education

```bash
curl -X PATCH http://localhost:3004/api/v1/candidate/education/EDUCATION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "grade": "3.9 GPA"
  }'
```

### 6.3 Check Profile Status Again

```bash
curl http://localhost:3004/api/v1/candidate/profile/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Score should now be 50%** (summary + education)

---

## 💼 Step 7: Test Experience

### 7.1 Add Experience

```bash
curl -X POST http://localhost:3004/api/v1/candidate/experience \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "company": "Google",
    "title": "Senior Software Engineer",
    "employmentType": "full-time",
    "location": "Mountain View, CA",
    "startDate": "2018-01-01",
    "endDate": null,
    "description": "Led development of scalable microservices architecture serving millions of users. Mentored junior engineers and drove technical decisions.",
    "isCurrentRole": true
  }'
```

**Score should now be 70%** (summary + education + experience)

---

## 🛠️ Step 8: Test Skills

### 8.1 Add Skills (Add at least 3)

```bash
# Skill 1
curl -X POST http://localhost:3004/api/v1/candidate/skills \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skillName": "Node.js",
    "proficiencyLevel": "expert",
    "yearsOfExperience": 8,
    "isPrimary": true
  }'

# Skill 2
curl -X POST http://localhost:3004/api/v1/candidate/skills \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skillName": "React",
    "proficiencyLevel": "advanced",
    "yearsOfExperience": 6,
    "isPrimary": true
  }'

# Skill 3
curl -X POST http://localhost:3004/api/v1/candidate/skills \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skillName": "MongoDB",
    "proficiencyLevel": "advanced",
    "yearsOfExperience": 5,
    "isPrimary": false
  }'
```

**Score should now be 90%** (summary + education + experience + skills)

### 8.2 Test Duplicate Skill (Should Fail)

```bash
curl -X POST http://localhost:3004/api/v1/candidate/skills \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "skillName": "Node.js",
    "proficiencyLevel": "expert"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_SKILL",
    "message": "Skill already exists"
  }
}
```

---

## 📄 Step 9: Test Documents

### 9.1 Upload Resume Metadata

```bash
curl -X POST http://localhost:3004/api/v1/candidate/documents \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "documentType": "resume",
    "fileName": "john_doe_resume.pdf",
    "fileSize": 245678,
    "mimeType": "application/pdf",
    "storageUrl": "/uploads/resumes/john_doe_resume.pdf"
  }'
```

**Save the document `_id`!**

### 9.2 Check Profile Status

```bash
curl http://localhost:3004/api/v1/candidate/profile/status \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Score should now be 100%!**

```json
{
  "success": true,
  "data": {
    "score": 100,
    "isComplete": true,
    "missingFields": []
  }
}
```

### 9.3 Mark Profile as Complete

```bash
curl -X POST http://localhost:3004/api/v1/candidate/profile/complete \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 9.4 List Documents

```bash
curl http://localhost:3004/api/v1/candidate/documents \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 🎓 Step 10: Test Certifications

```bash
curl -X POST http://localhost:3004/api/v1/candidate/certifications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AWS Solutions Architect",
    "issuingOrganization": "Amazon Web Services",
    "issueDate": "2023-01-15",
    "expiryDate": "2026-01-15",
    "credentialId": "AWS-SA-123456",
    "credentialUrl": "https://aws.amazon.com/verify/123456"
  }'
```

---

## 📝 Step 11: Test Job Applications

### 11.1 Submit Application

```bash
curl -X POST http://localhost:3004/api/v1/candidate/applications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job123",
    "coverLetter": "I am excited to apply for this position. With over 10 years of experience in software engineering...",
    "resumeDocumentId": "YOUR_RESUME_DOCUMENT_ID"
  }'
```

**Response includes immutable snapshot!**

### 11.2 Test Duplicate Application (Should Fail)

```bash
# Submit same application again
curl -X POST http://localhost:3004/api/v1/candidate/applications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jobId": "job123",
    "coverLetter": "...",
    "resumeDocumentId": "YOUR_RESUME_DOCUMENT_ID"
  }'
```

**Expected Error:**
```json
{
  "success": false,
  "error": {
    "code": "DUPLICATE_APPLICATION",
    "message": "Application already submitted for this job"
  }
}
```

### 11.3 List Applications

```bash
curl http://localhost:3004/api/v1/candidate/applications \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 11.4 Get Application Details

```bash
curl http://localhost:3004/api/v1/candidate/applications/APPLICATION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

---

## 📊 Step 12: Test Activity Logs

```bash
curl http://localhost:3004/api/v1/candidate/activity \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Should show all your actions:**
- profile_created
- profile_updated
- education_added
- experience_added
- skill_added (x3)
- document_uploaded
- application_submitted
- profile_completed

---

## 🧹 Step 13: Test Soft Deletes

### 13.1 Delete Education

```bash
curl -X DELETE http://localhost:3004/api/v1/candidate/education/EDUCATION_ID \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### 13.2 Get Profile (Education Should Be Gone)

```bash
curl http://localhost:3004/api/v1/candidate/profile \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

**Education array should be empty, but it still exists in the database with `isDeleted: true`**

---

## 🔒 Step 14: Test Security

### 14.1 Test Without Token (Should Fail)

```bash
curl http://localhost:3004/api/v1/candidate/profile
```

**Expected Error:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Missing or invalid Authorization header"
  }
}
```

### 14.2 Test With Invalid Token (Should Fail)

```bash
curl http://localhost:3004/api/v1/candidate/profile \
  -H "Authorization: Bearer invalid_token_here"
```

**Expected Error:**
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### 14.3 Test With Non-Candidate Role (Should Fail)

Register and login as a recruiter, then try to access candidate endpoints:

```bash
curl http://localhost:3004/api/v1/candidate/profile \
  -H "Authorization: Bearer RECRUITER_TOKEN"
```

**Expected Error:**
```json
{
  "success": false,
  "error": {
    "code": "FORBIDDEN",
    "message": "Access denied. Candidate role required."
  }
}
```

---

## 📱 Using Postman/Thunder Client

### Import Collection

Create a Postman collection with these requests:

1. **Environment Variables:**
   - `BASE_URL`: `http://localhost:3004`
   - `TOKEN`: Your JWT access token

2. **Headers (for all requests):**
   - `Authorization`: `Bearer {{TOKEN}}`
   - `Content-Type`: `application/json`

3. **Organize by folders:**
   - Health
   - Profile
   - Education
   - Experience
   - Skills
   - Certifications
   - Documents
   - Applications
   - Activity

---

## ✅ Testing Checklist

- [ ] Service starts without errors
- [ ] Health endpoints return 200
- [ ] Can initialize profile
- [ ] Can update profile
- [ ] Profile completion score updates correctly
- [ ] Can add/update/delete education
- [ ] Can add/update/delete experience
- [ ] Can add/remove skills
- [ ] Duplicate skill prevention works
- [ ] Can add/remove certifications
- [ ] Can upload/list/delete documents
- [ ] Can submit applications
- [ ] Duplicate application prevention works
- [ ] Application snapshot is immutable
- [ ] Activity logs track all actions
- [ ] Soft deletes work correctly
- [ ] Authentication required for all endpoints
- [ ] Role-based access control works
- [ ] Data isolation enforced (can't access other candidates' data)

---

## 🐛 Troubleshooting

### Service Won't Start

**Error:** `Failed to load JWT Public Key`
- **Solution:** Ensure `../../secrets/jwt_public.pem` exists
- Copy from auth-service if needed

**Error:** `Failed to connect to MongoDB`
- **Solution:** Ensure MongoDB is running
- Check `MONGO_URI` in `.env`

### 401 Unauthorized Errors

- **Check:** Token is valid and not expired
- **Check:** Token has `candidate` role
- **Check:** Authorization header format: `Bearer <token>`

### Validation Errors

- **Check:** Request body matches schema requirements
- **Check:** Required fields are provided
- **Check:** Data types are correct

---

## 🎯 Quick Test Script

Save this as `test-candidate-service.sh`:

```bash
#!/bin/bash

BASE_URL="http://localhost:3004"
TOKEN="YOUR_TOKEN_HERE"

echo "Testing Health..."
curl -s $BASE_URL/health | jq

echo "\nInitializing Profile..."
curl -s -X POST $BASE_URL/api/v1/candidate/profile/init \
  -H "Authorization: Bearer $TOKEN" | jq

echo "\nGetting Profile..."
curl -s $BASE_URL/api/v1/candidate/profile \
  -H "Authorization: Bearer $TOKEN" | jq

echo "\nAll tests completed!"
```

Run with: `bash test-candidate-service.sh`

---

## 📚 Next Steps

After manual testing:
1. Write automated tests with Jest + Supertest
2. Set up integration tests
3. Add API documentation (Swagger/OpenAPI)
4. Configure CI/CD pipeline
5. Deploy to staging environment

Happy Testing! 🚀
