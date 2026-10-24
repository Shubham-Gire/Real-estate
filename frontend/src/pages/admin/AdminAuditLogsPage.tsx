import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { AuditLog } from '../../types/admin';
import { Pagination } from '../../components/common/Pagination';
import { History, Shield, Calendar, User, Terminal } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchAuditLogs = async () => {
    setLoading(true);
    try {
      const res = await adminService.getAuditLogs(page, 20);
      setLogs(res.content);
      setTotalPages(res.totalPages);
    } catch (err) {
      console.error('Failed to query audit logs', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
  }, [page]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">System Audit Trail</h1>
        <p className="text-xs text-slate-400 mt-1">
          Immutable event log of security, moderation decisions, and user management events
        </p>
      </div>

      <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 font-bold">Querying system audit log...</p>
          </div>
        ) : logs.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">No audit logs recorded yet.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-slate-400 font-extrabold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="py-3 px-5">Timestamp</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-5">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3.5 px-5 font-mono text-[11px] text-slate-400 whitespace-nowrap">
                      {new Date(log.createdAt).toLocaleString()}
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-wider bg-primary-950 text-primary-300 border border-primary-800/40">
                        {log.action}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 font-medium text-slate-200 whitespace-nowrap">
                      {log.actorEmail || 'System / Bootstrap'}
                    </td>

                    <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                      <span className="font-bold text-slate-300">{log.entityType}</span>
                    </td>

                    <td className="py-3.5 px-5 text-slate-400 text-xs leading-relaxed max-w-md truncate">
                      {log.details || '—'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
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
