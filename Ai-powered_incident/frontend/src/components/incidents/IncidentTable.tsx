import React from 'react';
import { Link } from 'react-router-dom';
import { Incident } from '../../types/incident';
import { Badge } from '../common/Badge';
import { Sparkles, ArrowRight } from 'lucide-react';

interface IncidentTableProps {
  incidents: Incident[];
}

export const IncidentTable: React.FC<IncidentTableProps> = ({ incidents }) => {
  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case 'CRITICAL':
        return <Badge variant="critical">CRITICAL</Badge>;
      case 'HIGH':
        return <Badge variant="critical">HIGH</Badge>;
      case 'MEDIUM':
        return <Badge variant="degraded">MEDIUM</Badge>;
      case 'LOW':
        return <Badge variant="info">LOW</Badge>;
      default:
        return <Badge variant="neutral">{severity}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'INVESTIGATING':
        return <Badge variant="investigating" dot>INVESTIGATING</Badge>;
      case 'OPEN':
        return <Badge variant="open" dot>OPEN</Badge>;
      case 'RESOLVED':
        return <Badge variant="resolved" dot>RESOLVED</Badge>;
      default:
        return <Badge variant="neutral">{status}</Badge>;
    }
  };

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#111827]">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            <th className="px-5 py-4">Incident ID</th>
            <th className="px-5 py-4">Application</th>
            <th className="px-5 py-4">Service</th>
            <th className="px-5 py-4">Severity</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Detected</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-medium">
          {incidents.map((inc) => (
            <tr key={inc.id} className="hover:bg-slate-800/40 transition-colors group">
              <td className="px-5 py-4">
                <Link
                  to={`/dashboard/incidents/${inc.id}`}
                  className="font-mono font-bold text-white group-hover:text-indigo-400 flex items-center gap-1.5"
                >
                  <span>{inc.id}</span>
                  {inc.aiInvestigation && (
                    <Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                  )}
                </Link>
                <p className="text-xs text-slate-400 truncate max-w-xs">{inc.title}</p>
              </td>
              <td className="px-5 py-4 text-slate-200">{inc.applicationName}</td>
              <td className="px-5 py-4 font-mono text-xs text-slate-400">{inc.serviceName}</td>
              <td className="px-5 py-4">{getSeverityBadge(inc.severity)}</td>
              <td className="px-5 py-4">{getStatusBadge(inc.status)}</td>
              <td className="px-5 py-4 text-xs text-slate-400">{inc.detectedAt}</td>
              <td className="px-5 py-4 text-right">
                <Link
                  to={`/dashboard/incidents/${inc.id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline inline-flex items-center gap-1"
                >
                  <span>Investigate</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
