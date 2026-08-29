import React from 'react';
import { AIHypothesis } from '../../types/incident';
import { Sparkles, CheckSquare, Square, ExternalLink, HelpCircle, Lightbulb } from 'lucide-react';
import { Button } from '../common/Button';

interface AIInvestigationProps {
  hypothesis: AIHypothesis;
  onToggleAction: (actionId: string) => void;
  onOpenResolveModal: () => void;
}

export const AIInvestigation: React.FC<AIInvestigationProps> = ({
  hypothesis,
  onToggleAction,
  onOpenResolveModal,
}) => {
  return (
    <div className="space-y-6">
      {/* Root Cause Hypothesis Card */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-[#111827] to-[#111827] border border-indigo-500/40 rounded-xl p-6 shadow-2xl relative overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-300 shadow-lg shadow-indigo-600/20">
            <Sparkles className="w-5 h-5 animate-pulse text-indigo-400" />
          </div>
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
              Automated Root Cause Hypothesis
            </span>
            <h3 className="text-xl font-bold text-white">{hypothesis.title}</h3>
          </div>
        </div>

        <p className="text-sm text-slate-300 leading-relaxed mb-5">{hypothesis.summary}</p>

        {/* Confidence Progress */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-lg p-4 mb-5">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-slate-300">Hypothesis Confidence</span>
            <span className="text-emerald-400 font-bold text-sm">{hypothesis.confidence}%</span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden border border-slate-700">
            <div
              className="bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-400 h-full rounded-full transition-all duration-700"
              style={{ width: `${hypothesis.confidence}%` }}
            />
          </div>
        </div>

        {/* Evidence Checklist */}
        <div className="mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
            <span>Supporting Evidence Found</span>
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {hypothesis.evidence.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-lg bg-slate-900/60 border border-slate-800/80 text-xs text-slate-300"
              >
                <span className="text-emerald-400 font-bold">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Why this hypothesis explanation */}
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4 mb-6">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2.5 flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-indigo-400" />
            <span>Why this hypothesis?</span>
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-400 list-disc list-inside">
            {hypothesis.whyHypothesis.map((why, idx) => (
              <li key={idx} className="leading-relaxed">
                {why}
              </li>
            ))}
          </ul>
        </div>

        {/* Similar Incidents RAG */}
        {hypothesis.similarIncidents && hypothesis.similarIncidents.length > 0 && (
          <div className="mb-6">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <Lightbulb className="w-4 h-4 text-amber-400" />
              <span>Similar Historical Incidents (RAG Grounding)</span>
            </h4>
            <div className="space-y-3">
              {hypothesis.similarIncidents.map((sim) => (
                <div
                  key={sim.id}
                  className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-indigo-400">{sim.id}</span>
                      <span className="text-slate-200 font-medium">{sim.title}</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/50 font-bold text-[10px]">
                      {sim.similarity}% similarity
                    </span>
                  </div>
                  <p className="text-slate-400">
                    <strong className="text-slate-300">Previously resolved by:</strong> {sim.previousResolution}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Recommended Remediation Steps
            </h4>
            <Button size="sm" variant="success" onClick={onOpenResolveModal}>
              Mark as Resolved
            </Button>
          </div>
          <div className="space-y-2">
            {hypothesis.recommendedActions.map((action) => (
              <div
                key={action.id}
                onClick={() => onToggleAction(action.id)}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                  action.completed
                    ? 'bg-emerald-950/20 border-emerald-800/40 text-emerald-300'
                    : 'bg-slate-900/60 border-slate-800 text-slate-200 hover:border-slate-700'
                }`}
              >
                {action.completed ? (
                  <CheckSquare className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <span className={`text-xs ${action.completed ? 'line-through text-slate-400' : ''}`}>
                  {action.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
