import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { favoriteService } from '../../services/favoriteService';
import { crmService } from '../../services/crmService';
import { inquiryService } from '../../services/inquiryService';
import { propertyService } from '../../services/propertyService';
import { CrmShowing } from '../../types/crm';
import { PropertySummary } from '../../types/property';
import {
  Heart,
  Calendar,
  MessageSquare,
  Building,
  PlusCircle,
  Compass,
  ArrowRight,
  Clock,
  MapPin,
  CheckCircle2,
} from 'lucide-react';

export const ClientOverviewPage: React.FC = () => {
  const { user } = useAuth();
  const [favoritesCount, setFavoritesCount] = useState(0);
  const [showings, setShowings] = useState<CrmShowing[]>([]);
  const [inquiriesCount, setInquiriesCount] = useState(0);
  const [myListingsCount, setMyListingsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      favoriteService.getMyFavorites().then((res: PropertySummary[]) => setFavoritesCount(res.length)).catch(() => {}),
      crmService.getMyShowings().then((res) => setShowings(res)).catch(() => {}),
      inquiryService.getSentInquiries().then((res) => setInquiriesCount(res.totalElements || 0)).catch(() => {}),
      propertyService.getMyProperties().then((res) => setMyListingsCount(res.totalElements || 0)).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-800 rounded-3xl p-8 text-white relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur mb-3">
            Consumer Real Estate Hub
          </span>
          <h1 className="text-3xl font-extrabold tracking-tight">
            Welcome back, {[user?.firstName, user?.lastName].filter(Boolean).join(' ') || 'Property Buyer'}
          </h1>
          <p className="text-emerald-100 text-sm mt-2 leading-relaxed">
            Manage your saved dream homes, upcoming scheduled private walkthroughs, and personal property listings in one place.
          </p>

          <div className="flex flex-wrap gap-3 mt-6">
            <Link
              to="/properties"
              className="inline-flex items-center px-4 py-2.5 bg-white text-emerald-800 rounded-xl text-xs font-bold shadow-md hover:bg-emerald-50 transition"
            >
              <Compass className="w-4 h-4 mr-2 text-emerald-600" />
              Explore Marketplace
            </Link>
            <Link
              to="/portal/submit-property"
              className="inline-flex items-center px-4 py-2.5 bg-emerald-800/80 hover:bg-emerald-800 border border-emerald-500/30 text-white rounded-xl text-xs font-bold transition"
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              List a Property
            </Link>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          to="/portal/favorites"
          className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-emerald-500 transition shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Saved Favorites</span>
            <div className="p-2 rounded-xl bg-rose-50 text-rose-500 group-hover:scale-110 transition">
              <Heart className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{favoritesCount}</p>
          <p className="text-xs text-slate-500 mt-1">Properties in wishlist</p>
        </Link>

        <Link
          to="/portal/showings"
          className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-emerald-500 transition shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Scheduled Tours</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{showings.length}</p>
          <p className="text-xs text-blue-600 mt-1">Walkthrough appointments</p>
        </Link>

        <Link
          to="/portal/inquiries"
          className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-emerald-500 transition shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Sent Inquiries</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{inquiriesCount}</p>
          <p className="text-xs text-slate-500 mt-1">Direct questions to agents</p>
        </Link>

        <Link
          to="/portal/my-listings"
          className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-emerald-500 transition shadow-xs group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">My Listings</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition">
              <Building className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-bold text-slate-900 mt-2">{myListingsCount}</p>
          <p className="text-xs text-slate-500 mt-1">Properties posted by you</p>
        </Link>
      </div>

      {/* Upcoming Showings Section */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-slate-900">My Upcoming Property Tours</h2>
            <p className="text-xs text-slate-500">Private showings scheduled with licensed agents</p>
          </div>
          <Link
            to="/portal/showings"
            className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {showings.length === 0 ? (
          <div className="p-8 text-center bg-stone-50 rounded-xl border border-stone-100">
            <Calendar className="w-10 h-10 text-stone-400 mx-auto mb-2" />
            <p className="text-xs font-semibold text-slate-700">No scheduled tours</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Browse listings on the marketplace and click "Book a Tour" to schedule a private walkthrough.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {showings.slice(0, 3).map((s) => (
              <div
                key={s.id}
                className="p-4 bg-stone-50 rounded-xl border border-stone-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-sm font-bold text-slate-900">{s.propertyTitle}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'REQUESTED'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-slate-500 mt-1">
                    <span className="flex items-center text-emerald-700 font-semibold">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {new Date(s.showingTime).toLocaleString([], {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {s.propertyAddress && (
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1" />
                        {s.propertyAddress}
                      </span>
                    )}
                  </div>
                </div>

                <Link
                  to={`/properties/${s.propertyId}`}
                  className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 shrink-0"
                >
                  View Listing
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
