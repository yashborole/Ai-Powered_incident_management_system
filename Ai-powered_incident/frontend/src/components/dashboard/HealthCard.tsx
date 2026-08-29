import React from 'react';
import { Layers, CheckCircle2, AlertTriangle, Flame } from 'lucide-react';

interface HealthSummaryProps {
  totalApps: number;
  healthyApps: number;
  totalIncidents: number;
  criticalIncidents: number;
}

export const HealthCard: React.FC<HealthSummaryProps> = ({
  totalApps,
  healthyApps,
  totalIncidents,
  criticalIncidents,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {/* Applications Total */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Applications</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-white mt-1">{totalApps}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-950/60 border border-indigo-800/40 flex items-center justify-center text-indigo-400">
          <Layers className="w-5 h-5" />
        </div>
      </div>

      {/* Healthy Apps */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Healthy</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400 mt-1">{healthyApps}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-emerald-950/60 border border-emerald-800/40 flex items-center justify-center text-emerald-400">
          <CheckCircle2 className="w-5 h-5" />
        </div>
      </div>

      {/* Total Incidents */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Incidents</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-amber-400 mt-1">{totalIncidents}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-amber-950/60 border border-amber-800/40 flex items-center justify-center text-amber-400">
          <AlertTriangle className="w-5 h-5" />
        </div>
      </div>

      {/* Critical Incidents */}
      <div className="bg-[#111827] border border-slate-800/80 rounded-xl p-4 sm:p-5 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Critical</p>
          <h3 className="text-2xl sm:text-3xl font-bold text-red-400 mt-1">{criticalIncidents}</h3>
        </div>
        <div className="w-10 h-10 rounded-lg bg-red-950/60 border border-red-800/40 flex items-center justify-center text-red-400">
          <Flame className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
