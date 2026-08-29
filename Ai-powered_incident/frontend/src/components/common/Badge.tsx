import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export type BadgeVariant = 'healthy' | 'degraded' | 'critical' | 'info' | 'neutral' | 'open' | 'investigating' | 'resolved';

interface BadgeProps {
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  children: React.ReactNode;
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  variant = 'neutral',
  size = 'md',
  children,
  dot = false,
  className,
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dot: string; border: string }> = {
    healthy: {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      border: 'border-emerald-800/40',
    },
    degraded: {
      bg: 'bg-amber-950/60',
      text: 'text-amber-400',
      dot: 'bg-amber-400',
      border: 'border-amber-800/40',
    },
    critical: {
      bg: 'bg-red-950/60',
      text: 'text-red-400',
      dot: 'bg-red-400',
      border: 'border-red-800/40',
    },
    info: {
      bg: 'bg-indigo-950/60',
      text: 'text-indigo-300',
      dot: 'bg-indigo-400',
      border: 'border-indigo-800/40',
    },
    open: {
      bg: 'bg-amber-950/60',
      text: 'text-amber-300',
      dot: 'bg-amber-400',
      border: 'border-amber-700/50',
    },
    investigating: {
      bg: 'bg-indigo-950/60',
      text: 'text-indigo-400',
      dot: 'bg-indigo-400 animate-pulse',
      border: 'border-indigo-700/50',
    },
    resolved: {
      bg: 'bg-emerald-950/60',
      text: 'text-emerald-400',
      dot: 'bg-emerald-400',
      border: 'border-emerald-700/50',
    },
    neutral: {
      bg: 'bg-slate-800/80',
      text: 'text-slate-300',
      dot: 'bg-slate-400',
      border: 'border-slate-700',
    },
  };

  const style = variantStyles[variant] || variantStyles.neutral;
  const sizeClass = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 font-medium rounded-md border',
          style.bg,
          style.text,
          style.border,
          sizeClass,
          className
        )
      )}
    >
      {dot && <span className={clsx('w-1.5 h-1.5 rounded-full shrink-0', style.dot)} />}
      {children}
    </span>
  );
};
