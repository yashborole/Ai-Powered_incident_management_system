import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { incidentApi } from '../../api/incidentApi';
import { logsApi } from '../../api/logsApi';
import { metricsApi } from '../../api/metricsApi';
import { knowledgeApi } from '../../api/knowledgeApi';
import { Incident } from '../../types/incident';
import { LogEntry } from '../../types/logs';
import { MetricDataPoint } from '../../types/analytics';
import { Badge } from '../../components/common/Badge';
import { Button } from '../../components/common/Button';
import { IncidentTimeline } from '../../components/incidents/IncidentTimeline';
import { AIInvestigation } from '../../components/incidents/AIInvestigation';
import { AskAIWidget } from '../../components/incidents/AskAIWidget';
import { ResolutionModal } from '../../components/incidents/ResolutionModal';
import { LatencyLineChart } from '../../components/charts/LatencyLineChart';
import { MetricAreaChart } from '../../components/charts/MetricAreaChart';
import {
  ArrowLeft,
  Sparkles,
  Clock,
  Activity,
  Terminal,
  BarChart2,
  CheckCircle2,
  AlertTriangle,
  FileCheck,
} from 'lucide-react';

export const IncidentDetailPage: React.FC = () => {
  const { incidentId } = useParams<{ incidentId: string }>();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'timeline' | 'ai-investigation' | 'logs' | 'metrics' | 'resolution'
  >('ai-investigation');

  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [metrics, setMetrics] = useState<MetricDataPoint[]>([]);
  const [isResolveModalOpen, setIsResolveModalOpen] = useState(false);

  useEffect(() => {
    if (incidentId) {
      incidentApi.getIncidentById(incidentId).then((data) => {
        if (data) setIncident(data);
      });
      logsApi.getLogs().then(setLogs);
      metricsApi.getPerformanceMetrics().then(setMetrics);
    }
  }, [incidentId]);

  const handleToggleAction = async (actionId: string) => {
    if (!incidentId) return;
    const updated = await incidentApi.toggleActionItem(incidentId, actionId);
    setIncident({ ...updated });
  };

  const handleResolve = async (data: { rootCause: string; resolution: string; preventiveAction: string }) => {
    if (!incident) return;
    const resolved = await incidentApi.resolveIncident(incident.id, data);
    setIncident({ ...resolved });

    // Automatically generate Knowledge Base entry
    await knowledgeApi.createDocument({
      title: `${incident.id} Resolution: ${data.rootCause}`,
      type: 'Incident',
      author: 'Yash Borole',
      tags: [incident.applicationName, incident.serviceName, 'Post-Mortem'],
      summary: `Automated post-mortem for ${incident.id}. Root Cause: ${data.rootCause}. Resolution: ${data.resolution}.`,
      content: `# Post-Mortem & Incident Report: ${incident.id}\n\n**Application**: ${incident.applicationName}\n**Service**: ${incident.serviceName}\n\n## Root Cause\n${data.rootCause}\n\n## Resolution\n${data.resolution}\n\n## Preventive Action\n${data.preventiveAction}`
    });
  };

  if (!incident) {
    return (
      <div className="p-8 text-center text-slate-400">
        <p>Loading incident details...</p>
      </div>
    );
  }

  const tabs = [
    { id: 'ai-investigation', label: 'AI Investigation', icon: Sparkles, badge: 'Hypothesis' },
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'logs', label: 'Logs', icon: Terminal },
    { id: 'metrics', label: 'Metrics', icon: BarChart2 },
    { id: 'resolution', label: 'Resolution', icon: FileCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Back button */}
      <Link
        to="/dashboard/incidents"
        className="text-xs text-slate-400 hover:text-white inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Back to Incidents</span>
      </Link>

      {/* Incident Header Card */}
      <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl font-bold text-white">{incident.id}</span>
              <Badge variant={incident.severity === 'HIGH' || incident.severity === 'CRITICAL' ? 'critical' : 'degraded'}>
                {incident.severity}
              </Badge>
              <Badge variant={incident.status === 'INVESTIGATING' ? 'investigating' : incident.status === 'RESOLVED' ? 'resolved' : 'open'} dot>
                {incident.status}
              </Badge>
            </div>
            <h2 className="text-base font-semibold text-slate-200 mt-1">{incident.title}</h2>
          </div>

          <div className="flex items-center gap-3">
            {incident.status !== 'RESOLVED' ? (
              <Button variant="success" size="sm" onClick={() => setIsResolveModalOpen(true)}>
                Resolve Incident
              </Button>
            ) : (
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950 px-3 py-1.5 rounded-lg border border-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4" />
                Resolved
              </span>
            )}
          </div>
        </div>

        {/* Timestamps & details bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 text-xs">
          <div>
            <span className="text-slate-500 block">Application</span>
            <span className="font-semibold text-white">{incident.applicationName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Target Service</span>
            <span className="font-mono text-slate-300">{incident.serviceName}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Detected Time</span>
            <span className="font-mono text-slate-300">{incident.detectedAt}</span>
          </div>
          <div>
            <span className="text-slate-500 block">Started Time</span>
            <span className="font-mono text-slate-300">{incident.startedAt}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
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
                <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-950 text-indigo-400 border border-indigo-800">
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* TAB 1: AI INVESTIGATION */}
      {activeTab === 'ai-investigation' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            {incident.aiInvestigation ? (
              <AIInvestigation
                hypothesis={incident.aiInvestigation}
                onToggleAction={handleToggleAction}
                onOpenResolveModal={() => setIsResolveModalOpen(true)}
              />
            ) : (
              <div className="p-8 text-center text-slate-400 bg-[#111827] rounded-xl border border-slate-800">
                <p>AI investigation telemetry pending...</p>
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <AskAIWidget incidentId={incident.id} />
          </div>
        </div>
      )}

      {/* TAB 2: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h3 className="text-sm font-bold text-white mb-2">Incident Description</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{incident.description}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
                Request Volume During Incident
              </h4>
              <MetricAreaChart data={metrics} height={200} />
            </div>
            <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
              <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
                Latency & Error Surge
              </h4>
              <LatencyLineChart data={metrics} height={200} />
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TIMELINE */}
      {activeTab === 'timeline' && (
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6">
          <h3 className="text-sm font-bold text-white mb-6">Chronological Sequence of Events</h3>
          <IncidentTimeline events={incident.timeline} />
        </div>
      )}

      {/* TAB 4: LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-[#0c101a] border border-slate-800 rounded-xl p-4 font-mono text-xs overflow-x-auto space-y-2">
          {logs.map((log) => (
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
      )}

      {/* TAB 5: METRICS */}
      {activeTab === 'metrics' && (
        <div className="space-y-6">
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-3">
              Telemetry Latency & Response Times
            </h4>
            <LatencyLineChart data={metrics} height={260} />
          </div>
          <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3">
              Request Rate Distribution
            </h4>
            <MetricAreaChart data={metrics} height={220} />
          </div>
        </div>
      )}

      {/* TAB 6: RESOLUTION */}
      {activeTab === 'resolution' && (
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-6 space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white">Post-Mortem & Resolution Notes</h3>
            {incident.status !== 'RESOLVED' && (
              <Button size="sm" variant="success" onClick={() => setIsResolveModalOpen(true)}>
                Edit / Mark as Resolved
              </Button>
            )}
          </div>

          {incident.resolutionNotes ? (
            <div className="space-y-4 text-xs">
              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-1">
                  Root Cause
                </span>
                <p className="text-slate-200">{incident.resolutionNotes.rootCause}</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-1">
                  Resolution Action Taken
                </span>
                <p className="text-slate-200">{incident.resolutionNotes.resolution}</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-slate-400 font-semibold block uppercase tracking-wider mb-1">
                  Preventive Action
                </span>
                <p className="text-slate-200">{incident.resolutionNotes.preventiveAction}</p>
              </div>

              <div className="text-[11px] text-slate-500 pt-2">
                Resolved by <strong className="text-slate-300">{incident.resolutionNotes.resolvedBy}</strong> ({incident.resolutionNotes.resolvedAt})
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-xs">
              <p>No resolution recorded yet. Click below to document root cause and resolve.</p>
              <Button size="sm" className="mt-4" onClick={() => setIsResolveModalOpen(true)}>
                Resolve Incident
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Resolution Modal */}
      <ResolutionModal
        isOpen={isResolveModalOpen}
        onClose={() => setIsResolveModalOpen(false)}
        incident={incident}
        onResolve={handleResolve}
      />
    </div>
  );
};
