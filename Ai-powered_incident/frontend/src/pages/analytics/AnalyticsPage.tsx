import React, { useState, useEffect } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { metricsApi } from '../../api/metricsApi';
import { ReliabilityMetrics } from '../../types/analytics';
import { IncidentBarChart } from '../../components/charts/IncidentBarChart';
import { MetricAreaChart } from '../../components/charts/MetricAreaChart';
import { Clock, CheckCircle2, ShieldCheck, AlertOctagon, TrendingDown } from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [metrics, setMetrics] = useState<ReliabilityMetrics | null>(null);

  useEffect(() => {
    metricsApi.getReliabilityMetrics().then(setMetrics);
  }, []);

  const serviceDistributionData = [
    { name: 'Payment API', count: 11, color: '#ef4444' },
    { name: 'Orders API', count: 6, color: '#f59e0b' },
    { name: 'Auth API', count: 4, color: '#6366f1' },
    { name: 'Inventory API', count: 2, color: '#38bdf8' },
    { name: 'Storefront', count: 1, color: '#10b981' },
  ];

  const mttrTrendData = [
    { timestamp: 'Jan', requests: 52, errorRate: 0, latencyMs: 0, p95Ms: 0 },
    { timestamp: 'Feb', requests: 48, errorRate: 0, latencyMs: 0, p95Ms: 0 },
    { timestamp: 'Mar', requests: 45, errorRate: 0, latencyMs: 0, p95Ms: 0 },
    { timestamp: 'Apr', requests: 42, errorRate: 0, latencyMs: 0, p95Ms: 0 },
    { timestamp: 'May', requests: 38, errorRate: 0, latencyMs: 0, p95Ms: 0 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Reliability Analytics"
        subtitle="SLO / SLA compliance, MTTD, MTTR, and incident frequency distribution"
      />

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {/* MTTD */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">MTTD</span>
            <Clock className="w-4 h-4 text-indigo-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {metrics?.mttdMinutes || 4} <span className="text-sm font-normal text-slate-400">min</span>
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>18% faster detection</span>
          </p>
        </div>

        {/* MTTR */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">MTTR</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {metrics?.mttrMinutes || 38} <span className="text-sm font-normal text-slate-400">min</span>
          </h3>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center gap-1">
            <TrendingDown className="w-3 h-3" />
            <span>24% MTTR reduction</span>
          </p>
        </div>

        {/* Availability */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Availability</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
            {metrics?.availabilityPercent || 99.82}%
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">99.9% SLO Target</p>
        </div>

        {/* Total Incidents */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Total Incidents</span>
            <AlertOctagon className="w-4 h-4 text-red-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white font-mono">
            {metrics?.totalIncidents || 24}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">Last 30 days</p>
        </div>

        {/* Resolved */}
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5">
          <div className="flex items-center justify-between text-slate-400 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-emerald-400 font-mono">
            {metrics?.resolvedIncidents || 21}
          </h3>
          <p className="text-[11px] text-slate-400 mt-1">87.5% resolution rate</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-4">
            INCIDENT DISTRIBUTION BY MICROSERVICE
          </h3>
          <IncidentBarChart data={serviceDistributionData} height={240} />
        </div>

        <div className="bg-[#111827] border border-slate-800 rounded-xl p-5 shadow-xl">
          <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 mb-4">
            MEAN TIME TO RESOLVE (MTTR) TREND (MINUTES)
          </h3>
          <MetricAreaChart data={mttrTrendData} dataKey="requests" color="#10b981" height={240} unit=" min" />
        </div>
      </div>
    </div>
  );
};
