import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { applicationApi } from '../../api/applicationApi';
import { incidentApi } from '../../api/incidentApi';
import { metricsApi } from '../../api/metricsApi';
import { logsApi } from '../../api/logsApi';
import { Application, Service } from '../../types/application';
import { Incident } from '../../types/incident';
import { MetricDataPoint } from '../../types/analytics';
import { LogEntry } from '../../types/logs';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { Modal } from '../../components/common/Modal';
import { MetricAreaChart } from '../../components/charts/MetricAreaChart';
import { LatencyLineChart } from '../../components/charts/LatencyLineChart';
import {
  ArrowLeft,
  Activity,
  Server,
  Zap,
  Terminal,
  AlertTriangle,
  GitBranch,
  Settings as SettingsIcon,
  Plus,
  Search,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';

export const ApplicationDetailPage: React.FC = () => {
  const { applicationId } = useParams<{ applicationId: string }>();
  const [app, setApp] = useState<Application | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'services' | 'performance' | 'logs' | 'incidents' | 'deployments' | 'settings'
  >('overview');

  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [timeRange, setTimeRange] = useState('Last 1 hour');
  const [logQuery, setLogQuery] = useState('');
  const [logSeverity, setLogSeverity] = useState('ALL');

  // Add Service Modal
  const [isAddServiceOpen, setIsAddServiceOpen] = useState(false);
  const [newServiceName, setNewServiceName] = useState('');

  useEffect(() => {
    if (applicationId) {
      applicationApi.getApplicationById(applicationId).then((data) => {
        if (data) setApp(data);
      });
      metricsApi.getPerformanceMetrics(timeRange).then(setMetrics);
      logsApi.getLogs(applicationId).then(setLogs);
      incidentApi.getIncidents().then((all) => {
        setIncidents(all.filter((i) => i.applicationId === applicationId || i.applicationName.includes('E-commerce')));
      });
    }
  }, [applicationId, timeRange]);

  const handleAddService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newServiceName.trim() || !app) return;
    const s = await applicationApi.addServiceToApplication(app.id, newServiceName);
    setApp({ ...app, services: [...app.services, s] });
    setNewServiceName('');
    setIsAddServiceOpen(false);
  };

  if (!app) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Loading application details...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'services', label: 'Services', icon: Server },
    { id: 'performance', label: 'Performance', icon: Zap },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'incidents', label: 'Incidents', icon: AlertTriangle, badge: '1' },
    { id: 'deployments', label: 'Deployments', icon: GitBranch },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="space-y-6">
      {/* Breadcrumb & App Top Bar */}
      <div>
        <Link
          to="/dashboard/applications"
          className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1 mb-3"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Applications</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">{app.name}</h1>
            <Badge variant={app.status} dot size="md">
              {app.status === 'healthy' ? 'Healthy' : app.status === 'degraded' ? 'Degraded' : 'Critical'}
            </Badge>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-md bg-slate-800 text-xs font-mono text-slate-300 border border-slate-700">
              {app.technology} • {app.environment}
            </span>
            <a
              href={app.baseUrl}
              target="_blank"
              rel="noreferrer"
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs inline-flex items-center gap-1"
            >
              <span>{app.baseUrl}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 border-b border-slate-800 overflow-x-auto pb-px">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                isActive
                  ? 'border-indigo-500 text-indigo-400 bg-indigo-500/5'
                  : 'border-transparent text-slate-400 hover:text-slate-200 hover:border-slate-700'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-red-950 text-red-400 border border-red-800">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics row */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase">Uptime</p>
              <h3 className="text-2xl font-bold text-white mt-1 font-mono">{app.uptime}%</h3>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase">Requests</p>
              <h3 className="text-2xl font-bold text-indigo-400 mt-1 font-mono">
                {app.requestsCount.toLocaleString()}
              </h3>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase">Error Rate</p>
              <h3 className={`text-2xl font-bold mt-1 font-mono ${app.errorRate > 1 ? 'text-red-400' : 'text-emerald-400'}`}>
                {app.errorRate}%
              </h3>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase">Avg Latency</p>
              <h3 className="text-2xl font-bold text-amber-400 mt-1 font-mono">{app.avgLatencyMs}ms</h3>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
                REQUEST VOLUME
              </h3>
              <MetricAreaChart data={metrics} height={200} />
            </div>

            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
              <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-4">
                RESPONSE TIME & LATENCY
              </h3>
              <LatencyLineChart data={metrics} height={200} />
            </div>
          </div>

          {/* Service Health Grid */}
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                SERVICE HEALTH BREAKDOWN
              </h3>
              <button
                onClick={() => setActiveTab('services')}
                className="text-xs text-indigo-400 hover:underline font-semibold"
              >
                View all services →
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {app.services.map((srv) => (
                <div
                  key={srv.id}
                  className="p-3.5 rounded-lg bg-slate-900/80 border border-slate-800 flex items-center justify-between"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{srv.name}</p>
                    <p className="text-xs text-slate-400 font-mono mt-0.5">{srv.latencyMs}ms • {srv.errorRate}% err</p>
                  </div>
                  <Badge variant={srv.status} dot size="sm">
                    {srv.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: SERVICES */}
      {activeTab === 'services' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-bold text-white">Registered Microservices</h3>
              <p className="text-xs text-slate-400">Services that comprise the {app.name} platform</p>
            </div>
            <Button
              size="sm"
              leftIcon={<Plus className="w-4 h-4" />}
              onClick={() => setIsAddServiceOpen(true)}
            >
              Add Service
            </Button>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-800 bg-[#111827]">
            <table className="w-full text-left text-sm text-slate-300">
              <thead className="bg-slate-900 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-5 py-4">Service</th>
                  <th className="px-5 py-4">Requests</th>
                  <th className="px-5 py-4">Latency</th>
                  <th className="px-5 py-4">Errors</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 text-xs">
                {app.services.map((srv) => (
                  <tr key={srv.id} className="hover:bg-slate-800/30">
                    <td className="px-5 py-4 font-semibold text-white">{srv.name}</td>
                    <td className="px-5 py-4 font-mono">{srv.requests.toLocaleString()}</td>
                    <td className="px-5 py-4 font-mono text-amber-300">{srv.latencyMs}ms</td>
                    <td className="px-5 py-4 font-mono">
                      <span className={srv.errorRate > 1 ? 'text-red-400 font-bold' : 'text-slate-300'}>
                        {srv.errorRate}%
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={srv.status} dot size="sm">
                        {srv.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: PERFORMANCE */}
      {activeTab === 'performance' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between bg-[#111827] p-4 rounded-xl border border-slate-800">
            <div>
              <h3 className="text-sm font-bold text-white">Performance Telemetry</h3>
              <p className="text-xs text-slate-400">Real-time throughput and latency quantiles</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Time Range:</span>
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Last 1 hour">Last 1 hour</option>
                <option value="Last 6 hours">Last 6 hours</option>
                <option value="Last 24 hours">Last 24 hours</option>
                <option value="Last 7 days">Last 7 days</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400">Requests</p>
              <h3 className="text-xl font-bold text-white mt-1 font-mono">125,430</h3>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400">Avg Latency</p>
              <h3 className="text-xl font-bold text-sky-400 mt-1 font-mono">182 ms</h3>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400">P95 Latency</p>
              <h3 className="text-xl font-bold text-amber-400 mt-1 font-mono">420 ms</h3>
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
              <p className="text-xs font-semibold text-slate-400">Error Rate</p>
              <h3 className="text-xl font-bold text-red-400 mt-1 font-mono">0.8%</h3>
            </div>
          </div>

          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
            <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
              DETAILED LATENCY & P95 TREND
            </h3>
            <LatencyLineChart data={metrics} height={260} />
          </div>
        </div>
      )}

      {/* TAB 4: LOGS */}
      {activeTab === 'logs' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-[#111827] p-4 rounded-xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search logs (e.g. timeout, 500, Mongo)..."
                value={logQuery}
                onChange={(e) => setLogQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Severity:</span>
              <select
                value={logSeverity}
                onChange={(e) => setLogSeverity(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="ALL">All Severities</option>
                <option value="ERROR">ERROR</option>
                <option value="WARN">WARN</option>
                <option value="INFO">INFO</option>
              </select>
            </div>
          </div>

          {/* Log Stream Terminal */}
          <div className="bg-[#0c101a] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto space-y-2">
            {logs
              .filter(
                (l) =>
                  (logSeverity === 'ALL' || l.severity === logSeverity) &&
                  (!logQuery || l.message.toLowerCase().includes(logQuery.toLowerCase()))
              )
              .map((log) => (
                <div key={log.id} className="flex items-start gap-3 py-1 border-b border-slate-900/60">
                  <span className="text-slate-500 shrink-0">{log.timeDisplay}</span>
                  <span
                    className={`font-bold px-1.5 py-0.2 rounded text-[10px] shrink-0 ${
                      log.severity === 'ERROR'
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : log.severity === 'WARN'
                        ? 'bg-amber-950 text-amber-400 border border-amber-800'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {log.severity}
                  </span>
                  <span className="text-indigo-400 shrink-0">[{log.service}]</span>
                  <span className="text-slate-300 flex-1">{log.message}</span>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* TAB 5: INCIDENTS */}
      {activeTab === 'incidents' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-1">Associated Incidents</h3>
            <p className="text-xs text-slate-400">All alerts and investigations for {app.name}</p>
          </div>

          <div className="space-y-3">
            {incidents.map((inc) => (
              <div
                key={inc.id}
                className="bg-[#111827] border border-slate-800 rounded-xl p-5 flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <Link
                      to={`/dashboard/incidents/${inc.id}`}
                      className="font-mono font-bold text-white hover:text-indigo-400 text-sm"
                    >
                      {inc.id}
                    </Link>
                    <Badge variant={inc.severity === 'HIGH' ? 'critical' : 'degraded'} size="sm">
                      {inc.severity}
                    </Badge>
                    <Badge variant={inc.status === 'INVESTIGATING' ? 'investigating' : 'resolved'} dot size="sm">
                      {inc.status}
                    </Badge>
                  </div>
                  <h4 className="text-xs font-semibold text-slate-300 mt-1">{inc.title}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">Detected {inc.detectedAt}</p>
                </div>
                <Link to={`/dashboard/incidents/${inc.id}`}>
                  <Button size="sm">Investigate Incident →</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 6: DEPLOYMENTS */}
      {activeTab === 'deployments' && (
        <div className="space-y-4">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-4">
            <h3 className="text-sm font-bold text-white mb-1">Deployment History</h3>
            <p className="text-xs text-slate-400">Automated correlation of releases with telemetry changes</p>
          </div>

          <div className="space-y-3">
            {app.deployments.map((dep) => (
              <div
                key={dep.id}
                className="bg-[#111827] border border-slate-800 rounded-xl p-4 flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-indigo-950 border border-indigo-800 flex items-center justify-center text-indigo-400 font-bold">
                    <GitBranch className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-white">{dep.version}</span>
                      <span className="font-mono text-slate-400 px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700">
                        {dep.commitHash}
                      </span>
                      <span className="text-slate-400">by {dep.author}</span>
                    </div>
                    <p className="text-slate-300 mt-1">{dep.summary}</p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-slate-500 block">{dep.timestamp}</span>
                  {dep.associatedIncidentId && (
                    <span className="text-[10px] font-bold text-red-400 bg-red-950 px-2 py-0.5 rounded border border-red-800 inline-block mt-1">
                      Triggered {dep.associatedIncidentId}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: SETTINGS */}
      {activeTab === 'settings' && (
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-6 text-sm">
          <div>
            <h3 className="text-base font-bold text-white">Application Configuration</h3>
            <p className="text-xs text-slate-400">Manage telemetry probes and webhook endpoints</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Application Name</label>
              <input
                type="text"
                defaultValue={app.name}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Base URL</label>
              <input
                type="text"
                defaultValue={app.baseUrl}
                className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 flex justify-end">
            <Button size="sm">Save Changes</Button>
          </div>
        </div>
      )}

      {/* Add Service Modal */}
      <Modal
        isOpen={isAddServiceOpen}
        onClose={() => setIsAddServiceOpen(false)}
        title="Add Microservice"
        subtitle={`Register a new service under ${app.name}`}
      >
        <form onSubmit={handleAddService} className="space-y-4 text-sm">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">Service Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Recommendations API"
              value={newServiceName}
              onChange={(e) => setNewServiceName(e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white focus:outline-none focus:border-indigo-500 text-xs"
            />
          </div>
          <div className="flex justify-end gap-2 pt-3 border-t border-slate-800">
            <Button type="button" variant="secondary" size="sm" onClick={() => setIsAddServiceOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" size="sm">
              Add Service
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
