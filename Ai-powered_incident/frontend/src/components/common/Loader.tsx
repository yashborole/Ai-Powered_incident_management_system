import React from 'react';

export const Loader: React.FC<{ label?: string }> = ({ label = 'Loading...' }) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <div className="relative w-10 h-10">
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
        <div className="absolute inset-0 rounded-full border-2 border-indigo-500 border-t-transparent animate-spin" />
      </div>
      <p className="mt-3 text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );
};
