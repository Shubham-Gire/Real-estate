import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { favoriteService } from '../../services/favoriteService';
import { notificationService } from '../../services/notificationService';
import {
  Building,
  Heart,
  Bell,
  User,
  PlusCircle,
  LogOut,
  LayoutDashboard,
  ShieldCheck,
  Menu,
  X,
  Compass,
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState<number>(0);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  useEffect(() => {
    if (user) {
      favoriteService.getFavoriteIds()
        .then((ids) => setFavoriteCount(ids.length))
        .catch(() => {});

      notificationService.getUnreadCount()
        .then((count) => setUnreadNotifications(count))
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleLogout = () => {
    logout();
    setProfileDropdownOpen(false);
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-11 h-11 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/25 group-hover:scale-105 transition-transform">
              <Building className="w-6 h-6" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 group-hover:text-primary-600 transition-colors">
                Estate<span className="text-primary-600">Hub</span>
              </span>
              <span className="hidden sm:block text-[10px] uppercase tracking-widest text-slate-400 font-semibold">
                Property Marketplace
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            <Link
              to="/properties"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.pathname === '/properties' && !location.search.includes('transactionType=')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
              }`}
            >
              Explore All
            </Link>
            <Link
              to="/properties?transactionType=SALE"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.search.includes('transactionType=SALE')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
              }`}
            >
              Buy
            </Link>
            <Link
              to="/properties?transactionType=RENT"
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-colors ${
                location.search.includes('transactionType=RENT')
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-slate-700 hover:text-primary-600 hover:bg-slate-50'
              }`}
            >
              Rent
            </Link>
            <Link
              to="/about"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-50 transition-colors"
            >
              About
            </Link>
            <Link
              to="/contact"
              className="px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 hover:text-primary-600 hover:bg-slate-50 transition-colors"
            >
              Contact
            </Link>
          </nav>

          {/* Right Header Actions */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <>
                {/* Favorites Icon */}
                <Link
                  to="/dashboard/favorites"
                  className="relative p-2.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Saved Favorites"
                >
                  <Heart className="w-5 h-5" />
                  {favoriteCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {favoriteCount}
                    </span>
                  )}
                </Link>

                {/* Notifications Icon */}
                <Link
                  to="/dashboard/inquiries"
                  className="relative p-2.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                  title="Notifications & Leads"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-primary-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </Link>

                {/* Role-Specific Primary CTA */}
                {user.role === 'ROLE_AGENT' ? (
                  <Link
                    to="/agent/dashboard"
                    className="inline-flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs shadow-indigo-500/20 transition-all hover:shadow-md"
                  >
                    <Building className="w-4 h-4" />
                    <span>Agent CRM</span>
                  </Link>
                ) : user.role === 'ROLE_ADMIN' ? (
                  <Link
                    to="/admin"
                    className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs shadow-amber-500/20 transition-all hover:shadow-md"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    <span>Admin Console</span>
                  </Link>
                ) : (
                  <Link
                    to="/portal/submit-property"
                    className="inline-flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-4 py-2.5 rounded-xl shadow-xs shadow-emerald-500/20 transition-all hover:shadow-md"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>List Property</span>
                  </Link>
                )}

                {/* Profile Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                    className="flex items-center space-x-3 p-1.5 pl-2.5 pr-3 rounded-xl border border-slate-200 hover:border-primary-300 hover:bg-slate-50 transition-all"
                  >
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl}
                        alt={user.firstName}
                        className="w-8 h-8 rounded-lg object-cover ring-2 ring-primary-500/20"
                      />
                    ) : (
                      <div className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 flex items-center justify-center font-bold text-xs">
                        {user.firstName[0]}
                        {user.lastName[0]}
                      </div>
                    )}
                    <span className="text-sm font-semibold text-slate-800 max-w-[100px] truncate">
                      {user.firstName}
                    </span>
                  </button>

                  {profileDropdownOpen && (
                    <div
                      onMouseLeave={() => setProfileDropdownOpen(false)}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fade-in"
                    >
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs text-slate-400">Signed in as</p>
                        <p className="text-sm font-bold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-primary-50 text-primary-700">
                          {user.role.replace('ROLE_', '')}
                        </span>
                      </div>

                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center px-4 py-2.5 text-sm font-bold text-amber-700 hover:bg-amber-50 transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 mr-3 text-amber-600" />
                          Admin Console
                        </Link>
                      )}

                      {user.role === 'ROLE_AGENT' && (
                        <>
                          <Link
                            to="/agent/dashboard"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm font-bold text-indigo-700 hover:bg-indigo-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-3 text-indigo-600" />
                            Agent CRM Cockpit
                          </Link>
                          <Link
                            to="/agent/pipeline"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Building className="w-4 h-4 mr-3 text-slate-400" />
                            Lead Pipeline (Kanban)
                          </Link>
                        </>
                      )}

                      {user.role === 'ROLE_USER' && (
                        <>
                          <Link
                            to="/portal/overview"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm font-bold text-emerald-700 hover:bg-emerald-50 transition-colors"
                          >
                            <LayoutDashboard className="w-4 h-4 mr-3 text-emerald-600" />
                            Client Portal Hub
                          </Link>
                          <Link
                            to="/portal/showings"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <Building className="w-4 h-4 mr-3 text-slate-400" />
                            My Scheduled Tours
                          </Link>
                        </>
                      )}

                      <Link
                        to="/portal/profile"
                        onClick={() => setProfileDropdownOpen(false)}
                        className="flex items-center px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                      >
                        <User className="w-4 h-4 mr-3 text-slate-400" />
                        Profile Settings
                      </Link>

                      <div className="border-t border-slate-100 my-1"></div>

                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2.5 text-sm text-rose-600 hover:bg-rose-50 transition-colors text-left font-medium"
                      >
                        <LogOut className="w-4 h-4 mr-3 text-rose-500" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="px-4 py-2.5 text-sm font-semibold text-slate-700 hover:text-primary-600 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-all hover:shadow-md"
                >
                  Register
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/properties"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-primary-50 rounded-lg"
          >
            Explore Properties
          </Link>
          <Link
            to="/properties?transactionType=SALE"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-primary-50 rounded-lg"
          >
            Buy Properties
          </Link>
          <Link
            to="/properties?transactionType=RENT"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-primary-50 rounded-lg"
          >
            Rent Properties
          </Link>
          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-primary-50 rounded-lg"
          >
            About Us
          </Link>
          <Link
            to="/contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 text-base font-semibold text-slate-800 hover:bg-primary-50 rounded-lg"
          >
            Contact
          </Link>

          <div className="pt-3 border-t border-slate-100">
            {user ? (
              <div className="space-y-2">
                <Link
                  to="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block w-full py-2.5 px-3 bg-slate-100 rounded-xl font-semibold text-center text-slate-800"
                >
                  Dashboard ({user.firstName})
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block w-full py-2.5 px-3 bg-primary-50 text-primary-700 rounded-xl font-semibold text-center"
                  >
                    Admin Console
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full py-2.5 px-3 text-rose-600 rounded-xl font-semibold text-center"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center font-semibold text-slate-700 border border-slate-200 rounded-xl"
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="py-2.5 px-4 text-center font-semibold text-white bg-primary-600 rounded-xl"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
