import React from 'react';
import { PropertyStatus } from '../../types/property';

export const StatusBadge: React.FC<{ status: PropertyStatus; className?: string }> = ({
  status,
  className = '',
}) => {
  const getBadgeStyle = () => {
    switch (status) {
      case 'PUBLISHED':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'PENDING_REVIEW':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'REJECTED':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'SUSPENDED':
        return 'bg-red-50 text-red-800 border-red-200';
      case 'SOLD':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'RENTED':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      case 'DRAFT':
        return 'bg-slate-50 text-slate-600 border-slate-200';
      case 'ARCHIVED':
        return 'bg-zinc-100 text-zinc-600 border-zinc-200';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getLabel = () => {
    switch (status) {
      case 'PENDING_REVIEW':
        return 'Pending Review';
      default:
        return status.charAt(0) + status.slice(1).toLowerCase();
    }
  };

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border tracking-wide uppercase ${getBadgeStyle()} ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full mr-1.5 bg-current opacity-70"></span>
      {getLabel()}
    </span>
  );
};
