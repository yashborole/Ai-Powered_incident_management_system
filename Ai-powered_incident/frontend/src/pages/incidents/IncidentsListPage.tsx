import React, { useState, useEffect } from 'react';
import { incidentApi } from '../../api/incidentApi';
import { Incident, IncidentSeverity } from '../../types/incident';
import { IncidentTable } from '../../components/incidents/IncidentTable';
import { PageHeader } from '../../components/layout/PageHeader';
import { Search, Filter, AlertTriangle } from 'lucide-react';

export const IncidentsListPage: React.FC = () => {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  useEffect(() => {
    incidentApi.getIncidents().then(setIncidents);
  }, []);

  const severityPills = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];

  const filteredIncidents = incidents.filter((inc) => {
    const matchSearch =
      inc.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.applicationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inc.serviceName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchSeverity = severityFilter === 'ALL' || inc.severity === severityFilter;
    const matchStatus = statusFilter === 'ALL' || inc.status === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="Incidents"
        subtitle="Active anomaly detection alerts, telemetry diagnostics, and post-mortems"
      />

      {/* Severity Filter Pills and Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-[#111827] p-4 rounded-xl border border-slate-800">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
          {severityPills.map((pill) => (
            <button
              key={pill}
              onClick={() => setSeverityFilter(pill)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                severityFilter === pill
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
              }`}
            >
              {pill === 'ALL' ? 'All Severities' : pill}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search incidents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="INVESTIGATING">INVESTIGATING</option>
            <option value="OPEN">OPEN</option>
            <option value="RESOLVED">RESOLVED</option>
          </select>
        </div>
      </div>

      {/* Incidents Table */}
      <IncidentTable incidents={filteredIncidents} />
    </div>
  );
};
