/**
 * Health & Metrics Routes Design Spec
 * ===================================
 * 
 * Purpose: Enable Kubernetes/Container orchestration probes and Prometheus monitoring.
 * 
 * Endpoints
 * ---------
 * 
 * 1. GET /health
 *    - Purpose: Liveness probe. Is the Node process running?
 *    - Logic: Return 200 OK immediately.
 *    - Response: { status: 'UP', version: '1.0.0' }
 * 
 * 2. GET /ready
 *    - Purpose: Readiness probe. Can we serve traffic?
 *    - Checks:
 *      1. MongoDB Connection: mongoose.connection.readyState === 1
 *      2. Auth Service Reachability: Lightweight HEAD/GET to Auth Service health endpoint.
 *    - Success (200): { status: 'READY', checks: { db: 'ok', authService: 'ok' } }
 *    - Failure (503): { status: 'NOT_READY', checks: { db: 'down', ... } }
 * 
 * 3. GET /metrics
 *    - Purpose: Prometheus scraping endpoint.
 *    - Content-Type: text/plain
 *    - Metrics to Expose:
 *      a. process_cpu_user_seconds_total
 *      b. process_memory_usage_bytes
 *      c. http_request_duration_seconds_bucket (Label: route, method, status)
 *      d. admin_actions_total (Counter)
 *         - labels: { action: 'create_user' | 'ban_user' | ... }
 *      e. auth_internal_requests_total (Counter)
 *         - labels: { status: '200' | '500', endpoint: 'create_user' }
 *      f. admin_service_up (Gauge) -> 1
 * 
 * Implementation Notes
 * --------------------
 * - Use `prom-client` library for standard metrics.
 * - Ensure `/metrics` is NOT exposed publicly on the internet (restrict via API Gateway or internal-only port if possible).
 */
