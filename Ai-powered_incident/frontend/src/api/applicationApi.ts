import { apiClient } from './client';
import { Application, ApplicationCreateInput, Service } from '../types/application';
import { initialApplications } from './mockData';

export const applicationApi = {
  getApplications: async (): Promise<Application[]> => {
    try {
      const response = await apiClient.get<Application[]>('/applications/');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      console.warn('Backend /applications/ offline, using cached/mock data');
    }
    return initialApplications;
  },

  getApplicationById: async (id: string): Promise<Application | undefined> => {
    try {
      const response = await apiClient.get<Application>(`/applications/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn(`Backend /applications/${id} offline, using fallback`);
    }
    return initialApplications.find((a) => a.id === id);
  },

  createApplication: async (input: ApplicationCreateInput): Promise<Application> => {
    try {
      const response = await apiClient.post<Application>('/applications/', input);
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend createApplication offline, creating locally');
    }
    const newApp: Application = {
      id: `app-${input.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      name: input.name,
      technology: input.technology,
      environment: input.environment,
      status: 'healthy',
      uptime: 99.9,
      errorRate: 0.0,
      requestsCount: 0,
      avgLatencyMs: 80,
      baseUrl: input.baseUrl,
      description: input.description,
      createdAt: new Date().toISOString(),
      services: [
        {
          id: `srv-${Date.now().toString().slice(-4)}`,
          name: `${input.name} Core Service`,
          requests: 0,
          latencyMs: 80,
          errorRate: 0.0,
          status: 'healthy',
        }
      ],
      deployments: [
        {
          id: `dep-${Date.now().toString().slice(-4)}`,
          version: 'v1.0.0',
          commitHash: 'init001',
          author: 'Yash Borole',
          timestamp: 'Just now',
          status: 'SUCCESS',
          summary: 'Initial application deployment',
        }
      ]
    };
    return newApp;
  },

  addServiceToApplication: async (appId: string, serviceName: string): Promise<Service> => {
    try {
      const response = await apiClient.post<Service>(`/applications/${appId}/services`, { name: serviceName });
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend addService offline, adding locally');
    }
    return {
      id: `srv-${Date.now().toString().slice(-4)}`,
      name: serviceName,
      requests: 1200,
      latencyMs: 95,
      errorRate: 0.0,
      status: 'healthy',
      lastUpdated: 'Just now'
    };
  }
};
