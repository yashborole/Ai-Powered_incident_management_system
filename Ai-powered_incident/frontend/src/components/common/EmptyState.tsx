import React from 'react';
import { Inbox } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  actionLabel,
  onAction,
  icon = <Inbox className="w-10 h-10 text-slate-500" />,
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-12 text-center bg-[#111827]/40 border border-dashed border-slate-800 rounded-xl my-4">
      <div className="p-3 bg-slate-900 rounded-full mb-3 border border-slate-800">{icon}</div>
      <h3 className="text-base font-semibold text-slate-200">{title}</h3>
      <p className="text-sm text-slate-400 mt-1 max-w-sm">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="mt-4" size="sm">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
