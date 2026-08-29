import React from 'react';
import { Link } from 'react-router-dom';
import { Application } from '../../types/application';
import { Badge } from '../common/Badge';
import { ExternalLink, ArrowRight } from 'lucide-react';

interface ApplicationTableProps {
  applications: Application[];
}

export const ApplicationTable: React.FC<ApplicationTableProps> = ({ applications }) => {
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-800/80 bg-[#111827]">
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/90 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            <th className="px-5 py-4">Application Name</th>
            <th className="px-5 py-4">Technology</th>
            <th className="px-5 py-4">Environment</th>
            <th className="px-5 py-4">Status</th>
            <th className="px-5 py-4">Uptime</th>
            <th className="px-5 py-4">Error Rate</th>
            <th className="px-5 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-medium">
          {applications.map((app) => (
            <tr key={app.id} className="hover:bg-slate-800/40 transition-colors group">
              <td className="px-5 py-4">
                <Link
                  to={`/dashboard/applications/${app.id}`}
                  className="font-semibold text-white group-hover:text-indigo-400 flex items-center gap-2"
                >
                  <span>{app.name}</span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Link>
                <span className="text-xs text-slate-500 font-mono">{app.baseUrl}</span>
              </td>
              <td className="px-5 py-4">
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                  {app.technology}
                </span>
              </td>
              <td className="px-5 py-4">
                <span className="text-xs font-semibold text-slate-400">{app.environment}</span>
              </td>
              <td className="px-5 py-4">
                <Badge variant={app.status} dot>
                  {app.status === 'healthy' ? 'Healthy' : app.status === 'degraded' ? 'Degraded' : 'Critical'}
                </Badge>
              </td>
              <td className="px-5 py-4 font-mono text-slate-200">{app.uptime}%</td>
              <td className="px-5 py-4 font-mono">
                <span className={app.errorRate > 1.0 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                  {app.errorRate}%
                </span>
              </td>
              <td className="px-5 py-4 text-right">
                <Link
                  to={`/dashboard/applications/${app.id}`}
                  className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                >
                  View Details
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
