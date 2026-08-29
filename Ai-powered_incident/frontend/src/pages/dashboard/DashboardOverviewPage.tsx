import React, { useEffect, useState } from 'react';
import { HealthCard } from '../../components/dashboard/HealthCard';
import { AIInsightCard } from '../../components/dashboard/AIInsightCard';
import { MetricAreaChart } from '../../components/charts/MetricAreaChart';
import { LatencyLineChart } from '../../components/charts/LatencyLineChart';
import { applicationApi } from '../../api/applicationApi';
import { incidentApi } from '../../api/incidentApi';
import { metricsApi } from '../../api/metricsApi';
import { Application } from '../../types/application';
import { Incident } from '../../types/incident';
import { MetricDataPoint } from '../../types/analytics';
import { Badge } from '../../components/common/Badge';
import { Link } from 'react-router-dom';
import { ArrowRight, Layers, TrendingUp, AlertTriangle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [apps, setApps] = useState<Application[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);

  useEffect(() => {
    applicationApi.getApplications().then(setApps);
    incidentApi.getIncidents().then(setIncidents);
    metricsApi.getPerformanceMetrics('1h').then(setMetrics);
  }, []);

  const totalApps = apps.length || 4;
  const healthyApps = apps.filter((a) => a.status === 'healthy').length || 3;
  const totalIncidents = incidents.length || 4;
  const criticalIncidents = incidents.filter((i) => i.severity === 'CRITICAL' || i.severity === 'HIGH').length || 1;

  const activeIncidents = incidents.filter((i) => i.status !== 'RESOLVED').slice(0, 3);

  return (
    <div className="space-y-8">
      {/* Header Greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">Dashboard</h1>
        <p className="text-sm text-slate-400 mt-1">
          Good afternoon, <span className="text-indigo-300 font-semibold">{user?.name || 'Yash'}</span>. Here's the current health of your applications.
        </p>
      </div>

      {/* Summary Cards */}
      <HealthCard
        totalApps={totalApps}
        healthyApps={healthyApps}
        totalIncidents={totalIncidents}
        criticalIncidents={criticalIncidents}
      />

      {/* Main Grid: Health Table + AI Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Application Health Table */}
        <div className="lg:col-span-2 bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-white tracking-wide uppercase text-xs text-indigo-400">
                APPLICATION HEALTH
              </h3>
              <p className="text-xs text-slate-400">Real-time status of monitored services</p>
            </div>
            <Link
              to="/dashboard/applications"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3">Application</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Uptime</th>
                  <th className="px-4 py-3">Error Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-xs">
                {apps.slice(0, 4).map((app) => (
                  <tr key={app.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-white">
                      <Link to={`/dashboard/applications/${app.id}`} className="hover:text-indigo-400">
                        {app.name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={app.status} dot size="sm">
                        {app.status === 'healthy' ? 'Healthy' : app.status === 'degraded' ? 'Degraded' : 'Critical'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 font-mono text-slate-200">{app.uptime}%</td>
                    <td className="px-4 py-3 font-mono">
                      <span className={app.errorRate > 1.0 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {app.errorRate}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insight Card */}
        <div className="lg:col-span-1">
          <AIInsightCard />
        </div>
      </div>

      {/* Telemetry Charts: Request Volume + Error Rate / Latency */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400">
                REQUEST VOLUME
              </h3>
              <p className="text-xs text-slate-400">Aggregate throughput across all microservices</p>
            </div>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/40">
              125,430 total req
            </span>
          </div>
          <MetricAreaChart data={metrics} dataKey="requests" color="#6366f1" height={220} unit=" req" />
        </div>

        <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400">
                LATENCY & ERROR RATE
              </h3>
              <p className="text-xs text-slate-400">Average response times and spike markers</p>
            </div>
            <span className="text-xs font-mono text-amber-400 bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/40">
              Spike peak: 8.4%
            </span>
          </div>
          <LatencyLineChart data={metrics} height={220} />
        </div>
      </div>

      {/* Active Incidents Section */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-red-400 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span>ACTIVE INCIDENTS</span>
            </h3>
            <p className="text-xs text-slate-400">Ongoing investigations requiring team attention</p>
          </div>
          <Link
            to="/dashboard/incidents"
            className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
          >
            <span>View All Incidents</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900/80 text-[11px] uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-3">ID</th>
                <th className="px-4 py-3">Application</th>
                <th className="px-4 py-3">Severity</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50 text-xs">
              {activeIncidents.map((inc) => (
                <tr key={inc.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-4 py-3 font-mono font-bold text-white">
                    <Link to={`/dashboard/incidents/${inc.id}`} className="hover:text-indigo-400">
                      {inc.id}
                    </Link>
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-200">{inc.applicationName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={inc.severity === 'HIGH' || inc.severity === 'CRITICAL' ? 'critical' : 'degraded'}>
                      {inc.severity}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant={inc.status === 'INVESTIGATING' ? 'investigating' : 'open'} dot>
                      {inc.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      to={`/dashboard/incidents/${inc.id}`}
                      className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 hover:underline"
                    >
                      Investigate →
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
