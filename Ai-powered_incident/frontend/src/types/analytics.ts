export interface ReliabilityMetrics {
  mttdMinutes: number; // Mean Time to Detect
  mttrMinutes: number; // Mean Time to Resolve
  availabilityPercent: number; // 99.82%
  totalIncidents: number; // 24
  resolvedIncidents: number; // 21
  openIncidents: number; // 3
}

export interface MetricDataPoint {
  timestamp: string;
  requests: number;
  errorRate: number;
  latencyMs: number;
  p95Ms: number;
}
