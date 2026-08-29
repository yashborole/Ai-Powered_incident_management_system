import { apiClient } from './client';
import { LogEntry } from '../types/logs';
import { sampleLogs } from './mockData';

export const logsApi = {
  getLogs: async (appId?: string): Promise<LogEntry[]> => {
    try {
      const response = await apiClient.get<LogEntry[]>('/logs/');
      if (Array.isArray(response.data) && response.data.length > 0) return response.data;
    } catch (e) {
      console.warn('Backend /logs/ offline, using cached');
    }
    return sampleLogs;
  },

  searchLogs: async (query: string, severity?: string, service?: string): Promise<LogEntry[]> => {
    try {
      const params = new URLSearchParams();
      if (query) params.append('query', query);
      if (severity && severity !== 'ALL') params.append('severity', severity);
      if (service && service !== 'ALL') params.append('service', service);

      const response = await apiClient.get<LogEntry[]>(`/logs/?${params.toString()}`);
      if (Array.isArray(response.data)) return response.data;
    } catch (e) {
      console.warn('Backend searchLogs offline, using local filter');
    }
    return sampleLogs.filter((log) => {
      const matchQuery = !query || log.message.toLowerCase().includes(query.toLowerCase()) || log.service.toLowerCase().includes(query.toLowerCase());
      const matchSeverity = !severity || severity === 'ALL' || log.severity === severity;
      const matchService = !service || service === 'ALL' || log.service === service;
      return matchQuery && matchSeverity && matchService;
    });
  }
};
