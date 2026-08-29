import React, { useState } from 'react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useAuth } from '../../context/AuthContext';
import { Button } from '../../components/common/Button';
import {
  User,
  Shield,
  Key,
  GitBranch,
  Bell,
  CheckCircle2,
  Copy,
  Check,
  RefreshCw,
  Sliders,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'api-keys' | 'integrations' | 'notifications'>(
    'integrations'
  );
  const [copiedKey, setCopiedKey] = useState(false);
  const [githubRepo, setGithubRepo] = useState('friend/ecommerce');
  const [isSaved, setIsSaved] = useState(false);

  const apiKey = 'rel_live_948af20b6f98421c97a5e840d21';

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Shield },
    { id: 'api-keys', label: 'API Keys', icon: Key },
    { id: 'integrations', label: 'Integrations', icon: GitBranch },
    { id: 'notifications', label: 'Notifications', icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings & Integrations"
        subtitle="Manage platform configuration, API keys, repositories, and notification channels"
      />

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation side pills */}
        <div className="space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-xs font-semibold transition-colors ${
                  isActive
                    ? 'bg-indigo-600/15 text-indigo-400 border border-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Settings Content Panel */}
        <div className="md:col-span-3 bg-[#111827] border border-slate-800 rounded-xl p-6 shadow-xl">
          {/* PROFILE */}
          {activeTab === 'profile' && (
            <div className="space-y-5 text-sm">
              <div>
                <h3 className="text-base font-bold text-white">User Profile</h3>
                <p className="text-xs text-slate-400">Account information and active role</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    defaultValue={user?.name || 'Yash Borole'}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    defaultValue={user?.email || 'engineer@example.com'}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Assigned Role</label>
                  <input
                    type="text"
                    disabled
                    defaultValue={user?.role || 'ENGINEER'}
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900/50 border border-slate-800 text-slate-400 text-xs cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <Button size="sm">Update Profile</Button>
              </div>
            </div>
          )}

          {/* SECURITY */}
          {activeTab === 'security' && (
            <div className="space-y-5 text-sm">
              <div>
                <h3 className="text-base font-bold text-white">Security & Passwords</h3>
                <p className="text-xs text-slate-400">Update your login authentication credentials</p>
              </div>

              <div className="space-y-3 max-w-md">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Current Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">New Password</label>
                  <input
                    type="password"
                    placeholder="••••••••••••"
                    className="w-full px-3.5 py-2 rounded-lg bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end">
                <Button size="sm">Change Password</Button>
              </div>
            </div>
          )}

          {/* API KEYS */}
          {activeTab === 'api-keys' && (
            <div className="space-y-5 text-sm">
              <div>
                <h3 className="text-base font-bold text-white">Telemetry & Probe API Keys</h3>
                <p className="text-xs text-slate-400">Use this token in your applications to ingest logs & metrics</p>
              </div>

              <div className="p-4 rounded-lg bg-slate-900 border border-slate-800">
                <span className="text-xs font-semibold text-slate-300 block mb-1">Production Ingestion Key</span>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={apiKey}
                    className="flex-1 px-3 py-2 rounded bg-slate-950 border border-slate-800 text-xs font-mono text-indigo-400"
                  />
                  <Button size="sm" variant="secondary" onClick={handleCopy} leftIcon={copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}>
                    {copiedKey ? 'Copied' : 'Copy'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* INTEGRATIONS */}
          {activeTab === 'integrations' && (
            <div className="space-y-6 text-sm">
              <div>
                <h3 className="text-base font-bold text-white">Connected Integrations</h3>
                <p className="text-xs text-slate-400">Continuous telemetry, Git triggers, and repository links</p>
              </div>

              {/* GitHub Integration Card */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                    <GitBranch className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">GitHub</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Connected
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">
                      Repository: <span className="font-mono text-slate-200 font-semibold">{githubRepo}</span>
                    </p>
                  </div>
                </div>

                <Button size="sm" variant="secondary" onClick={() => setIsSaved(!isSaved)}>
                  {isSaved ? 'Configured' : 'Configure'}
                </Button>
              </div>

              {/* MERN Stack Probes */}
              <div className="p-5 rounded-xl bg-slate-900/80 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-white">
                    <Sliders className="w-5 h-5 text-emerald-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">MERN & FastAPI Telemetry Agent</h4>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800 text-[10px] font-bold">
                        Active (4 Services)
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-1">Ingesting live request spans and database connection pools.</p>
                  </div>
                </div>

                <Button size="sm" variant="secondary">
                  Manage Probes
                </Button>
              </div>
            </div>
          )}

          {/* NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div className="space-y-5 text-sm">
              <div>
                <h3 className="text-base font-bold text-white">Alert Notifications</h3>
                <p className="text-xs text-slate-400">Configure alert channels for High & Critical anomalies</p>
              </div>

              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0" />
                  <span className="text-xs text-slate-200">Email notifications on High & Critical incidents</span>
                </label>
                <label className="flex items-center gap-3 p-3 rounded-lg bg-slate-900 border border-slate-800 cursor-pointer">
                  <input type="checkbox" defaultChecked className="rounded bg-slate-800 border-slate-700 text-indigo-600 focus:ring-0" />
                  <span className="text-xs text-slate-200">Automated AI Root Cause investigation alerts</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
