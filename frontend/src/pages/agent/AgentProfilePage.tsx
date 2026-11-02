import React, { useEffect, useState } from 'react';
import { crmService } from '../../services/crmService';
import { AgentProfile } from '../../types/crm';
import { BadgeCheck, Building, Award, ShieldCheck, Save } from 'lucide-react';

export const AgentProfilePage: React.FC = () => {
  const [profile, setProfile] = useState<AgentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    licenseNumber: '',
    agencyName: '',
    specialties: '',
    experienceYears: 1,
    commissionRate: 3.0,
    bio: '',
  });

  useEffect(() => {
    crmService
      .getAgentProfile()
      .then((p) => {
        setProfile(p);
        setFormData({
          licenseNumber: p.licenseNumber || '',
          agencyName: p.agencyName || '',
          specialties: p.specialties || '',
          experienceYears: p.experienceYears || 1,
          commissionRate: p.commissionRate || 3.0,
          bio: p.bio || '',
        });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await crmService.updateAgentProfile(formData);
      setProfile(updated);
    } catch (err) {
      console.error('Failed updating agent profile:', err);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
          <BadgeCheck className="w-6 h-6 mr-2 text-indigo-400" />
          Agent Credentials & Broker Profile
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Maintain your professional licensure, brokerage credentials, and marketplace disclosures.
        </p>
      </div>

      {/* Verified Status Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 font-extrabold text-xl">
            {profile?.agentName?.charAt(0) || 'A'}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-bold text-white">{profile?.agentName}</h2>
              {profile?.verified && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                  <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                  Verified Broker
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {profile?.agencyName || 'Independent Real Estate Brokerage'}
            </p>
            <p className="text-[11px] text-indigo-400 mt-1 font-mono">
              License: {profile?.licenseNumber || 'Pending Verification'}
            </p>
          </div>
        </div>

        <div className="hidden sm:block text-right">
          <span className="text-xs text-slate-400">Client Rating</span>
          <p className="text-xl font-bold text-amber-400">★ {profile?.rating || '4.90'}</p>
        </div>
      </div>

      {/* Profile Form */}
      <form onSubmit={handleSubmit} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-5">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider pb-3 border-b border-slate-800">
          Professional Brokerage Details
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Real Estate License Number *
            </label>
            <input
              type="text"
              required
              value={formData.licenseNumber}
              onChange={(e) => setFormData({ ...formData, licenseNumber: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Agency / Brokerage Firm *
            </label>
            <input
              type="text"
              required
              value={formData.agencyName}
              onChange={(e) => setFormData({ ...formData, agencyName: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="sm:col-span-2">
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Specialties & Asset Classes
            </label>
            <input
              type="text"
              value={formData.specialties}
              onChange={(e) => setFormData({ ...formData, specialties: e.target.value })}
              placeholder="e.g. Waterfront Villas, Penthouses, Relocation"
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1.5">
              Standard Commission (%)
            </label>
            <input
              type="number"
              step="0.1"
              value={formData.commissionRate}
              onChange={(e) => setFormData({ ...formData, commissionRate: parseFloat(e.target.value) || 3.0 })}
              className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-300 mb-1.5">
            Professional Biography & Track Record
          </label>
          <textarea
            rows={4}
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            placeholder="Highlight your closed transaction volume, neighborhood expertise, and client commitment..."
            className="w-full px-3.5 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-white focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-800">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition disabled:opacity-50"
          >
            <Save className="w-4 h-4 mr-2" />
            {saving ? 'Updating...' : 'Save Credentials'}
          </button>
        </div>
      </form>
    </div>
  );
};
