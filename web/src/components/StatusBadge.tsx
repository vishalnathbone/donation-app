import React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const getBadgeStyle = () => {
    switch (status?.toUpperCase()) {
      case 'APPROVED':
      case 'ACTIVE':
        return 'bg-emerald-950/80 border-emerald-700/60 text-emerald-300';
      case 'PENDING':
        return 'bg-amber-950/80 border-amber-700/60 text-amber-300';
      case 'REJECTED':
      case 'DISABLED':
      case 'INACTIVE':
        return 'bg-rose-950/80 border-rose-700/60 text-rose-300';
      default:
        return 'bg-slate-900 border-slate-700 text-slate-400';
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider border ${getBadgeStyle()}`}
    >
      {status || 'UNKNOWN'}
    </span>
  );
};
