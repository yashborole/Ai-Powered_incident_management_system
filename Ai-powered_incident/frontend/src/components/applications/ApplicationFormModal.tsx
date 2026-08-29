import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { ApplicationCreateInput, Environment } from '../../types/application';

interface ApplicationFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ApplicationCreateInput) => Promise<void>;
}

export const ApplicationFormModal: React.FC<ApplicationFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState<ApplicationCreateInput>({
    name: '',
    technology: 'MERN',
    baseUrl: 'http://localhost:5000',
    environment: 'TEST',
    description: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    setIsLoading(true);
    try {
      await onSubmit(formData);
      onClose();
      setFormData({
        name: '',
        technology: 'MERN',
        baseUrl: 'http://localhost:5000',
        environment: 'TEST',
        description: '',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add Application" subtitle="Register a new application service for automated monitoring">
      <form onSubmit={handleSubmit} className="space-y-4 text-sm">
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Application Name
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Friend E-commerce"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Technology
            </label>
            <select
              value={formData.technology}
              onChange={(e) => setFormData({ ...formData, technology: e.target.value })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="MERN">MERN</option>
              <option value="Node.js">Node.js</option>
              <option value="FastAPI">FastAPI</option>
              <option value="Python">Python</option>
              <option value="Go">Go</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Environment
            </label>
            <select
              value={formData.environment}
              onChange={(e) => setFormData({ ...formData, environment: e.target.value as Environment })}
              className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="TEST">TEST</option>
              <option value="PRODUCTION">PRODUCTION</option>
              <option value="STAGING">STAGING</option>
              <option value="DEV">DEV</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Base URL
          </label>
          <input
            type="url"
            required
            placeholder="http://localhost:5000"
            value={formData.baseUrl}
            onChange={(e) => setFormData({ ...formData, baseUrl: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            placeholder="Brief purpose of this application..."
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Create Application
          </Button>
        </div>
      </form>
    </Modal>
  );
};
