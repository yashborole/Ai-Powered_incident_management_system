import { Application } from '../types/application';
import { Incident } from '../types/incident';
import { KnowledgeDocument } from '../types/knowledge';
import { LogEntry } from '../types/logs';
import { MetricDataPoint, ReliabilityMetrics } from '../types/analytics';

export const initialApplications: Application[] = [
  {
    id: 'app-ecommerce',
    name: 'Friend E-commerce',
    technology: 'MERN',
    environment: 'TEST',
    status: 'healthy',
    uptime: 99.8,
    errorRate: 0.4,
    requestsCount: 125430,
    avgLatencyMs: 182,
    baseUrl: 'http://localhost:5000',
    description: 'Main customer-facing shopping storefront and checkout microservices.',
    createdAt: '2026-07-15T10:00:00Z',
    services: [
      { id: 'srv-auth', name: 'Auth API', requests: 15800, latencyMs: 150, errorRate: 0.3, status: 'healthy', lastUpdated: 'Just now' },
      { id: 'srv-orders', name: 'Orders API', requests: 18200, latencyMs: 185, errorRate: 0.8, status: 'healthy', lastUpdated: 'Just now' },
      { id: 'srv-payment', name: 'Payment API', requests: 8500, latencyMs: 420, errorRate: 3.2, status: 'critical', lastUpdated: '1 min ago' },
      { id: 'srv-inventory', name: 'Inventory API', requests: 22400, latencyMs: 110, errorRate: 0.1, status: 'healthy', lastUpdated: 'Just now' },
    ],
    deployments: [
      { id: 'dep-101', version: 'v1.4.2', commitHash: 'afec4f7', author: 'Yash Borole', timestamp: '14:20 Today', status: 'SUCCESS', summary: 'Build order apis and connection pool tuning', associatedIncidentId: 'INC-1045' },
      { id: 'dep-100', version: 'v1.4.1', commitHash: 'e0cc6fb', author: 'Yash Borole', timestamp: 'Yesterday', status: 'SUCCESS', summary: 'Fix order API and add product API' },
      { id: 'dep-099', version: 'v1.4.0', commitHash: '66df311', author: 'Engineering Team', timestamp: '3 days ago', status: 'SUCCESS', summary: 'Add product catalog caching' },
    ]
  },
  {
    id: 'app-payment-service',
    name: 'Payment Service',
    technology: 'Node.js',
    environment: 'TEST',
    status: 'degraded',
    uptime: 98.2,
    errorRate: 2.8,
    requestsCount: 45200,
    avgLatencyMs: 380,
    baseUrl: 'http://localhost:5001',
    description: 'Payment gateway integration and settlement processor.',
    createdAt: '2026-07-20T14:30:00Z',
    services: [
      { id: 'srv-stripe', name: 'Stripe Gateway', requests: 28000, latencyMs: 340, errorRate: 2.4, status: 'degraded' },
      { id: 'srv-settle', name: 'Settlement Engine', requests: 17200, latencyMs: 410, errorRate: 3.5, status: 'degraded' },
    ],
    deployments: [
      { id: 'dep-201', version: 'v2.1.0', commitHash: '7b9c1d2', author: 'Payment Team', timestamp: 'Today 11:00', status: 'SUCCESS', summary: 'Update webhook signature verification' },
    ]
  },
  {
    id: 'app-inventory-api',
    name: 'Inventory API',
    technology: 'FastAPI',
    environment: 'PRODUCTION',
    status: 'healthy',
    uptime: 99.9,
    errorRate: 0.1,
    requestsCount: 92100,
    avgLatencyMs: 95,
    baseUrl: 'http://localhost:8000',
    description: 'Real-time warehouse stock synchronization and tracking API.',
    createdAt: '2026-08-01T09:00:00Z',
    services: [
      { id: 'srv-stock', name: 'Stock Sync Service', requests: 62000, latencyMs: 85, errorRate: 0.05, status: 'healthy' },
      { id: 'srv-warehouse', name: 'Warehouse Connector', requests: 30100, latencyMs: 115, errorRate: 0.15, status: 'healthy' },
    ],
    deployments: [
      { id: 'dep-301', version: 'v1.0.8', commitHash: '4f2e9a1', author: 'Backend Team', timestamp: '2 days ago', status: 'SUCCESS', summary: 'Optimized stock query indexes' },
    ]
  },
  {
    id: 'app-auth-service',
    name: 'Auth & Identity Service',
    technology: 'Python',
    environment: 'PRODUCTION',
    status: 'healthy',
    uptime: 99.95,
    errorRate: 0.05,
    requestsCount: 180300,
    avgLatencyMs: 65,
    baseUrl: 'http://localhost:8001',
    description: 'Central OAuth2 and JWT token authentication & role management.',
    createdAt: '2026-06-10T12:00:00Z',
    services: [
      { id: 'srv-jwt', name: 'Token Verification', requests: 120000, latencyMs: 45, errorRate: 0.02, status: 'healthy' },
      { id: 'srv-rbac', name: 'RBAC Policy Provider', requests: 60300, latencyMs: 85, errorRate: 0.08, status: 'healthy' },
    ],
    deployments: [
      { id: 'dep-401', version: 'v3.0.0', commitHash: '1a2b3c4', author: 'Security Team', timestamp: '5 days ago', status: 'SUCCESS', summary: 'Added OAuth2 scopes support' },
    ]
  }
];

export const initialIncidents: Incident[] = [
  {
    id: 'INC-1045',
    applicationId: 'app-ecommerce',
    applicationName: 'Friend E-commerce',
    serviceName: 'Payment API',
    title: 'Payment API latency increased significantly',
    severity: 'HIGH',
    status: 'INVESTIGATING',
    detectedAt: '14:32 Today',
    startedAt: '14:31 Today',
    description: 'Payment API latency increased 240% following deployment v1.4.2. Database connection pool reached 98% utilization with 14x timeout errors.',
    timeline: [
      { time: '14:20', type: 'DEPLOYMENT', title: 'Deployment v1.4.2', description: 'Commit afec4f7 deployed to TEST environment by Yash Borole', severity: 'info' },
      { time: '14:25', type: 'METRIC_SPIKE', title: 'Database latency increased', description: 'PostgreSQL avg query latency rose from 12ms to 320ms', severity: 'warning' },
      { time: '14:28', type: 'METRIC_SPIKE', title: 'API latency increased', description: 'Payment API response time degraded to 420ms (P95 980ms)', severity: 'warning' },
      { time: '14:30', type: 'ERROR_SPIKE', title: 'Error rate increased', description: 'HTTP 500 error rate surged to 8.4% on /payment/checkout', severity: 'danger' },
      { time: '14:31', type: 'DETECTION', title: 'Incident detected', description: 'Automated reliability monitor triggered high-severity alert', severity: 'danger' },
      { time: '14:35', type: 'ACTION', title: 'AI Investigation completed', description: 'Hypothesis formed with 87% confidence matching past incident INC-782', severity: 'info' }
    ],
    aiInvestigation: {
      title: 'Database connection pool exhaustion',
      confidence: 87,
      summary: 'Payment API latency increased 240% due to MongoDB/PostgreSQL connection pool exhaustion following deployment v1.4.2.',
      evidence: [
        'DB connections reached 98% utilization ceiling',
        'Timeout errors increased 14x in the last 15 minutes',
        'Payment API latency spiked immediately after deployment v1.4.2',
        'Similar incident INC-782 found with 91% historical pattern match'
      ],
      whyHypothesis: [
        '14x increase in database timeout errors and connection wait queue depth',
        '98% connection utilization sustained over 10 consecutive minutes',
        'Direct correlation between deployment v1.4.2 config changes and connection leak',
        'Similar resolution in INC-782 resolved 100% of errors by resizing connection pool'
      ],
      recommendedActions: [
        { id: 'act-1', text: 'Check database connection pool configuration (max_connections / pool_size)', completed: true },
        { id: 'act-2', text: 'Review recent deployment v1.4.2 database session teardown logic', completed: false },
        { id: 'act-3', text: 'Inspect active DB connections and kill idle unclosed transactions', completed: false },
        { id: 'act-4', text: 'Scale pool size to 50 connections or enable PgBouncer connection reuse', completed: false }
      ],
      similarIncidents: [
        {
          id: 'INC-782',
          title: 'Database connection timeout during flash sale',
          similarity: 91,
          previousResolution: 'Increased DB connection pool size from 20 to 60 and fixed unclosed session in checkout handler.',
          resolvedAt: '1 week ago'
        },
        {
          id: 'INC-640',
          title: 'Payment gateway socket timeout',
          similarity: 74,
          previousResolution: 'Added retry mechanism with exponential backoff and timeout threshold.',
          resolvedAt: '3 weeks ago'
        }
      ],
      suggestedRootCause: 'Database connection pool exhaustion caused by unclosed connection handlers in deployment v1.4.2 under peak load.',
      suggestedResolution: 'Increased connection pool size from 20 to 60, rolled out hotfix patch for session cleanup, and restarted service.',
      suggestedPreventiveAction: 'Add connection pool utilization alert at 80% threshold and implement strict contextual DB session scopes.'
    }
  },
  {
    id: 'INC-1044',
    applicationId: 'app-ecommerce',
    applicationName: 'Orders API',
    serviceName: 'Orders API',
    title: 'Order creation queue backpressure',
    severity: 'MEDIUM',
    status: 'OPEN',
    detectedAt: '13:20 Today',
    startedAt: '13:15 Today',
    description: 'Order processing queue lag increased by 45s. Background worker concurrency saturated.',
    timeline: [
      { time: '13:15', type: 'METRIC_SPIKE', title: 'Queue depth increased', description: 'Kafka topic orders.process lag reached 1,200 messages', severity: 'warning' },
      { time: '13:20', type: 'DETECTION', title: 'Incident detected', description: 'Queue SLA alert breached', severity: 'warning' },
    ],
    aiInvestigation: {
      title: 'Worker concurrency saturation',
      confidence: 82,
      summary: 'Kafka consumer lag increased due to synchronous external inventory check.',
      evidence: [
        'Consumer lag exceeded 1,200 messages',
        'Worker thread utilization 100%',
        'Downstream inventory API latency 180ms'
      ],
      whyHypothesis: [
        'Worker batch processing was throttled by downstream synchronous network calls'
      ],
      recommendedActions: [
        { id: 'act-101', text: 'Scale up worker replicas from 2 to 6', completed: false },
        { id: 'act-102', text: 'Enable asynchronous inventory verification batching', completed: false }
      ],
      similarIncidents: [],
      suggestedRootCause: 'Queue worker starvation caused by blocking synchronous inventory verification calls.',
      suggestedResolution: 'Scaled worker pods to 6 and switched to batch inventory check.',
      suggestedPreventiveAction: 'Implement circuit breaker pattern on inventory client.'
    }
  },
  {
    id: 'INC-1042',
    applicationId: 'app-auth-service',
    applicationName: 'Auth API',
    serviceName: 'Token Verification',
    title: 'Intermittent 401 Unauthorized errors on token refresh',
    severity: 'LOW',
    status: 'INVESTIGATING',
    detectedAt: '11:45 Today',
    startedAt: '11:40 Today',
    description: 'Occasional clock skew validation failure on JWT token verification during high client concurrency.',
    timeline: [
      { time: '11:40', type: 'ERROR_SPIKE', title: '401 spike on /refresh', description: 'Rate of 401 responses rose from 0.01% to 0.4%', severity: 'warning' },
      { time: '11:45', type: 'DETECTION', title: 'Incident detected', description: 'Auth anomaly threshold flagged', severity: 'info' }
    ],
    aiInvestigation: {
      title: 'Token clock skew mismatch',
      confidence: 94,
      summary: 'NTP drift across application servers causing premature token expiry verification.',
      evidence: [
        'JWT tokens expired by < 2 seconds',
        'Server clock delta detected at 1.8 seconds'
      ],
      whyHypothesis: [
        'Client timestamp was slightly behind auth node validation window without leeway tolerance'
      ],
      recommendedActions: [
        { id: 'act-201', text: 'Configure 10-second leeway in JWT decode verification', completed: true },
        { id: 'act-202', text: 'Resync host system chrony / NTP daemon', completed: false }
      ],
      similarIncidents: [],
      suggestedRootCause: 'Absence of JWT leeway allowance in conjunction with server clock drift.',
      suggestedResolution: 'Added leeway=10 to jwt.decode and resynced NTP server.',
      suggestedPreventiveAction: 'Enforce NTP synchronization monitoring on all worker instances.'
    }
  },
  {
    id: 'INC-782',
    applicationId: 'app-ecommerce',
    applicationName: 'Friend E-commerce',
    serviceName: 'Payment API',
    title: 'Database connection timeout during flash sale',
    severity: 'HIGH',
    status: 'RESOLVED',
    detectedAt: '1 week ago',
    startedAt: '1 week ago',
    resolvedAt: '1 week ago',
    description: 'Connection pool exhausted under heavy flash sale checkout load.',
    timeline: [
      { time: '10:00', type: 'DETECTION', title: 'Alert triggered', severity: 'danger' },
      { time: '10:15', type: 'ACTION', title: 'Pool resized and redeployed', severity: 'info' },
      { time: '10:22', type: 'ACTION', title: 'Incident resolved', severity: 'info' }
    ],
    resolutionNotes: {
      rootCause: 'Database connection pool size was capped at 20 while checkout traffic demanded 55 concurrent sessions.',
      resolution: 'Increased DB connection pool size from 20 to 60 and fixed unclosed session in checkout handler.',
      preventiveAction: 'Added automated database pool utilization metrics to monitoring dashboard.',
      resolvedBy: 'Yash Borole',
      resolvedAt: '1 week ago'
    }
  }
];

export const initialKnowledgeDocuments: KnowledgeDocument[] = [
  {
    id: 'kb-1',
    title: 'Payment troubleshooting & timeout runbook',
    type: 'Runbook',
    updatedAt: 'Today',
    author: 'Yash Borole',
    tags: ['Payment', 'Stripe', 'Database', 'Runbook'],
    summary: 'Standard operating procedure for handling Payment API latency degradation and gateway timeouts.',
    content: `# Payment Troubleshooting Runbook

## 1. Quick Diagnostics
- Check database connection pool: \`SELECT count(*) FROM pg_stat_activity WHERE state = 'active';\`
- Inspect payment gateway health status on Stripe / provider dashboard.
- Verify Redis cache cluster latency.

## 2. Mitigation Steps
1. Scale payment worker instances up by 2x.
2. If DB pool is saturated (>90%), increase \`POOL_SIZE\` in config and run rolling restart.
3. Check for long-running unindexed queries holding table locks.
`
  },
  {
    id: 'kb-2',
    title: 'Database connection pool sizing and tuning guide',
    type: 'Runbook',
    updatedAt: 'Yesterday',
    author: 'Database Team',
    tags: ['PostgreSQL', 'Connection Pool', 'Performance'],
    summary: 'Best practices for configuring connection pools with SQLAlchemy and PgBouncer.',
    content: `# Database Connection Pool Tuning

Calculated formula for optimal pool size:
\`\`\`
connections = ((core_count * 2) + effective_spindle_count)
\`\`\`

Always ensure that your web application closes sessions with a context manager (\`with db:\`) to avoid orphan leaks.`
  },
  {
    id: 'kb-3',
    title: 'Production deployment guide & rollback procedures',
    type: 'Documentation',
    updatedAt: '3 days ago',
    author: 'DevOps Lead',
    tags: ['CI/CD', 'Deployments', 'Rollback'],
    summary: 'Zero-downtime deployment guidelines, canary testing, and automated rollback triggers.',
    content: `# Deployment & Rollback Guide

Before promoting a release to production:
- Ensure database migrations have backwards compatibility.
- Run integration test suites against staging environment.
- In case of >2% error rate spike, execute instant automated rollback via CLI.`
  },
  {
    id: 'kb-4',
    title: 'INC-782 Post-Mortem & Resolution Report',
    type: 'Incident',
    updatedAt: '1 week ago',
    author: 'Yash Borole',
    tags: ['Post-Mortem', 'Incident', 'Flash Sale'],
    summary: 'Detailed RCA and preventive actions from the connection timeout incident during flash sale.',
    content: `# Post-Mortem: INC-782

**Root Cause**: Database pool exhaustion caused by sudden surge in checkout requests.
**Resolution**: Scaled connection pool to 60 connections and introduced circuit breaker.`
  }
];

export const sampleLogs: LogEntry[] = [
  { id: 'log-1', timestamp: '2026-08-28T14:32:01Z', timeDisplay: '14:32:01', severity: 'INFO', service: 'Friend E-commerce', message: 'GET /products 200 OK (24ms)' },
  { id: 'log-2', timestamp: '2026-08-28T14:32:02Z', timeDisplay: '14:32:02', severity: 'INFO', service: 'Orders API', message: 'POST /orders 201 Created (142ms)' },
  { id: 'log-3', timestamp: '2026-08-28T14:32:03Z', timeDisplay: '14:32:03', severity: 'ERROR', service: 'Payment API', message: 'MongoDB connection timeout after 5000ms' },
  { id: 'log-4', timestamp: '2026-08-28T14:32:04Z', timeDisplay: '14:32:04', severity: 'ERROR', service: 'Payment API', message: 'POST /payment 500 Internal Server Error (5012ms)' },
  { id: 'log-5', timestamp: '2026-08-28T14:32:05Z', timeDisplay: '14:32:05', severity: 'ERROR', service: 'Payment API', message: 'Database connection pool exhausted: active=49/50 waiting=23' },
  { id: 'log-6', timestamp: '2026-08-28T14:32:06Z', timeDisplay: '14:32:06', severity: 'WARN', service: 'Payment API', message: 'Circuit breaker tripped for payment gateway downstream' },
  { id: 'log-7', timestamp: '2026-08-28T14:32:08Z', timeDisplay: '14:32:08', severity: 'INFO', service: 'Inventory API', message: 'GET /inventory/sku-4921 200 OK (18ms)' },
  { id: 'log-8', timestamp: '2026-08-28T14:32:10Z', timeDisplay: '14:32:10', severity: 'ERROR', service: 'Payment API', message: 'sqlalchemy.exc.TimeoutError: QueuePool limit of size 20 overflow 10 reached' },
  { id: 'log-9', timestamp: '2026-08-28T14:32:12Z', timeDisplay: '14:32:12', severity: 'INFO', service: 'Auth API', message: 'POST /auth/verify-token 200 OK (12ms)' },
  { id: 'log-10', timestamp: '2026-08-28T14:32:15Z', timeDisplay: '14:32:15', severity: 'WARN', service: 'Orders API', message: 'Order checkout deferred due to payment retry queue' }
];

export const sampleMetrics: MetricDataPoint[] = [
  { timestamp: '14:00', requests: 8200, errorRate: 0.2, latencyMs: 120, p95Ms: 210 },
  { timestamp: '14:05', requests: 9100, errorRate: 0.3, latencyMs: 125, p95Ms: 220 },
  { timestamp: '14:10', requests: 10400, errorRate: 0.2, latencyMs: 130, p95Ms: 230 },
  { timestamp: '14:15', requests: 11200, errorRate: 0.4, latencyMs: 135, p95Ms: 240 },
  { timestamp: '14:20', requests: 12500, errorRate: 0.5, latencyMs: 140, p95Ms: 250 }, // Deployment v1.4.2
  { timestamp: '14:25', requests: 14200, errorRate: 1.8, latencyMs: 290, p95Ms: 580 }, // Latency spikes
  { timestamp: '14:28', requests: 15800, errorRate: 4.2, latencyMs: 380, p95Ms: 790 },
  { timestamp: '14:30', requests: 16400, errorRate: 8.4, latencyMs: 420, p95Ms: 980 }, // Peak incident
  { timestamp: '14:35', requests: 15100, errorRate: 6.2, latencyMs: 390, p95Ms: 820 },
  { timestamp: '14:40', requests: 13900, errorRate: 3.1, latencyMs: 260, p95Ms: 510 },
  { timestamp: '14:45', requests: 12800, errorRate: 1.2, latencyMs: 190, p95Ms: 320 },
  { timestamp: '14:50', requests: 12100, errorRate: 0.4, latencyMs: 145, p95Ms: 230 }
];

export const sampleReliabilityMetrics: ReliabilityMetrics = {
  mttdMinutes: 4,
  mttrMinutes: 38,
  availabilityPercent: 99.82,
  totalIncidents: 24,
  resolvedIncidents: 21,
  openIncidents: 3
};
