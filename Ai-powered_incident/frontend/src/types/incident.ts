export type IncidentSeverity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
export type IncidentStatus = 'OPEN' | 'INVESTIGATING' | 'MITIGATED' | 'RESOLVED';

export interface TimelineEvent {
  time: string;
  type: 'DEPLOYMENT' | 'METRIC_SPIKE' | 'ERROR_SPIKE' | 'DETECTION' | 'ACTION' | 'NOTE';
  title: string;
  description?: string;
  severity?: 'info' | 'warning' | 'danger';
}

export interface SimilarIncident {
  id: string;
  title: string;
  similarity: number; // e.g. 91 (for 91%)
  previousResolution: string;
  resolvedAt: string;
}

export interface AIHypothesis {
  title: string;
  confidence: number; // e.g. 87 (for 87%)
  summary: string;
  evidence: string[];
  whyHypothesis: string[];
  recommendedActions: {
    id: string;
    text: string;
    completed: boolean;
  }[];
  similarIncidents: SimilarIncident[];
  suggestedRootCause: string;
  suggestedResolution: string;
  suggestedPreventiveAction: string;
}

export interface Incident {
  id: string; // e.g. "INC-1045"
  applicationId: string;
  applicationName: string;
  serviceName: string;
  title: string;
  severity: IncidentSeverity;
  status: IncidentStatus;
  detectedAt: string;
  startedAt: string;
  resolvedAt?: string;
  description: string;
  timeline: TimelineEvent[];
  aiInvestigation?: AIHypothesis;
  resolutionNotes?: {
    rootCause: string;
    resolution: string;
    preventiveAction: string;
    resolvedBy: string;
    resolvedAt: string;
  };
}
