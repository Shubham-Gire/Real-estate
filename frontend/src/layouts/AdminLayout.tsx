import React from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  ShieldAlert,
  BarChart3,
  CheckSquare,
  Users,
  AlertTriangle,
  History,
  ArrowLeft,
  Building,
  LogOut,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { label: 'Platform Metrics', to: '/admin', icon: BarChart3, end: true },
    { label: 'Property Moderation', to: '/admin/moderation', icon: CheckSquare },
    { label: 'User Accounts', to: '/admin/users', icon: Users },
    { label: 'Abuse Reports', to: '/admin/reports', icon: AlertTriangle },
    { label: 'System Audit Logs', to: '/admin/audit-logs', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      {/* Admin Top Banner */}
      <header className="bg-slate-950 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2 text-white">
              <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-md">
                <Building className="w-5 h-5" />
              </div>
              <span className="font-black text-xl tracking-tight">EstateHub</span>
            </Link>
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Admin Console
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="hidden sm:flex items-center text-xs font-bold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4 mr-1.5" />
              Return to Marketplace
            </Link>
            <div className="h-4 w-px bg-slate-800 hidden sm:block"></div>
            <div className="flex items-center space-x-3 text-xs">
              <span className="text-slate-300 font-medium truncate max-w-[120px]">
                {user?.firstName} ({user?.email})
              </span>
              <button
                onClick={handleLogout}
                className="p-1.5 text-slate-400 hover:text-rose-400 rounded-lg transition-colors"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Admin Workspace */}
      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Admin Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-slate-950/80 rounded-3xl p-5 border border-slate-800 shadow-xl sticky top-26">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500 px-3 mb-3">
                Moderation & Operations
              </p>
              <nav className="space-y-1.5">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <NavLink
                      key={item.to}
                      to={item.to}
                      end={item.end}
                      className={({ isActive }) =>
                        `flex items-center px-4 py-3 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? 'bg-primary-600 text-white shadow-md shadow-primary-500/30'
                            : 'text-slate-400 hover:text-white hover:bg-slate-900'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </NavLink>
                  );
                })}
              </nav>

              <div className="mt-8 pt-6 border-t border-slate-800">
                <div className="p-4 rounded-2xl bg-slate-900/90 border border-slate-800/80 text-xs text-slate-400">
                  <p className="font-bold text-slate-200 mb-1 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400 mr-1.5" /> Security Notice
                  </p>
                  All administrative actions and moderation decisions are logged permanently with IP address and timestamp.
                </div>
              </div>
            </div>
          </aside>

          {/* Admin Page Content */}
          <section className="flex-1 min-w-0">
            <Outlet />
          </section>
        </div>
      </div>
    </div>
  );
};
