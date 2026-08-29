export type LogSeverity = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';

export interface LogEntry {
  id: string;
  timestamp: string;
  timeDisplay: string; // e.g. "14:32:01"
  severity: LogSeverity;
  service: string;
  message: string;
  applicationId?: string;
  traceId?: string;
}
