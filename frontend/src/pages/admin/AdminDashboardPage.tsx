import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { adminService } from '../../services/adminService';
import { AdminDashboardStats } from '../../types/admin';
import {
  Users,
  Building,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MessageSquare,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
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
} from 'recharts';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminService.getStats()
      .then((data) => setStats(data))
      .catch((err) => console.error('Failed to load admin stats', err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
    return (
      <div className="p-16 text-center">
        <div className="w-10 h-10 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
        <p className="text-xs text-slate-400 font-bold">Aggregating platform telemetry...</p>
      </div>
    );
  }

  const distributionData = [
    { name: 'Published', value: stats.publishedProperties, color: '#10b981' },
    { name: 'Pending Review', value: stats.pendingProperties, color: '#f59e0b' },
    { name: 'Rejected', value: stats.rejectedProperties, color: '#f43f5e' },
    { name: 'Suspended', value: stats.suspendedProperties, color: '#ef4444' },
  ];

  const barData = [
    { name: 'Total Users', count: stats.totalUsers },
    { name: 'Agents', count: stats.totalAgents },
    { name: 'Properties', count: stats.totalProperties },
    { name: 'Inquiries', count: stats.totalInquiries },
  ];

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-950 p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-2xl">
        <div>
          <span className="text-xs font-black uppercase tracking-widest text-primary-400">
            System Operations Console
          </span>
          <h1 className="text-2xl sm:text-3xl font-black text-white mt-1">Platform Telemetry & Metrics</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Real-time aggregate data sourced directly from PostgreSQL. Zero mock numbers.
          </p>
        </div>

        <Link
          to="/admin/moderation"
          className="inline-flex items-center space-x-2 px-6 py-3 rounded-2xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-black text-xs shadow-md transition-all self-start sm:self-auto"
        >
          <Clock className="w-4 h-4" />
          <span>Moderation Queue ({stats.pendingProperties})</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Users</span>
            <div className="p-2 rounded-xl bg-primary-950 text-primary-400 border border-primary-800/40">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalUsers}</div>
          <p className="text-[11px] text-slate-500 mt-1">{stats.totalAgents} Verified Agents</p>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Published Listings</span>
            <div className="p-2 rounded-xl bg-emerald-950 text-emerald-400 border border-emerald-800/40">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.publishedProperties}</div>
          <p className="text-[11px] text-slate-500 mt-1">{stats.totalProperties} Total Submissions</p>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-400">Pending Review</span>
            <div className="p-2 rounded-xl bg-amber-950 text-amber-400 border border-amber-800/40">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-amber-400">{stats.pendingProperties}</div>
          <p className="text-[11px] text-slate-500 mt-1">Awaiting moderator action</p>
        </div>

        <div className="bg-slate-950/80 p-5 rounded-3xl border border-slate-800">
          <div className="flex justify-between items-start mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Inquiries</span>
            <div className="p-2 rounded-xl bg-indigo-950 text-indigo-400 border border-indigo-800/40">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white">{stats.totalInquiries}</div>
          <p className="text-[11px] text-slate-500 mt-1">{stats.pendingReports} Active Reports</p>
        </div>
      </div>

      {/* Analytics Visualization Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bar Chart */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-slate-200">Platform Scale Breakdown</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                />
                <Bar dataKey="count" fill="#0e8ce9" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart */}
        <div className="bg-slate-950/80 p-6 rounded-3xl border border-slate-800 shadow-xl space-y-4">
          <h3 className="font-extrabold text-sm text-slate-200">Property Status Distribution</h3>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#020617', borderColor: '#334155', borderRadius: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-4 text-xs">
            {distributionData.map((d) => (
              <span key={d.name} className="flex items-center text-slate-400">
                <span className="w-2.5 h-2.5 rounded-full mr-1.5" style={{ backgroundColor: d.color }}></span>
                {d.name}: {d.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
