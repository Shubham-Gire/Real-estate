import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { authService } from '../../services/authService';
import { useToast } from '../../context/ToastContext';
import { User, Lock, Phone, Briefcase, Award, Shield, Save } from 'lucide-react';

export const ProfileSettingsPage: React.FC = () => {
  const { user } = useAuth();
  const { success, error } = useToast();

  // Profile Form State
  const [firstName, setFirstName] = useState(user?.firstName || '');
  const [lastName, setLastName] = useState(user?.lastName || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl || '');
  const [agencyName, setAgencyName] = useState(user?.agencyName || '');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [bio, setBio] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [changingPass, setChangingPass] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      await authService.updateProfile({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim() || undefined,
        avatarUrl: avatarUrl.trim() || undefined,
        agencyName: user?.role === 'ROLE_AGENT' ? agencyName.trim() : undefined,
        licenseNumber: user?.role === 'ROLE_AGENT' ? licenseNumber.trim() : undefined,
        bio: bio.trim() || undefined,
      });
      success('Profile details saved successfully!');
    } catch (err: any) {
      error(err.message || 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      error('New password and confirmation do not match.');
      return;
    }

    setChangingPass(true);
    try {
      await authService.changePassword({ currentPassword, newPassword });
      success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      error(err.message || 'Failed to change password. Check current password.');
    } finally {
      setChangingPass(false);
    }
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Profile & Security</h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, contact information, and account security
        </p>
      </div>

      {/* Account Info Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center">
          <User className="w-5 h-5 mr-2 text-primary-600" />
          Personal Particulars
        </h2>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                disabled
                value={user?.email || ''}
                className="w-full p-3 rounded-2xl bg-slate-100 border border-slate-200 text-sm font-semibold text-slate-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Direct Phone</label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+1 555-0199"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={avatarUrl}
              onChange={(e) => setAvatarUrl(e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
            />
          </div>

          {user?.role === 'ROLE_AGENT' && (
            <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-3">
              <p className="text-xs font-extrabold text-primary-800 uppercase tracking-wider">
                Brokerage Credentials
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agency Name</label>
                  <input
                    type="text"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">License Number</label>
                  <input
                    type="text"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-white border border-slate-200 text-xs font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Professional Bio</label>
            <textarea
              rows={3}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell clients about your real estate experience and service areas..."
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
            ></textarea>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={savingProfile}
              className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm rounded-2xl shadow-sm transition-all disabled:opacity-50 flex items-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>{savingProfile ? 'Saving...' : 'Save Profile Changes'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Password Update Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-xs space-y-6">
        <h2 className="text-base font-extrabold text-slate-900 flex items-center">
          <Lock className="w-5 h-5 mr-2 text-primary-600" />
          Update Password
        </h2>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Current Password *</label>
            <input
              type="password"
              required
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">New Password *</label>
              <input
                type="password"
                required
                minLength={6}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min 6 characters"
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm New Password *</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={changingPass}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm rounded-2xl shadow-sm transition-all disabled:opacity-50"
            >
              {changingPass ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
