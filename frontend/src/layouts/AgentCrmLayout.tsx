import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { crmService } from '../services/crmService';
import { AgentCrmStats } from '../types/crm';
import {
  LayoutDashboard,
  Kanban,
  Users,
  Briefcase,
  Calendar,
  Building2,
  BarChart3,
  BadgeCheck,
  Plus,
  LogOut,
  ChevronRight,
  TrendingUp,
  DollarSign,
  Compass,
} from 'lucide-react';
import { Modal } from '../components/common/Modal';

export const AgentCrmLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentCrmStats | null>(null);
  const [showQuickLeadModal, setShowQuickLeadModal] = useState(false);
  const [quickLeadForm, setQuickLeadForm] = useState({
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    budget: '',
    priority: 'HOT' as const,
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    crmService.getCrmStats().then(setStats).catch(console.error);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleCreateQuickLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickLeadForm.contactName || !quickLeadForm.contactEmail) return;
    setIsSubmitting(true);
    try {
      await crmService.createLead({
        contactName: quickLeadForm.contactName,
        contactEmail: quickLeadForm.contactEmail,
        contactPhone: quickLeadForm.contactPhone || undefined,
        budget: quickLeadForm.budget ? parseFloat(quickLeadForm.budget) : undefined,
        priority: quickLeadForm.priority,
        notes: quickLeadForm.notes || undefined,
      });
      setShowQuickLeadModal(false);
      setQuickLeadForm({ contactName: '', contactEmail: '', contactPhone: '', budget: '', priority: 'HOT', notes: '' });
      const updated = await crmService.getCrmStats();
      setStats(updated);
      // Trigger event or refresh if on pipeline
      window.dispatchEvent(new Event('crm-lead-created'));
    } catch (err) {
      console.error('Failed creating quick lead:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const navItems = [
    { to: '/agent/dashboard', label: 'CRM Cockpit', icon: LayoutDashboard },
    { to: '/agent/pipeline', label: 'Lead Pipeline (Kanban)', icon: Kanban },
    { to: '/agent/contacts', label: 'Client Directory', icon: Users },
    { to: '/agent/deals', label: 'Deals & Commission', icon: Briefcase },
    { to: '/agent/showings', label: 'Showings & Tours', icon: Calendar },
    { to: '/agent/listings', label: 'Property Portfolio', icon: Building2 },
    { to: '/agent/analytics', label: 'Revenue Analytics', icon: BarChart3 },
    { to: '/agent/profile', label: 'Agent Credentials', icon: BadgeCheck },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Professional Ticker / Header */}
      <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/agent/dashboard" className="flex items-center space-x-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center text-white font-extrabold shadow-md shadow-indigo-500/20">
                CRM
              </div>
              <div>
                <span className="font-bold text-lg tracking-tight text-white">
                  Estate<span className="text-indigo-400">Hub</span>
                </span>
                <span className="ml-2 text-xs font-semibold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                  Agent Pro
                </span>
              </div>
            </Link>

            {/* Pipeline Ticker */}
            {stats && (
              <div className="hidden lg:flex items-center space-x-4 pl-4 border-l border-slate-800 text-xs">
                <div className="flex items-center space-x-1.5 text-emerald-400">
                  <TrendingUp className="w-3.5 h-3.5" />
                  <span className="text-slate-400">Active Pipeline:</span>
                  <span className="font-bold">${stats.activePipelineBudget?.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-1.5 text-amber-400">
                  <DollarSign className="w-3.5 h-3.5" />
                  <span className="text-slate-400">Closed Commission:</span>
                  <span className="font-bold">${stats.closedCommissionYTD?.toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowQuickLeadModal(true)}
              className="inline-flex items-center px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-semibold shadow-sm transition shadow-indigo-600/30"
            >
              <Plus className="w-3.5 h-3.5 mr-1" />
              New Lead
            </button>

            <Link
              to="/properties"
              className="hidden sm:inline-flex items-center text-xs font-medium text-slate-400 hover:text-white transition"
            >
              <Compass className="w-3.5 h-3.5 mr-1" />
              Public Marketplace
            </Link>

            <div className="h-4 w-px bg-slate-800" />

            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-indigo-900 border border-indigo-700 text-indigo-200 font-bold flex items-center justify-center text-xs">
                {(user?.firstName || user?.email || 'A').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left text-xs">
                <p className="font-semibold text-slate-200 leading-tight">
                  {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email || 'John Sterling'}
                </p>
                <p className="text-indigo-400 text-[10px] font-medium flex items-center">
                  <BadgeCheck className="w-3 h-3 mr-0.5 text-indigo-400 inline" />
                  Licensed Broker
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Agent CRM Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-slate-900/80 backdrop-blur border border-slate-800 rounded-2xl p-4 sticky top-24 shadow-xl">
            <div className="px-3 py-2 mb-2">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Brokerage CRM Modules
              </p>
            </div>
            <nav className="space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                      }`
                    }
                  >
                    <div className="flex items-center space-x-3">
                      <Icon className="w-4 h-4" />
                      <span>{item.label}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                  </NavLink>
                );
              })}
            </nav>

            {/* Quick KPI pill */}
            {stats && (
              <div className="mt-8 p-3 bg-slate-950/70 border border-slate-800/80 rounded-xl text-xs">
                <div className="flex justify-between items-center text-slate-400 mb-1">
                  <span>Active Leads</span>
                  <span className="font-bold text-white">{stats.totalLeads}</span>
                </div>
                <div className="flex justify-between items-center text-slate-400">
                  <span>Showings Pending</span>
                  <span className="font-bold text-amber-400">{stats.upcomingShowingsCount}</span>
                </div>
              </div>
            )}
          </div>
        </aside>

        {/* Dynamic Route Outlet */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>

      {/* Quick Lead Modal */}
      <Modal
        isOpen={showQuickLeadModal}
        onClose={() => setShowQuickLeadModal(false)}
        title="Capture New CRM Lead"
      >
        <form onSubmit={handleCreateQuickLead} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Contact Name *</label>
            <input
              type="text"
              required
              value={quickLeadForm.contactName}
              onChange={(e) => setQuickLeadForm({ ...quickLeadForm, contactName: e.target.value })}
              placeholder="e.g. Eleanor Vance"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Contact Email *</label>
            <input
              type="email"
              required
              value={quickLeadForm.contactEmail}
              onChange={(e) => setQuickLeadForm({ ...quickLeadForm, contactEmail: e.target.value })}
              placeholder="eleanor@example.com"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={quickLeadForm.contactPhone}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, contactPhone: e.target.value })}
                placeholder="+1 555-0192"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Budget ($)</label>
              <input
                type="number"
                value={quickLeadForm.budget}
                onChange={(e) => setQuickLeadForm({ ...quickLeadForm, budget: e.target.value })}
                placeholder="2500000"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Initial Priority</label>
            <select
              value={quickLeadForm.priority}
              onChange={(e) => setQuickLeadForm({ ...quickLeadForm, priority: e.target.value as any })}
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            >
              <option value="HOT">🔥 Hot (Immediate interest, pre-approved)</option>
              <option value="WARM">☀️ Warm (Active search, evaluating)</option>
              <option value="COLD">❄️ Cold (Browsing / long timeline)</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">Notes / Preferences</label>
            <textarea
              rows={3}
              value={quickLeadForm.notes}
              onChange={(e) => setQuickLeadForm({ ...quickLeadForm, notes: e.target.value })}
              placeholder="e.g. Looking for 3BR penthouse with skyline views"
              className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setShowQuickLeadModal(false)}
              className="px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium disabled:opacity-50"
            >
              {isSubmitting ? 'Saving...' : 'Capture Lead'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
