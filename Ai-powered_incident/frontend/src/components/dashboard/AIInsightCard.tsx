import React from 'react';
import { Sparkles, ArrowRight, CheckCircle, Database, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../common/Button';

export const AIInsightCard: React.FC = () => {
  return (
    <div className="bg-gradient-to-b from-indigo-950/40 via-[#111827] to-[#111827] border border-indigo-500/30 rounded-xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex items-center gap-2.5 mb-4">
        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center text-indigo-300">
          <Sparkles className="w-4 h-4 animate-pulse" />
        </div>
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <span>AI INSIGHTS & ROOT CAUSE PREDICTION</span>
          </h3>
          <p className="text-xs text-slate-400">Automated continuous telemetry analysis</p>
        </div>
      </div>

      <div className="space-y-4">
        {/* Primary Anomaly Alert */}
        <div className="bg-slate-900/80 border border-amber-500/30 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-amber-200">
                Payment API latency increased 240%
              </h4>
              <p className="text-xs text-slate-300 mt-1">
                <span className="text-slate-400">Possible contributor:</span> <strong className="text-white">Database query latency & connection exhaustion</strong>
              </p>

              {/* Confidence Meter */}
              <div className="mt-3 flex items-center gap-3">
                <div className="flex-1 bg-slate-800 rounded-full h-2 overflow-hidden border border-slate-700">
                  <div
                    className="bg-gradient-to-r from-indigo-500 to-emerald-400 h-full rounded-full transition-all duration-500"
                    style={{ width: '87%' }}
                  />
                </div>
                <span className="text-xs font-bold text-indigo-300">Confidence: 87%</span>
              </div>

              <div className="mt-4">
                <Link to="/dashboard/incidents/INC-1045">
                  <Button size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                    Investigate Incident
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Historical Incident Match */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-lg p-3.5 flex items-start gap-3">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div className="flex-1 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-200">Similar incident found: INC-782</span>
              <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 font-bold border border-emerald-800/50 text-[10px]">
                91% match
              </span>
            </div>
            <p className="text-slate-400 mt-1">
              <strong className="text-slate-300">Previously resolved by:</strong> Increasing DB connection pool from 20 to 60 and fixing unclosed session handler.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
