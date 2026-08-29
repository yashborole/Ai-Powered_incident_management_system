import React from 'react';
import { TimelineEvent } from '../../types/incident';
import { GitCommit, TrendingUp, AlertOctagon, CheckCircle2, Info, Bell } from 'lucide-react';

interface IncidentTimelineProps {
  events: TimelineEvent[];
}

export const IncidentTimeline: React.FC<IncidentTimelineProps> = ({ events }) => {
  const getEventIcon = (type: string, severity?: string) => {
    switch (type) {
      case 'DEPLOYMENT':
        return <GitCommit className="w-4 h-4 text-indigo-400" />;
      case 'METRIC_SPIKE':
        return <TrendingUp className="w-4 h-4 text-amber-400" />;
      case 'ERROR_SPIKE':
        return <AlertOctagon className="w-4 h-4 text-red-400" />;
      case 'DETECTION':
        return <Bell className="w-4 h-4 text-red-400" />;
      case 'ACTION':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      default:
        return <Info className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventBg = (severity?: string) => {
    switch (severity) {
      case 'danger':
        return 'bg-red-950/60 border-red-800/50';
      case 'warning':
        return 'bg-amber-950/60 border-amber-800/50';
      case 'info':
        return 'bg-indigo-950/60 border-indigo-800/50';
      default:
        return 'bg-slate-900 border-slate-800';
    }
  };

  return (
    <div className="relative pl-6 space-y-6 before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-800">
      {events.map((event, index) => (
        <div key={index} className="relative flex items-start gap-4 group">
          {/* Node marker */}
          <div
            className={`absolute -left-6 mt-1 w-6 h-6 rounded-full border flex items-center justify-center bg-[#111827] z-10 ${getEventBg(
              event.severity
            )}`}
          >
            {getEventIcon(event.type, event.severity)}
          </div>

          <div className="flex-1 bg-[#111827] border border-slate-800/80 rounded-xl p-4 transition-all duration-200 hover:border-slate-700">
            <div className="flex items-center justify-between gap-2 mb-1">
              <span className="font-mono text-xs font-bold text-indigo-400">{event.time}</span>
              <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                {event.type}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-white">{event.title}</h4>
            {event.description && (
              <p className="text-xs text-slate-400 mt-1">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
