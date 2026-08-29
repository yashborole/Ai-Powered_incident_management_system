import { apiClient } from './client';
import { Incident, IncidentStatus } from '../types/incident';
import { initialIncidents } from './mockData';

export const incidentApi = {
  getIncidents: async (): Promise<Incident[]> => {
    try {
      const response = await apiClient.get<Incident[]>('/incidents/');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      console.warn('Backend /incidents/ offline, using cached/mock data');
    }
    return initialIncidents;
  },

  getIncidentById: async (id: string): Promise<Incident | undefined> => {
    try {
      const response = await apiClient.get<Incident>(`/incidents/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn(`Backend /incidents/${id} offline, using fallback`);
    }
    return initialIncidents.find((inc) => inc.id === id);
  },

  updateIncidentStatus: async (id: string, status: IncidentStatus): Promise<Incident> => {
    try {
      const response = await apiClient.patch<Incident>(`/incidents/${id}/status`, { status });
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend updateStatus offline, updating locally');
    }
    const incident = initialIncidents.find((inc) => inc.id === id)!;
    incident.status = status;
    return incident;
  },

  resolveIncident: async (
    id: string,
    data: { rootCause: string; resolution: string; preventiveAction: string }
  ): Promise<Incident> => {
    try {
      const response = await apiClient.post<Incident>(`/incidents/${id}/resolve`, data);
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend resolveIncident offline, resolving locally');
    }
    const incident = initialIncidents.find((inc) => inc.id === id)!;
    incident.status = 'RESOLVED';
    incident.resolvedAt = 'Just now';
    return incident;
  },

  toggleActionItem: async (incidentId: string, actionId: string): Promise<Incident> => {
    try {
      const response = await apiClient.patch<Incident>(`/incidents/${incidentId}/actions/${actionId}`, {});
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend toggleAction offline, toggling locally');
    }
    const incident = initialIncidents.find((inc) => inc.id === incidentId)!;
    if (incident?.aiInvestigation) {
      const action = incident.aiInvestigation.recommendedActions.find(a => a.id === actionId);
      if (action) action.completed = !action.completed;
    }
    return incident;
  }
};
