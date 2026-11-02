import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import { CrmShowing, ShowingStatus } from '../../types/crm';
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  CheckCircle2,
  XCircle,
  Video,
  Eye,
  Filter,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AgentShowingsPage: React.FC = () => {
  const [showings, setShowings] = useState<CrmShowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | ShowingStatus>('ALL');
  const [selectedShowing, setSelectedShowing] = useState<CrmShowing | null>(null);
  const [feedbackNote, setFeedbackNote] = useState('');
  const [updating, setUpdating] = useState(false);

  const fetchShowings = async () => {
    try {
      const data = await crmService.getShowings();
      setShowings(data);
    } catch (err) {
      console.error('Failed fetching showings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowings();
  }, []);

  const handleUpdateStatus = async (
    id: string,
    status: ShowingStatus,
    feedback?: string
  ) => {
    setUpdating(true);
    try {
      const updated = await crmService.updateShowingStatus(id, {
        status,
        feedback,
      });
      setShowings((prev) => prev.map((s) => (s.id === id ? updated : s)));
      setSelectedShowing(null);
      setFeedbackNote('');
    } catch (err) {
      console.error('Failed updating showing status:', err);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = showings.filter((s) => statusFilter === 'ALL' || s.status === statusFilter);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <Calendar className="w-6 h-6 mr-2 text-indigo-400" />
            Showing & Tour Schedule
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Confirmed walkthroughs and inbound client tour requests.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          {(['ALL', 'REQUESTED', 'CONFIRMED', 'COMPLETED', 'CANCELLED'] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                statusFilter === s
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-slate-900/60 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Showings List */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Calendar className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No showings in this view</p>
          <p className="text-xs text-slate-500 mt-1">New booking requests from marketplace buyers will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((showing) => (
            <div
              key={showing.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                {showing.propertyImageUrl ? (
                  <img
                    src={showing.propertyImageUrl}
                    alt=""
                    className="w-20 h-20 rounded-xl object-cover border border-slate-800 shrink-0"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center text-slate-600 shrink-0">
                    <Calendar className="w-6 h-6" />
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-white">{showing.propertyTitle}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        showing.status === 'CONFIRMED'
                          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                          : showing.status === 'REQUESTED'
                          ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          : showing.status === 'COMPLETED'
                          ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                          : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                      }`}
                    >
                      {showing.status}
                    </span>
                  </div>

                  {showing.propertyAddress && (
                    <p className="text-xs text-slate-400 flex items-center mt-1">
                      <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                      {showing.propertyAddress}, {showing.propertyCity}
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-300 mt-2">
                    <div className="flex items-center text-indigo-400 font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {new Date(showing.showingTime).toLocaleString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                    <div className="flex items-center text-slate-400">
                      {showing.showingType === 'VIRTUAL_TOUR' ? (
                        <Video className="w-3.5 h-3.5 mr-1 text-blue-400" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 mr-1 text-amber-400" />
                      )}
                      <span className="capitalize">{showing.showingType.replace('_', ' ').toLowerCase()}</span>
                    </div>
                    <div className="flex items-center text-slate-400">
                      <User className="w-3.5 h-3.5 mr-1" />
                      <span>{showing.clientName}</span>
                    </div>
                  </div>

                  {showing.notes && (
                    <p className="mt-2 text-[11px] text-slate-400 italic">
                      Client Note: "{showing.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Status Actions */}
              <div className="flex items-center space-x-2 shrink-0 self-end md:self-center">
                {showing.status === 'REQUESTED' && (
                  <button
                    onClick={() => handleUpdateStatus(showing.id, 'CONFIRMED')}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Confirm Tour
                  </button>
                )}

                {showing.status === 'CONFIRMED' && (
                  <button
                    onClick={() => setSelectedShowing(showing)}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" />
                    Mark Completed
                  </button>
                )}

                {showing.status !== 'CANCELLED' && showing.status !== 'COMPLETED' && (
                  <button
                    onClick={() => handleUpdateStatus(showing.id, 'CANCELLED')}
                    className="inline-flex items-center px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-300 text-slate-400 text-xs font-medium transition"
                  >
                    <XCircle className="w-3.5 h-3.5 mr-1" />
                    Decline
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Complete Showing Feedback Modal */}
      {selectedShowing && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedShowing(null)}
          title="Complete Property Walkthrough"
        >
          <div className="space-y-4 text-slate-900">
            <p className="text-xs text-slate-600">
              You are completing the walkthrough for <strong>{selectedShowing.propertyTitle}</strong> with client{' '}
              <strong>{selectedShowing.clientName}</strong>.
            </p>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                Client Feedback / Tour Impression
              </label>
              <textarea
                rows={3}
                value={feedbackNote}
                onChange={(e) => setFeedbackNote(e.target.value)}
                placeholder="e.g. Buyer loved high ceilings and kitchen island. Requested draft purchase contract."
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setSelectedShowing(null)}
                className="px-4 py-2 border border-slate-300 rounded-lg text-xs font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={updating}
                onClick={() => handleUpdateStatus(selectedShowing.id, 'COMPLETED', feedbackNote)}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-semibold disabled:opacity-50"
              >
                {updating ? 'Saving...' : 'Finish & Mark Completed'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
