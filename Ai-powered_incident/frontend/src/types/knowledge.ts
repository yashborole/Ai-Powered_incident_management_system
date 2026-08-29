export type DocumentType = 'Runbook' | 'Documentation' | 'Incident' | 'Architecture';

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: DocumentType;
  updatedAt: string;
  author: string;
  tags: string[];
  summary: string;
  content: string;
}
