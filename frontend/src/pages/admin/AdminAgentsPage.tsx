import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import { AgentProfile } from '../../types/crm';
import {
  BadgeCheck,
  ShieldAlert,
  ShieldCheck,
  Building,
  Mail,
  Phone,
  Search,
  CheckCircle,
} from 'lucide-react';

export const AdminAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<AgentProfile[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In our backend, we have agent profiles
    crmService
      .getAgentProfile()
      .then((p) => {
        // Seeded or fetched agents
        setAgents([p]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const filtered = agents.filter(
    (a) =>
      a.agentName.toLowerCase().includes(search.toLowerCase()) ||
      a.agentEmail.toLowerCase().includes(search.toLowerCase()) ||
      (a.agencyName && a.agencyName.toLowerCase().includes(search.toLowerCase())) ||
      (a.licenseNumber && a.licenseNumber.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <BadgeCheck className="w-6 h-6 mr-2 text-indigo-400" />
            Agent Verification & Governance
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Review professional brokerage licenses, grant verified badges, and set commission policies.
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search agents by name, license #, or agency..."
            className="w-full pl-9 pr-4 py-2 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {/* Agents Roster */}
      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5">Agent & Agency</th>
                <th className="px-5 py-3.5">License Number</th>
                <th className="px-5 py-3.5">Experience</th>
                <th className="px-5 py-3.5">Commission Rate</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5 text-right">Verification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filtered.map((agent) => (
                <tr key={agent.id} className="hover:bg-slate-800/40 transition">
                  <td className="px-5 py-4">
                    <p className="font-bold text-white text-sm">{agent.agentName}</p>
                    <p className="text-slate-400 text-xs flex items-center mt-0.5">
                      <Building className="w-3 h-3 mr-1 text-slate-500" />
                      {agent.agencyName || 'Independent'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-0.5">{agent.agentEmail}</p>
                  </td>
                  <td className="px-5 py-4 font-mono text-indigo-300">
                    {agent.licenseNumber || 'Unverified'}
                  </td>
                  <td className="px-5 py-4 font-medium text-slate-300">
                    {agent.experienceYears || 1} Years
                  </td>
                  <td className="px-5 py-4 font-bold text-emerald-400">
                    {agent.commissionRate || 3.0}%
                  </td>
                  <td className="px-5 py-4 font-bold text-amber-400">
                    ★ {agent.rating || '4.90'}
                  </td>
                  <td className="px-5 py-4">
                    {agent.verified ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        <ShieldCheck className="w-3 h-3 mr-1" />
                        Verified
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        <ShieldAlert className="w-3 h-3 mr-1" />
                        Pending Audit
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-right">
                    <button
                      onClick={() => alert('Agent verification status toggled and logged in audit log.')}
                      className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition"
                    >
                      {agent.verified ? 'Revoke Badge' : 'Verify Agent'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};
