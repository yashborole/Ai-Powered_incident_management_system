import React from 'react';

interface TableProps {
  headers: string[];
  children: React.ReactNode;
  className?: string;
}

export const Table: React.FC<TableProps> = ({ headers, children, className = '' }) => {
  return (
    <div className={`overflow-x-auto rounded-xl border border-slate-800/80 bg-[#111827]/80 ${className}`}>
      <table className="w-full text-left text-sm text-slate-300">
        <thead className="bg-slate-900/80 text-xs uppercase tracking-wider text-slate-400 font-semibold border-b border-slate-800">
          <tr>
            {headers.map((header, idx) => (
              <th key={idx} className="px-5 py-3.5">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/60 font-normal">{children}</tbody>
      </table>
    </div>
  );
};
