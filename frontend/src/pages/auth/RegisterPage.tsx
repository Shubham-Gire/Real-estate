import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Role } from '../../types/auth';
import { Building, Lock, Mail, User, Phone, Briefcase, Award, ArrowRight } from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const { register } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();

  const [role, setRole] = useState<Role>('ROLE_USER');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register({
        role,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
        phone: phone.trim() || undefined,
        agencyName: role === 'ROLE_AGENT' ? agencyName.trim() : undefined,
        licenseNumber: role === 'ROLE_AGENT' ? licenseNumber.trim() : undefined,
      });
      success('Welcome to EstateHub! Your account is created.');
      navigate('/dashboard');
    } catch (err: any) {
      error(err.message || 'Registration failed. Please check inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-xl w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/25">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Estate<span className="text-primary-600">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Join our marketplace as an individual seeker/owner or verified agent
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl">
          <button
            type="button"
            onClick={() => setRole('ROLE_USER')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              role === 'ROLE_USER'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Buyer / Private Owner
          </button>
          <button
            type="button"
            onClick={() => setRole('ROLE_AGENT')}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all ${
              role === 'ROLE_AGENT'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Real Estate Agent
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">First Name</label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Last Name</label>
              <input
                type="text"
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Doe"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="john@example.com"
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Min 6 characters"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 0123"
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold focus:outline-hidden"
                />
              </div>
            </div>
          </div>

          {/* Agent Specific Fields */}
          {role === 'ROLE_AGENT' && (
            <div className="p-4 bg-primary-50/50 rounded-2xl border border-primary-100 space-y-3">
              <p className="text-xs font-extrabold text-primary-800 uppercase tracking-wider">
                Professional Brokerage Details
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Agency / Brokerage</label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                      placeholder="Prime Realty Corp"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">License Number</label>
                  <div className="relative">
                    <Award className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      required
                      value={licenseNumber}
                      onChange={(e) => setLicenseNumber(e.target.value)}
                      placeholder="RE-109283"
                      className="w-full pl-10 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold focus:outline-hidden"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-md shadow-primary-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          Already registered?{' '}
          <Link to="/login" className="font-bold text-primary-600 hover:underline">
            Sign In here
          </Link>
        </p>
      </div>
    </div>
  );
};
