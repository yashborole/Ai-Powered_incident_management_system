import React, { useState } from 'react';
import { Menu, Bell, ChevronDown, Wrench, Shield, User, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Link } from 'react-router-dom';

interface NavbarProps {
  onToggleSidebar: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="sticky top-0 z-20 h-16 bg-[#0b0f19]/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 text-slate-200">
          <Wrench className="w-4 h-4 text-indigo-400" />
          <span className="text-sm font-semibold tracking-tight text-white hidden sm:inline">
            AI Reliability Platform
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-5">
        {/* Environment Pill */}
        <div className="hidden md:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/50 border border-emerald-800/40 text-[11px] font-medium text-emerald-400">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Real-time Telemetry Live</span>
        </div>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 animate-ping" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl p-4 z-50 animate-in fade-in zoom-in-95">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-semibold text-white">Active Alerts</span>
                <span className="text-[10px] text-indigo-400 hover:underline cursor-pointer">Mark all read</span>
              </div>
              <div className="mt-3 space-y-2.5 text-xs">
                <div className="p-2.5 rounded-lg bg-red-950/40 border border-red-900/40">
                  <p className="font-medium text-red-300">INC-1045: Payment API Latency</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Spike of 240% observed on /checkout</p>
                </div>
                <div className="p-2.5 rounded-lg bg-amber-950/40 border border-amber-900/40">
                  <p className="font-medium text-amber-300">INC-1044: Orders API Queue Lag</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Consumer lag crossed 1,200 threshold</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User profile dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
          >
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center font-bold text-xs text-white uppercase">
              {user?.name?.[0] || 'Y'}
            </div>
            <span className="text-sm font-medium text-slate-200 hidden sm:inline">{user?.name || 'Yash'}</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showDropdown && (
            <div className="absolute right-0 mt-2 w-56 bg-[#111827] border border-slate-800 rounded-xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95">
              <div className="px-4 py-2 border-b border-slate-800">
                <p className="text-xs font-semibold text-white">{user?.name || 'Yash Borole'}</p>
                <p className="text-[11px] text-slate-400 truncate">{user?.email || 'engineer@example.com'}</p>
              </div>
              <Link
                to="/dashboard/settings"
                onClick={() => setShowDropdown(false)}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors"
              >
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>Profile & Settings</span>
              </Link>
              <div
                onClick={() => {
                  setShowDropdown(false);
                  logout();
                }}
                className="flex items-center gap-2.5 px-4 py-2 text-xs text-red-400 hover:bg-red-950/40 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
