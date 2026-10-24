import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PropertyReport } from '../../types/inquiry';
import { Pagination } from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import { AlertTriangle, CheckCircle, XCircle, ExternalLink, Calendar } from 'lucide-react';

export const AdminReportsPage: React.FC = () => {
  const { success, error } = useToast();

  const [reports, setReports] = useState<PropertyReport[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('PENDING');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminService.getReports(selectedStatus || undefined, page, 15);
      setReports(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      error(err.message || 'Failed to fetch abuse reports');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [selectedStatus, page]);

  const handleResolve = async (id: string, status: 'RESOLVED' | 'DISMISSED') => {
    try {
      await adminService.resolveReport(id, status, `Report marked as ${status} by administrator`);
      success(`Report status updated to ${status}`);
      fetchReports();
    } catch (err: any) {
      error(err.message || 'Failed to resolve report');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Abuse & Accuracy Reports</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review community-reported listings for inaccuracies, fraudulent claims, or guidelines violations
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1.5 p-1 bg-slate-950 rounded-2xl border border-slate-800 text-xs font-bold w-fit">
        {['PENDING', 'INVESTIGATING', 'RESOLVED', 'DISMISSED', ''].map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedStatus(tab);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-xl transition-all ${
              selectedStatus === tab
                ? 'bg-primary-600 text-white'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            {tab === '' ? 'All Reports' : tab}
          </button>
        ))}
      </div>

      {/* Reports List */}
      <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 font-bold">Querying property reports...</p>
          </div>
        ) : reports.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No reports found for status "{selectedStatus || 'ALL'}".
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {reports.map((rep) => (
              <div key={rep.id} className="p-6 space-y-3 hover:bg-slate-900/40 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-rose-950 text-rose-400 border border-rose-800/50">
                      {rep.reason}
                    </span>
                    <a
                      href={`/properties/${rep.propertyId}`}
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-bold text-primary-400 hover:underline flex items-center"
                    >
                      <span>Property: {rep.propertyTitle}</span>
                      <ExternalLink className="w-3 h-3 ml-1" />
                    </a>
                  </div>

                  <span className="text-xs text-slate-500 flex items-center">
                    <Calendar className="w-3.5 h-3.5 mr-1" />
                    {new Date(rep.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="p-3 bg-slate-900 rounded-xl text-xs text-slate-300 border border-slate-800">
                  <strong className="text-slate-100">Reporter Description:</strong> "{rep.description}"
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="text-xs text-slate-500">
                    Reporter: {rep.reporterEmail || 'Anonymous Guest'}
                  </span>

                  {rep.status === 'PENDING' && (
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleResolve(rep.id, 'RESOLVED')}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors"
                      >
                        Action Taken / Resolved
                      </button>
                      <button
                        onClick={() => handleResolve(rep.id, 'DISMISSED')}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};
