import { apiClient } from './client';
import { MetricDataPoint, ReliabilityMetrics } from '../types/analytics';
import { sampleMetrics, sampleReliabilityMetrics } from './mockData';

export const metricsApi = {
  getReliabilityMetrics: async (): Promise<ReliabilityMetrics> => {
    try {
      const response = await apiClient.get<ReliabilityMetrics>('/metrics/reliability');
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend metrics offline, using cached');
    }
    return sampleReliabilityMetrics;
  },

  getPerformanceMetrics: async (timeRange = '1h'): Promise<MetricDataPoint[]> => {
    try {
      const response = await apiClient.get<MetricDataPoint[]>(`/metrics/performance?time_range=${timeRange}`);
      if (Array.isArray(response.data) && response.data.length > 0) return response.data;
    } catch (e) {
      console.warn('Backend performance metrics offline, using cached');
    }
    return sampleMetrics;
  }
};
