import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-xs animate-pulse">
      <div className="aspect-4/3 w-full bg-slate-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-4 bg-slate-200 rounded-md w-1/4"></div>
        <div className="h-6 bg-slate-200 rounded-md w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded-md w-1/2"></div>
        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-slate-100">
          <div className="h-7 bg-slate-200 rounded-xl"></div>
          <div className="h-7 bg-slate-200 rounded-xl"></div>
          <div className="h-7 bg-slate-200 rounded-xl"></div>
        </div>
      </div>
    </div>
  );
};
