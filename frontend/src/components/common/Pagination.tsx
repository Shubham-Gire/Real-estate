import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  if (totalPages <= 1) return null;

  const pages = [];
  const startPage = Math.max(0, currentPage - 2);
  const endPage = Math.min(totalPages - 1, currentPage + 2);

  for (let i = startPage; i <= endPage; i++) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-center space-x-2 my-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Previous Page"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {startPage > 0 && (
        <>
          <button
            onClick={() => onPageChange(0)}
            className="w-10 h-10 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            1
          </button>
          {startPage > 1 && <span className="px-1 text-slate-400">...</span>}
        </>
      )}

      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-10 h-10 rounded-xl font-bold text-sm transition-all ${
            currentPage === p
              ? 'bg-primary-600 text-white shadow-md shadow-primary-500/25'
              : 'text-slate-700 hover:bg-slate-100 bg-white border border-slate-200'
          }`}
        >
          {p + 1}
        </button>
      ))}

      {endPage < totalPages - 1 && (
        <>
          {endPage < totalPages - 2 && <span className="px-1 text-slate-400">...</span>}
          <button
            onClick={() => onPageChange(totalPages - 1)}
            className="w-10 h-10 rounded-xl font-bold text-sm text-slate-700 hover:bg-slate-100 transition-colors"
          >
            {totalPages}
          </button>
        </>
      )}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        aria-label="Next Page"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};
