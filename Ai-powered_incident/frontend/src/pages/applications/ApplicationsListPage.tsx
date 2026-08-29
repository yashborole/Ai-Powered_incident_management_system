import React, { useState, useEffect } from 'react';
import { applicationApi } from '../../api/applicationApi';
import { Application, ApplicationCreateInput } from '../../types/application';
import { ApplicationTable } from '../../components/applications/ApplicationTable';
import { ApplicationFormModal } from '../../components/applications/ApplicationFormModal';
import { PageHeader } from '../../components/layout/PageHeader';
import { Button } from '../../components/common/Button';
import { Plus, Search, Filter } from 'lucide-react';

export const ApplicationsListPage: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [envFilter, setEnvFilter] = useState('ALL');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    applicationApi.getApplications().then(setApplications);
  }, []);

  const handleCreateApplication = async (data: ApplicationCreateInput) => {
    const created = await applicationApi.createApplication(data);
    setApplications((prev) => [created, ...prev]);
  };

  const filteredApplications = applications.filter((app) => {
    const matchSearch =
      app.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.technology.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.baseUrl.toLowerCase().includes(searchQuery.toLowerCase());
    const matchEnv = envFilter === 'ALL' || app.environment === envFilter;
    return matchSearch && matchEnv;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Applications"
        subtitle="Manage and monitor health of connected microservices and platforms"
        action={
          <Button
            onClick={() => setIsModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Application
          </Button>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#111827] p-4 rounded-xl border border-slate-800">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Environment:
          </span>
          <select
            value={envFilter}
            onChange={(e) => setEnvFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Environments</option>
            <option value="TEST">TEST</option>
            <option value="PRODUCTION">PRODUCTION</option>
            <option value="STAGING">STAGING</option>
            <option value="DEV">DEV</option>
          </select>
        </div>
      </div>

      {/* Applications Table */}
      <ApplicationTable applications={filteredApplications} />

      {/* Add Application Modal */}
      <ApplicationFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateApplication}
      />
    </div>
  );
};
