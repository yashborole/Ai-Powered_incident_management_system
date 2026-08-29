import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { Incident } from '../../types/incident';

interface ResolutionModalProps {
  isOpen: boolean;
  onClose: () => void;
  incident: Incident;
  onResolve: (data: { rootCause: string; resolution: string; preventiveAction: string }) => Promise<void>;
}

export const ResolutionModal: React.FC<ResolutionModalProps> = ({
  isOpen,
  onClose,
  incident,
  onResolve,
}) => {
  const [rootCause, setRootCause] = useState(
    incident.aiInvestigation?.suggestedRootCause || 'Database connection pool exhaustion'
  );
  const [resolution, setResolution] = useState(
    incident.aiInvestigation?.suggestedResolution || 'Increased connection pool and restarted service'
  );
  const [preventiveAction, setPreventiveAction] = useState(
    incident.aiInvestigation?.suggestedPreventiveAction || 'Add connection monitoring'
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await onResolve({ rootCause, resolution, preventiveAction });
      onClose();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Resolve Incident ${incident.id}`}
      subtitle="Document root cause and remediation to populate the Knowledge Base"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Root Cause</label>
          <textarea
            rows={2}
            required
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Resolution Taken</label>
          <textarea
            rows={3}
            required
            value={resolution}
            onChange={(e) => setResolution(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">Preventive Action</label>
          <textarea
            rows={2}
            required
            value={preventiveAction}
            onChange={(e) => setPreventiveAction(e.target.value)}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" variant="success" isLoading={isLoading}>
            Resolve Incident & Save
          </Button>
        </div>
      </form>
    </Modal>
  );
};
