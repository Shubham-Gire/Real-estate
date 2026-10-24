import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { PropertyStatus, PropertySummary } from '../../types/property';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { Modal } from '../../components/common/Modal';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import {
  CheckCircle2,
  XCircle,
  AlertOctagon,
  RotateCcw,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';

export const AdminModerationPage: React.FC = () => {
  const { success, error } = useToast();

  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | 'ALL'>('PENDING_REVIEW');
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  // Reject Modal State
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectingPropertyId, setRejectingPropertyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);

  const fetchModerationListings = async () => {
    setLoading(true);
    try {
      const filter = {
        query: searchQuery.trim() || undefined,
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        page,
        size: 15,
      };
      const res = await adminService.getAllProperties(filter);
      setProperties(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      error(err.message || 'Failed to fetch moderation queue');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchModerationListings();
  }, [selectedStatus, page]);

  const handleApprove = async (id: string) => {
    try {
      await adminService.approveProperty(id);
      success('Listing approved and published to marketplace!');
      fetchModerationListings();
    } catch (err: any) {
      error(err.message || 'Approval failed');
    }
  };

  const openRejectModal = (id: string) => {
    setRejectingPropertyId(id);
    setRejectionReason('');
    setRejectModalOpen(true);
  };

  const handleConfirmReject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPropertyId || !rejectionReason.trim()) {
      error('A mandatory rejection reason is required.');
      return;
    }

    setSubmittingAction(true);
    try {
      await adminService.rejectProperty(rejectingPropertyId, rejectionReason.trim());
      success('Listing rejected with feedback provided to owner.');
      setRejectModalOpen(false);
      fetchModerationListings();
    } catch (err: any) {
      error(err.message || 'Rejection failed');
    } finally {
      setSubmittingAction(false);
    }
  };

  const handleSuspend = async (id: string) => {
    if (!window.confirm('Suspend this active listing? It will be hidden from search.')) return;
    try {
      await adminService.suspendProperty(id, 'Suspended by platform administrator');
      success('Listing suspended');
      fetchModerationListings();
    } catch (err: any) {
      error(err.message || 'Suspension failed');
    }
  };

  const handleRestore = async (id: string) => {
    try {
      await adminService.restoreProperty(id);
      success('Listing restored to published');
      fetchModerationListings();
    } catch (err: any) {
      error(err.message || 'Restoration failed');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-white tracking-tight">Property Moderation Portal</h1>
        <p className="text-xs text-slate-400 mt-1">
          Review, approve, reject with reason, or suspend marketplace submissions
        </p>
      </div>

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-950 p-4 rounded-3xl border border-slate-800">
        {/* Status Tabs */}
        <div className="flex space-x-1.5 overflow-x-auto w-full sm:w-auto text-xs font-bold scrollbar-none">
          {(['PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'SUSPENDED', 'ALL'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setSelectedStatus(tab);
                setPage(0);
              }}
              className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
                selectedStatus === tab
                  ? 'bg-primary-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-900'
              }`}
            >
              {tab === 'ALL' ? 'All Submissions' : tab.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by title or locality..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchModerationListings()}
            className="w-full pl-10 pr-3 py-2 bg-slate-900 border border-slate-700/80 rounded-xl text-xs font-semibold text-slate-200 placeholder:text-slate-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Properties Table */}
      <div className="bg-slate-950/80 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
        {loading ? (
          <div className="p-16 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-500 font-bold">Querying moderation queue...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No properties found matching status filter "{selectedStatus}".
          </div>
        ) : (
          <div className="divide-y divide-slate-800/80">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-900/50 transition-colors"
              >
                {/* Details */}
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 overflow-hidden flex-shrink-0">
                    <img
                      src={
                        prop.primaryImageUrl ||
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <StatusBadge status={prop.status} />
                      <span className="text-xs text-slate-400">
                        Owner: <strong className="text-slate-200">{prop.ownerName}</strong>
                      </span>
                    </div>
                    <h3 className="font-bold text-white text-sm line-clamp-1">{prop.title}</h3>
                    <p className="text-xs text-slate-400">
                      {prop.locality}, {prop.city} • ${prop.price.toLocaleString()} ({prop.transactionType})
                    </p>
                  </div>
                </div>

                {/* Moderation Controls */}
                <div className="flex items-center space-x-2">
                  <a
                    href={`/properties/${prop.id}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition-colors"
                    title="Inspect Listing"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>

                  {prop.status === 'PENDING_REVIEW' && (
                    <>
                      <button
                        onClick={() => handleApprove(prop.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => openRejectModal(prop.id)}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Reject</span>
                      </button>
                    </>
                  )}

                  {prop.status === 'PUBLISHED' && (
                    <button
                      onClick={() => handleSuspend(prop.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-red-950 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition-colors"
                    >
                      <AlertOctagon className="w-3.5 h-3.5" />
                      <span>Suspend</span>
                    </button>
                  )}

                  {prop.status === 'SUSPENDED' && (
                    <button
                      onClick={() => handleRestore(prop.id)}
                      className="flex items-center space-x-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-colors"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Restore</span>
                    </button>
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

      {/* Mandatory Rejection Reason Dialog */}
      <Modal
        isOpen={rejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        title="Provide Rejection Reason"
      >
        <form onSubmit={handleConfirmReject} className="space-y-4">
          <p className="text-xs text-slate-600">
            A clear explanation is mandatory. This feedback will be recorded in audit logs and communicated directly to the property submitter.
          </p>
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Rejection Reason *
            </label>
            <textarea
              required
              rows={4}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="e.g. Inaccurate location details, blurred photos, or asking price inconsistent with market documentation."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
            ></textarea>
          </div>

          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setRejectModalOpen(false)}
              className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submittingAction}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white shadow-sm disabled:opacity-50"
            >
              {submittingAction ? 'Processing...' : 'Confirm Rejection'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
