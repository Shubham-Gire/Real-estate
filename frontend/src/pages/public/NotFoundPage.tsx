import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowLeft } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 bg-primary-50 text-primary-600 rounded-3xl flex items-center justify-center mb-6">
        <Building className="w-8 h-8" />
      </div>
      <h1 className="text-6xl font-black text-slate-900 tracking-tight">404</h1>
      <h2 className="text-xl font-bold text-slate-800 mt-2">Page Not Found</h2>
      <p className="text-xs text-slate-500 mt-2 max-w-sm">
        The property address or destination you are seeking does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="mt-6 inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-6 py-3 rounded-2xl shadow-sm transition-all"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Return to Marketplace</span>
      </Link>
    </div>
  );
};
