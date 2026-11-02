import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  Heart,
  Calendar,
  MessageSquare,
  Building,
  PlusCircle,
  User,
  LogOut,
  ChevronRight,
  Compass,
} from 'lucide-react';

export const ClientLayout: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { to: '/portal/overview', label: 'Client Hub Overview', icon: Home },
    { to: '/portal/favorites', label: 'Saved Favorites', icon: Heart },
    { to: '/portal/showings', label: 'My Scheduled Tours', icon: Calendar },
    { to: '/portal/inquiries', label: 'My Inquiries', icon: MessageSquare },
    { to: '/portal/my-listings', label: 'My Listed Properties', icon: Building },
    { to: '/portal/submit-property', label: 'Post a Property', icon: PlusCircle },
    { to: '/portal/profile', label: 'Profile & Preferences', icon: User },
  ];

  return (
    <div className="min-h-screen bg-stone-50 text-slate-800 flex flex-col">
      {/* Top Client Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <Link to="/" className="flex items-center space-x-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                E
              </span>
              <span className="font-bold text-xl tracking-tight text-slate-900">
                Estate<span className="text-emerald-600">Hub</span>
              </span>
            </Link>
            <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
              Client Portal
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <Link
              to="/properties"
              className="inline-flex items-center text-sm font-medium text-slate-600 hover:text-emerald-600 transition"
            >
              <Compass className="w-4 h-4 mr-1.5" />
              Explore Marketplace
            </Link>
            <div className="h-5 w-px bg-stone-200" />
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 font-semibold flex items-center justify-center text-sm">
                {(user?.firstName || user?.email || 'U').charAt(0).toUpperCase()}
              </div>
              <div className="hidden md:block text-left">
                <p className="text-sm font-semibold text-slate-800 leading-none">
                  {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || user?.email?.split('@')[0]}
                </p>
                <p className="text-xs text-slate-500 mt-0.5 capitalize">Verified Buyer / Owner</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
              title="Sign Out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Body */}
      <div className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 flex flex-col md:flex-row gap-8">
        {/* Client Sidebar */}
        <aside className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-stone-200 sticky top-24">
            <div className="px-3 py-2 mb-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                My Workspace
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
                      `flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                        isActive
                          ? 'bg-emerald-50 text-emerald-700 font-semibold shadow-xs'
                          : 'text-slate-600 hover:bg-stone-50 hover:text-slate-900'
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

            <div className="mt-8 pt-4 border-t border-stone-100">
              <Link
                to="/portal/submit-property"
                className="w-full inline-flex items-center justify-center px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-semibold shadow-sm transition"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                List Your Property
              </Link>
            </div>
          </div>
        </aside>

        {/* Content Area */}
        <main className="flex-1 min-w-0">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
