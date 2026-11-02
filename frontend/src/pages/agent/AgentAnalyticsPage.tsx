import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import { AgentCrmStats } from '../../types/crm';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import { BarChart3, TrendingUp, DollarSign, Users } from 'lucide-react';

export const AgentAnalyticsPage: React.FC = () => {
  const [stats, setStats] = useState<AgentCrmStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmService.getCrmStats().then(setStats).catch(console.error).finally(() => setLoading(false));
  }, []);

  const monthlyVolumeData = [
    { month: 'Jun', volume: 2.4, commission: 72000 },
    { month: 'Jul', volume: 3.8, commission: 114000 },
    { month: 'Aug', volume: 1.8, commission: 54000 },
    { month: 'Sep', volume: 4.2, commission: 126000 },
    { month: 'Oct', volume: 5.5, commission: 165000 },
    { month: 'Nov (Proj)', volume: 6.8, commission: 204000 },
  ];

  const leadSourcesData = [
    { name: 'Website Marketplace', value: 45, color: '#6366f1' },
    { name: 'Referral & Network', value: 30, color: '#10b981' },
    { name: 'Zillow / Portals', value: 15, color: '#f59e0b' },
    { name: 'Open House / Direct', value: 10, color: '#06b6d4' },
  ];

  const stageFunnelData = stats?.leadsByStage
    ? [
        { stage: 'Inquiries', count: stats.leadsByStage.NEW_LEAD || 0 },
        { stage: 'Contacted', count: stats.leadsByStage.CONTACTED || 0 },
        { stage: 'Showings', count: stats.leadsByStage.SHOWING_SCHEDULED || 0 },
        { stage: 'Negotiation', count: stats.leadsByStage.OFFER_NEGOTIATION || 0 },
        { stage: 'Contract', count: stats.leadsByStage.UNDER_CONTRACT || 0 },
        { stage: 'Won', count: stats.leadsByStage.CLOSED_WON || 0 },
      ]
    : [];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <BarChart3 className="w-6 h-6 mr-2 text-indigo-400" />
          Agent Performance & Revenue Analytics
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Historical deal velocity, commission revenue trends, and client acquisition channels.
        </p>
      </div>

      {/* Monthly Sales & Commission Chart */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-base font-bold text-white">Closed Transaction Volume & Commission</h2>
            <p className="text-xs text-slate-400">Monthly gross sales in Millions ($M)</p>
          </div>
          <div className="flex items-center space-x-2 text-xs">
            <span className="inline-block w-3 h-3 rounded bg-indigo-500" />
            <span className="text-slate-400">Volume ($M)</span>
          </div>
        </div>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyVolumeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#fff', fontWeight: 'bold' }}
              />
              <Bar dataKey="volume" fill="#6366f1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Grid: Lead Funnel & Lead Sources */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Stage Funnel */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1">Pipeline Conversion Funnel</h3>
          <p className="text-xs text-slate-400 mb-6">Active volume of leads across pipeline phases</p>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={stageFunnelData}
                margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
                <XAxis type="number" stroke="#64748b" tick={{ fontSize: 11 }} />
                <YAxis dataKey="stage" type="category" stroke="#64748b" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Lead Source Breakdown */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
          <h3 className="text-base font-bold text-white mb-1">Client Acquisition Channels</h3>
          <p className="text-xs text-slate-400 mb-6">Lead source breakdown by percentage (%)</p>

          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={leadSourcesData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {leadSourcesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {leadSourcesData.map((item) => (
              <div key={item.name} className="flex items-center space-x-2 text-slate-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="truncate">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
