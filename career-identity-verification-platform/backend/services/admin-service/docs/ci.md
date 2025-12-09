# CI/CD Pipeline Strategy

This document outlines the Continuous Integration pipeline for the Admin Service.

## Workflow Triggers
*   **Pull Request (PR)**: Triggers linting and unit tests.
*   **Push to Main**: Triggers build, integration tests, and artifact push.

## Pipeline Checkpoints

### 1. Build & Lint (Node.js)
*   **Step**: Checkout code.
*   **Step**: Install dependencies (`npm ci`).
*   **Step**: Run Linter (`npm run lint`).
    *   *Failure*: Stop pipeline. Code style must match.

### 2. Unit Tests
*   **Step**: Run Jest (`npm test`).
*   **Env**: `NODE_ENV=test`, `INTERNAL_SERVICE_SECRET=test_secret`.
*   **Coverage**: Ensure > 80% coverage on new code.

### 3. Container Build (Release)
*   **Step**: `docker build -t admin-service:${GITHUB_SHA} .`
*   **Step**: Scan image for vulnerabilities (e.g., Trivy).

### 4. Integration Smoke Test (Ephemeral)
*   **Step**: Spin up `docker-compose.admin.yml` in CI runner.
*   **Step**: Wait for `/health` endpoint 200 OK.
*   **Step**: Run script to hit `POST /recruiters` (expect 401/403 since no token, proving app is up).

## Required Secrets (GitHub Actions)
*   `REGISTRY_USERNAME` / `REGISTRY_TOKEN` (DockerHub/GHCR)
*   `INTERNAL_SERVICE_SECRET` (For integration tests)
*   `SSH_PRIVATE_KEY` (If deploying via SSH)

## Sample GitHub Action Snippet
```yaml
name: Admin Service CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm ci
      - run: npm run lint
      - run: npm test
```
