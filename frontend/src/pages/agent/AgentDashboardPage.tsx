import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { crmService } from '../../services/crmService';
import { AgentCrmStats, CrmLead, CrmShowing } from '../../types/crm';
import {
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  ArrowRight,
  Phone,
  Mail,
  Flame,
  CheckCircle2,
  Clock,
  Briefcase,
} from 'lucide-react';

export const AgentDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AgentCrmStats | null>(null);
  const [recentLeads, setRecentLeads] = useState<CrmLead[]>([]);
  const [upcomingShowings, setUpcomingShowings] = useState<CrmShowing[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    try {
      const [s, l, sh] = await Promise.all([
        crmService.getCrmStats(),
        crmService.getLeads(),
        crmService.getShowings('CONFIRMED'),
      ]);
      setStats(s);
      setRecentLeads(l.slice(0, 5));
      setUpcomingShowings(sh.slice(0, 4));
    } catch (err) {
      console.error('Failed to load agent CRM dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    window.addEventListener('crm-lead-created', loadData);
    return () => window.removeEventListener('crm-lead-created', loadData);
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-28 bg-slate-900 rounded-2xl border border-slate-800" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-900 rounded-2xl border border-slate-800" />
          ))}
        </div>
      </div>
    );
  }

  const stageDisplayNames: Record<string, string> = {
    NEW_LEAD: 'New Inquiries',
    CONTACTED: 'Contacted',
    SHOWING_SCHEDULED: 'Showings',
    OFFER_NEGOTIATION: 'Negotiation',
    UNDER_CONTRACT: 'Under Contract',
    CLOSED_WON: 'Closed Won',
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-indigo-900/60 via-slate-900 to-slate-900 border border-indigo-500/20 rounded-2xl p-6 relative overflow-hidden shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 mb-2">
              Agent Real Estate CRM
            </span>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Brokerage CRM Command Center
            </h1>
            <p className="text-sm text-slate-300 mt-1">
              Active pipeline monitoring, lead conversion tracking, and showing schedules.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link
              to="/agent/pipeline"
              className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
            >
              Open Kanban Board
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Active Pipeline Value</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-400">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${stats?.activePipelineBudget?.toLocaleString() || '0'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">Across active client negotiations</p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Total CRM Leads</span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats?.totalLeads || 0}</p>
          <p className="text-[11px] text-emerald-400 mt-1 flex items-center">
            <CheckCircle2 className="w-3 h-3 mr-1 inline" />
            {stats?.leadsByStage?.NEW_LEAD || 0} requiring response
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Closed Commission YTD</span>
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">
            ${stats?.closedCommissionYTD?.toLocaleString() || '0'}
          </p>
          <p className="text-[11px] text-slate-400 mt-1">
            +${stats?.projectedCommission?.toLocaleString() || '0'} projected
          </p>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-lg">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">Showings & Tours</span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-white mt-2">{stats?.upcomingShowingsCount || 0}</p>
          <p className="text-[11px] text-blue-400 mt-1">Active tours on calendar</p>
        </div>
      </div>

      {/* Pipeline Funnel Distribution */}
      {stats?.leadsByStage && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-white">Lead Pipeline Funnel</h2>
              <p className="text-xs text-slate-400">Stage progression distribution across active buyers</p>
            </div>
            <Link
              to="/agent/pipeline"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center"
            >
              Interactive Kanban
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {Object.entries(stageDisplayNames).map(([stageKey, label]) => {
              const count = stats.leadsByStage[stageKey] || 0;
              return (
                <div
                  key={stageKey}
                  className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-center"
                >
                  <p className="text-[11px] font-medium text-slate-400 truncate">{label}</p>
                  <p className="text-xl font-bold text-white mt-1">{count}</p>
                  <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                    <div
                      className="bg-indigo-500 h-full rounded-full"
                      style={{
                        width: stats.totalLeads > 0 ? `${(count / stats.totalLeads) * 100}%` : '0%',
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Split Grid: Recent Leads & Upcoming Showings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Inbound Leads */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">High Priority Leads</h3>
              <p className="text-xs text-slate-400">Requires follow-up action</p>
            </div>
            <Link
              to="/agent/pipeline"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              View All ({stats?.totalLeads})
            </Link>
          </div>

          <div className="space-y-3">
            {recentLeads.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No leads currently in queue.</p>
            ) : (
              recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="min-w-0 pr-3">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-sm text-slate-100 truncate">
                        {lead.contactName}
                      </span>
                      {lead.priority === 'HOT' && (
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30">
                          <Flame className="w-2.5 h-2.5 mr-0.5 text-rose-400 inline" />
                          HOT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      {lead.propertyTitle || 'General Representation'} • Budget: $
                      {lead.budget ? lead.budget.toLocaleString() : 'N/A'}
                    </p>
                    <div className="flex items-center space-x-3 text-[11px] text-slate-400 mt-1">
                      <span className="flex items-center">
                        <Mail className="w-3 h-3 mr-1" />
                        {lead.contactEmail}
                      </span>
                      {lead.contactPhone && (
                        <span className="flex items-center">
                          <Phone className="w-3 h-3 mr-1" />
                          {lead.contactPhone}
                        </span>
                      )}
                    </div>
                  </div>

                  <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 uppercase tracking-wider">
                    {stageDisplayNames[lead.stage] || lead.stage}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Showings / Tours */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-white">Upcoming Confirmed Tours</h3>
              <p className="text-xs text-slate-400">Scheduled walkthroughs with clients</p>
            </div>
            <Link
              to="/agent/showings"
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Agenda Calendar
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingShowings.length === 0 ? (
              <p className="text-xs text-slate-500 py-6 text-center">No confirmed showings this week.</p>
            ) : (
              upcomingShowings.map((showing) => (
                <div
                  key={showing.id}
                  className="p-3.5 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between hover:border-slate-700 transition"
                >
                  <div className="min-w-0 pr-3">
                    <p className="font-semibold text-sm text-slate-100 truncate">
                      {showing.propertyTitle}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">
                      Client: {showing.clientName} • {showing.clientEmail}
                    </p>
                    <div className="flex items-center space-x-2 text-[11px] text-amber-400 mt-1">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(showing.showingTime).toLocaleString()}</span>
                      <span className="text-slate-500">•</span>
                      <span className="text-slate-400 capitalize">
                        {showing.showingType.replace('_', ' ').toLowerCase()}
                      </span>
                    </div>
                  </div>

                  <span className="shrink-0 text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Confirmed
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
