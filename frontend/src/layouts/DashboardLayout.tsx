import React from 'react';
import { NavLink, Outlet, Link } from 'react-router-dom';
import { Navbar } from '../components/common/Navbar';
import { Footer } from '../components/common/Footer';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Building,
  PlusCircle,
  MessageSquare,
  Heart,
  User,
  ShieldCheck,
} from 'lucide-react';

export const DashboardLayout: React.FC = () => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { label: 'Overview', to: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'My Properties', to: '/dashboard/properties', icon: Building },
    { label: 'List New Property', to: '/dashboard/properties/add', icon: PlusCircle },
    { label: 'Inquiries & Leads', to: '/dashboard/inquiries', icon: MessageSquare },
    { label: 'Saved Favorites', to: '/dashboard/favorites', icon: Heart },
    { label: 'Profile Settings', to: '/dashboard/profile', icon: User },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans">
      <Navbar />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs sticky top-28">
              {/* User Mini Card */}
              <div className="flex items-center space-x-3 pb-6 border-b border-slate-100 mb-6">
                {user?.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt={user.firstName}
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-primary-500/20"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-base">
                    {user?.firstName?.[0]}
                    {user?.lastName?.[0]}
                  </div>
                )}
                <div className="overflow-hidden">
                  <h4 className="font-bold text-slate-900 truncate">
                    {user?.firstName} {user?.lastName}
                  </h4>
                  <span className="inline-block text-[10px] font-extrabold uppercase tracking-wider text-primary-600 bg-primary-50 px-2 py-0.5 rounded-md">
                    {user?.role.replace('ROLE_', '')}
                  </span>
                </div>
              </div>

              {/* Navigation Items */}
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
                            ? 'bg-primary-600 text-white shadow-sm shadow-primary-500/25'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Icon className="w-4 h-4 mr-3" />
                      {item.label}
                    </NavLink>
                  );
                })}

                {isAdmin && (
                  <div className="pt-4 mt-4 border-t border-slate-100">
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-3 rounded-2xl text-sm font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 transition-colors"
                    >
                      <ShieldCheck className="w-4 h-4 mr-3 text-amber-600" />
                      Admin Console
                    </Link>
                  </div>
                )}
              </nav>
            </div>
          </aside>

          {/* Main Area */}
          <section className="flex-1 min-w-0">
            <Outlet />
          </section>
        </div>
      </div>

      <Footer />
    </div>
  );
};
