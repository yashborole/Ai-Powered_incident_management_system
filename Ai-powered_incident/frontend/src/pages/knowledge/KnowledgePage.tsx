import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { knowledgeApi } from '../../api/knowledgeApi';
import { KnowledgeDocument, DocumentType } from '../../types/knowledge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { Badge } from '../../components/common/Badge';
import { Plus, Search, BookOpen, FileText, Tag, ArrowRight } from 'lucide-react';

export const KnowledgePage: React.FC = () => {
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoc, setSelectedDoc] = useState<KnowledgeDocument | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<DocumentType>('Runbook');
  const [newSummary, setNewSummary] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newTags, setNewTags] = useState('Payment, Runbook');

  useEffect(() => {
    knowledgeApi.getDocuments().then(setDocuments);
  }, []);

  const handleCreateDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const doc = await knowledgeApi.createDocument({
      title: newTitle,
      type: newType,
      author: 'Yash Borole',
      summary: newSummary,
      content: newContent,
      tags: newTags.split(',').map((t) => t.trim()).filter(Boolean),
    });

    setDocuments((prev) => [doc, ...prev]);
    setIsAddModalOpen(false);
    setNewTitle('');
    setNewSummary('');
    setNewContent('');
  };

  const filteredDocs = documents.filter(
    (d) =>
      d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const getTypeBadge = (type: DocumentType) => {
    switch (type) {
      case 'Runbook':
        return <Badge variant="info">Runbook</Badge>;
      case 'Incident':
        return <Badge variant="critical">Incident</Badge>;
      case 'Documentation':
        return <Badge variant="healthy">Documentation</Badge>;
      default:
        return <Badge variant="neutral">{type}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Knowledge Base & Runbooks"
        subtitle="RAG-indexed incident resolutions, playbooks, and architecture runbooks"
        action={
          <Button
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsAddModalOpen(true)}
          >
            Add Document
          </Button>
        }
      />

      {/* Search Bar */}
      <div className="relative bg-[#111827] p-4 rounded-xl border border-slate-800">
        <Search className="w-4 h-4 absolute left-7 top-1/2 -translate-y-1/2 text-slate-500" />
        <input
          type="text"
          placeholder="Search knowledge by title, keyword, or service tag..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
        />
      </div>

      {/* Documents Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111827]">
        <table className="w-full text-left text-sm text-slate-300">
          <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
            <tr>
              <th className="px-5 py-4">Document Title</th>
              <th className="px-5 py-4">Type</th>
              <th className="px-5 py-4">Tags</th>
              <th className="px-5 py-4">Updated</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 font-medium">
            {filteredDocs.map((doc) => (
              <tr
                key={doc.id}
                onClick={() => setSelectedDoc(doc)}
                className="hover:bg-slate-800/40 cursor-pointer transition-colors group"
              >
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2.5">
                    <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                    <div>
                      <span className="font-semibold text-white group-hover:text-indigo-400">
                        {doc.title}
                      </span>
                      <p className="text-xs text-slate-400 line-clamp-1">{doc.summary}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4">{getTypeBadge(doc.type)}</td>
                <td className="px-5 py-4">
                  <div className="flex flex-wrap gap-1">
                    {doc.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-400 border border-slate-700"
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-5 py-4 text-xs text-slate-400">{doc.updatedAt}</td>
                <td className="px-5 py-4 text-right">
                  <span className="text-xs font-semibold text-indigo-400 group-hover:underline inline-flex items-center gap-1">
                    View
                    <ArrowRight className="w-3 h-3" />
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Document View Modal */}
      {selectedDoc && (
        <Modal
          isOpen={!!selectedDoc}
          onClose={() => setSelectedDoc(null)}
          title={selectedDoc.title}
          subtitle={`By ${selectedDoc.author} • Updated ${selectedDoc.updatedAt}`}
          maxWidth="2xl"
        >
          <div className="space-y-4 text-xs sm:text-sm text-slate-300">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-800">
              {getTypeBadge(selectedDoc.type)}
              {selectedDoc.tags.map((t, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded bg-slate-800 text-[11px] text-slate-400 border border-slate-700"
                >
                  #{t}
                </span>
              ))}
            </div>

            <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 leading-relaxed font-mono whitespace-pre-line text-slate-200">
              {selectedDoc.content}
            </div>

            <div className="flex justify-end pt-3">
              <Button variant="secondary" size="sm" onClick={() => setSelectedDoc(null)}>
                Close
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Add Document Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add Knowledge Base Document"
        subtitle="Document a runbook, architecture guide, or troubleshooting playbook"
        maxWidth="lg"
      >
        <form onSubmit={handleCreateDocument} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Document Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Redis Cluster Failover Runbook"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Document Type</label>
              <select
                value={newType}
                onChange={(e) => setNewType(e.target.value as DocumentType)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs focus:outline-none focus:border-indigo-500"
              >
                <option value="Runbook">Runbook</option>
                <option value="Documentation">Documentation</option>
                <option value="Incident">Incident Post-Mortem</option>
                <option value="Architecture">Architecture</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                placeholder="Database, PostgreSQL, Tuning"
                value={newTags}
                onChange={(e) => setNewTags(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Summary</label>
            <input
              type="text"
              required
              placeholder="Brief 1-sentence overview"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Content (Markdown)</label>
            <textarea
              rows={6}
              required
              placeholder="Write Markdown documentation or runbook steps..."
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs font-mono"
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Save Document
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
