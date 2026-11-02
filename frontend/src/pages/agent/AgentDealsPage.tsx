import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import { CrmDeal, DealStatus, DealStage } from '../../types/crm';
import {
  Briefcase,
  DollarSign,
  TrendingUp,
  Plus,
  CheckCircle2,
  XCircle,
  Calendar,
  Building,
} from 'lucide-react';
import { Modal } from '../../components/common/Modal';

export const AgentDealsPage: React.FC = () => {
  const [deals, setDeals] = useState<CrmDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'ALL' | DealStatus>('ALL');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    dealName: '',
    clientName: '',
    dealValue: '',
    commissionRate: '3.00',
    stage: 'OFFER_SUBMITTED' as DealStage,
    expectedCloseDate: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const fetchDeals = async () => {
    try {
      const data = await crmService.getDeals();
      setDeals(data);
    } catch (err) {
      console.error('Failed fetching deals:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeals();
  }, []);

  const handleUpdateStatus = async (dealId: string, status: DealStatus) => {
    try {
      const updated = await crmService.updateDealStatus(dealId, status);
      setDeals((prev) => prev.map((d) => (d.id === dealId ? updated : d)));
    } catch (err) {
      console.error('Failed updating deal status:', err);
    }
  };

  const handleCreateDeal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.dealName || !formData.clientName || !formData.dealValue) return;
    setSubmitting(true);
    try {
      await crmService.createDeal({
        dealName: formData.dealName,
        clientName: formData.clientName,
        dealValue: parseFloat(formData.dealValue),
        commissionRate: parseFloat(formData.commissionRate),
        stage: formData.stage,
        expectedCloseDate: formData.expectedCloseDate || undefined,
      });
      setShowModal(false);
      setFormData({
        dealName: '',
        clientName: '',
        dealValue: '',
        commissionRate: '3.00',
        stage: 'OFFER_SUBMITTED',
        expectedCloseDate: '',
      });
      await fetchDeals();
    } catch (err) {
      console.error('Failed creating deal:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = deals.filter((d) => statusFilter === 'ALL' || d.status === statusFilter);

  const activeDealsValue = deals
    .filter((d) => d.status === 'ACTIVE')
    .reduce((acc, curr) => acc + curr.dealValue, 0);

  const projectedCommission = deals
    .filter((d) => d.status === 'ACTIVE')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);

  const wonCommission = deals
    .filter((d) => d.status === 'WON')
    .reduce((acc, curr) => acc + curr.commissionAmount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <Briefcase className="w-6 h-6 mr-2 text-indigo-400" />
            Deals & Commission Pipeline
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Track under-contract escrows, projected closings, and net broker commissions.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create Deal Transaction
        </button>
      </div>

      {/* Commission Metric Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400">Active Deals Pipeline</span>
          <p className="text-2xl font-bold text-white mt-1.5">
            ${activeDealsValue.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">
            {deals.filter((d) => d.status === 'ACTIVE').length} active transactions
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400">Projected Commission</span>
          <p className="text-2xl font-bold text-indigo-400 mt-1.5">
            ${projectedCommission.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Pending closing settlement</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <span className="text-xs font-medium text-slate-400">Closed Commission Won</span>
          <p className="text-2xl font-bold text-emerald-400 mt-1.5">
            ${wonCommission.toLocaleString()}
          </p>
          <p className="text-[11px] text-slate-500 mt-1">Booked earnings</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-slate-800 pb-3">
        {(['ALL', 'ACTIVE', 'WON', 'LOST'] as const).map((s) => (
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

      {/* Deals Table */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Briefcase className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No deals in this category</p>
          <p className="text-xs text-slate-500 mt-1">Add a new deal to start tracking commission.</p>
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
                <tr>
                  <th className="px-5 py-3.5">Deal & Property</th>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Deal Value</th>
                  <th className="px-5 py-3.5">Commission</th>
                  <th className="px-5 py-3.5">Stage</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80">
                {filtered.map((deal) => (
                  <tr key={deal.id} className="hover:bg-slate-800/40 transition">
                    <td className="px-5 py-4">
                      <p className="font-bold text-white text-sm">{deal.dealName}</p>
                      {deal.propertyTitle && (
                        <p className="text-slate-400 text-[11px] truncate flex items-center mt-0.5">
                          <Building className="w-3 h-3 mr-1 text-slate-500" />
                          {deal.propertyTitle}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-200">{deal.clientName}</td>
                    <td className="px-5 py-4 font-bold text-white">
                      ${deal.dealValue.toLocaleString()}
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-bold text-emerald-400">
                        ${deal.commissionAmount.toLocaleString()}
                      </p>
                      <p className="text-[10px] text-slate-500">Rate: {deal.commissionRate}%</p>
                    </td>
                    <td className="px-5 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-slate-300 uppercase tracking-wider">
                        {deal.stage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          deal.status === 'WON'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : deal.status === 'LOST'
                            ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                        }`}
                      >
                        {deal.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {deal.status === 'ACTIVE' && (
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => handleUpdateStatus(deal.id, 'WON')}
                            className="inline-flex items-center px-2 py-1 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[11px] font-semibold transition"
                            title="Mark as Won"
                          >
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Won
                          </button>
                          <button
                            onClick={() => handleUpdateStatus(deal.id, 'LOST')}
                            className="inline-flex items-center px-2 py-1 rounded bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 text-[11px] font-semibold transition"
                            title="Mark as Lost"
                          >
                            <XCircle className="w-3 h-3 mr-1" />
                            Lost
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Create Deal Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create New Deal Transaction">
        <form onSubmit={handleCreateDeal} className="space-y-4 text-slate-900">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Deal Title *</label>
            <input
              type="text"
              required
              value={formData.dealName}
              onChange={(e) => setFormData({ ...formData, dealName: e.target.value })}
              placeholder="e.g. Westlake Hills Contemporary Estate Sale"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Client Name *</label>
            <input
              type="text"
              required
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="e.g. Victoria Thorne"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Deal Value ($) *</label>
              <input
                type="number"
                required
                value={formData.dealValue}
                onChange={(e) => setFormData({ ...formData, dealValue: e.target.value })}
                placeholder="2150000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Commission Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={formData.commissionRate}
                onChange={(e) => setFormData({ ...formData, commissionRate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Transaction Stage</label>
              <select
                value={formData.stage}
                onChange={(e) => setFormData({ ...formData, stage: e.target.value as DealStage })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              >
                <option value="OFFER_SUBMITTED">Offer Submitted</option>
                <option value="UNDER_CONTRACT">Under Contract</option>
                <option value="CLOSING_INSPECTION">Closing & Inspection</option>
                <option value="SETTLEMENT">Settlement</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Target Close Date</label>
              <input
                type="date"
                value={formData.expectedCloseDate}
                onChange={(e) => setFormData({ ...formData, expectedCloseDate: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowModal(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? 'Creating...' : 'Create Deal'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
