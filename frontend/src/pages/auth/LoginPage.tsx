import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { Building, Lock, Mail, ArrowRight, ShieldCheck, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const from = (location.state as any)?.from?.pathname || '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login({ email: email.trim(), password });
      success('Welcome back to EstateHub!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    try {
      await login({ email: demoEmail, password: demoPass });
      success('Logged in with demo credentials!');
      navigate(from, { replace: true });
    } catch (err: any) {
      error(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12 bg-slate-50">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-slate-100 shadow-xl space-y-6">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2.5 mb-4 group">
            <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/25">
              <Building className="w-5 h-5" />
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Estate<span className="text-primary-600">Hub</span>
            </span>
          </Link>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sign In to Your Account</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your personalized dashboard, listings, and client leads
          </p>
        </div>

        {/* Demo Fast Login Buttons */}
        <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100 space-y-2">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400 text-center">
            Quick 1-Click Demo Logins
          </p>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@estatehub.com', 'AdminSecure2026!')}
              className="px-2 py-1.5 bg-white hover:bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-2xs"
            >
              <ShieldCheck className="w-3.5 h-3.5 mr-1 text-amber-600" /> Admin
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('agent.john@estatehub.com', 'Agent1234!')}
              className="px-2 py-1.5 bg-white hover:bg-primary-50 text-primary-700 border border-primary-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-2xs"
            >
              <Building className="w-3.5 h-3.5 mr-1 text-primary-600" /> Agent
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('buyer.alice@estatehub.com', 'User1234!')}
              className="px-2 py-1.5 bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all flex items-center justify-center shadow-2xs"
            >
              <UserCheck className="w-3.5 h-3.5 mr-1 text-slate-600" /> Buyer
            </button>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-md shadow-primary-500/25 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] disabled:opacity-50"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            {!loading && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        <p className="text-center text-xs text-slate-500 font-medium">
          Do not have an account?{' '}
          <Link to="/register" className="font-bold text-primary-600 hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};
