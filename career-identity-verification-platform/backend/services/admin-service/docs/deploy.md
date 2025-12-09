# Deployment Guidance

## Environments

### 1. Staging
*   **Trigger**: Merge to `main`.
*   **Infrastructure**: Docker Container on Staging VM / K8s Namespace.
*   **Configuration**:
    *   `NODE_ENV=production`
    *   `MONGO_URI` -> Staging Cluster
    *   `INTERNAL_SERVICE_SECRET` -> Synced with Staging Auth Service.
*   **Verification**:
    *   Run Smoke Test: Create a dummy recruiter `test-stage-recruiter@example.com`.
    *   Verify logs show no errors.

### 2. Production
*   **Trigger**: Manual Approval (after 48h Staging bake).
*   **Strategy**: Rolling Update (Zero Downtime).
*   **Configuration**:
    *   `LOG_LEVEL=info` (No debug logs).
    *   Ensure `JWT_PUBLIC_KEY` is mounted via Secret Volume.

## Secrets Management
*   **NEVER** commit `.env` files.
*   **Platform**: Use AWS Secrets Manager, HashiCorp Vault, or GitHub Secrets.
*   **Rotation**: Rotate `INTERNAL_SERVICE_SECRET` quarterly.

## Monitoring & Alerts
*   **Health Check**: Monitor `GET /health` every 30s. Alert if != 200.
*   **Readiness**: Monitor `GET /ready`. Alert if `db` or `auth` is down > 1m.
*   **Logs**: Alert on ERROR level logs matching `UNAUTHORIZED_ACCESS_ATTEMPT`.
