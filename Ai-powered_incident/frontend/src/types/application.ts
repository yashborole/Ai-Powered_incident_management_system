export type HealthStatus = 'healthy' | 'degraded' | 'critical';
export type Environment = 'PRODUCTION' | 'STAGING' | 'TEST' | 'DEV';

export interface Service {
  id: string;
  name: string;
  requests: number;
  latencyMs: number;
  errorRate: number;
  status: HealthStatus;
  lastUpdated?: string;
}

export interface Deployment {
  id: string;
  version: string;
  commitHash: string;
  author: string;
  timestamp: string;
  status: 'SUCCESS' | 'FAILED' | 'ROLLED_BACK';
  summary: string;
  associatedIncidentId?: string;
}

export interface Application {
  id: string;
  name: string;
  technology: string; // 'MERN' | 'FastAPI' | 'Node.js' | 'Go' | 'Python'
  environment: Environment;
  status: HealthStatus;
  uptime: number; // e.g. 99.8
  errorRate: number; // e.g. 0.4
  requestsCount: number; // e.g. 125430
  avgLatencyMs: number; // e.g. 182
  baseUrl: string;
  description: string;
  services: Service[];
  deployments: Deployment[];
  createdAt: string;
}

export interface ApplicationCreateInput {
  name: string;
  technology: string;
  baseUrl: string;
  environment: Environment;
  description: string;
}
