import { apiClient } from './client';
import { KnowledgeDocument } from '../types/knowledge';
import { initialKnowledgeDocuments } from './mockData';

export const knowledgeApi = {
  getDocuments: async (): Promise<KnowledgeDocument[]> => {
    try {
      const response = await apiClient.get<KnowledgeDocument[]>('/knowledge/');
      if (Array.isArray(response.data) && response.data.length > 0) {
        return response.data;
      }
    } catch (e) {
      console.warn('Backend /knowledge/ offline, using cached');
    }
    return initialKnowledgeDocuments;
  },

  getDocumentById: async (id: string): Promise<KnowledgeDocument | undefined> => {
    try {
      const response = await apiClient.get<KnowledgeDocument>(`/knowledge/${id}`);
      if (response.data) return response.data;
    } catch (e) {
      console.warn(`Backend /knowledge/${id} offline, using fallback`);
    }
    return initialKnowledgeDocuments.find((d) => d.id === id);
  },

  createDocument: async (doc: Omit<KnowledgeDocument, 'id' | 'updatedAt'>): Promise<KnowledgeDocument> => {
    try {
      const response = await apiClient.post<KnowledgeDocument>('/knowledge/', doc);
      if (response.data) return response.data;
    } catch (e) {
      console.warn('Backend create knowledge doc offline, creating locally');
    }
    const newDoc: KnowledgeDocument = {
      ...doc,
      id: `kb-${Date.now().toString().slice(-4)}`,
      updatedAt: 'Just now'
    };
    return newDoc;
  }
};
