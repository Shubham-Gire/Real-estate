import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { propertyService } from '../../services/propertyService';
import { inquiryService } from '../../services/inquiryService';
import { favoriteService } from '../../services/favoriteService';
import { PropertySummary } from '../../types/property';
import { Inquiry } from '../../types/inquiry';
import {
  Building,
  CheckCircle2,
  Clock,
  MessageSquare,
  Heart,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export const DashboardOverviewPage: React.FC = () => {
  const { user } = useAuth();

  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadOverviewData = async () => {
      try {
        const [propsRes, inqRes, favIds] = await Promise.all([
          propertyService.getMyProperties({ page: 0, size: 5 }),
          inquiryService.getReceivedInquiries(0, 5),
          favoriteService.getFavoriteIds(),
        ]);
        setProperties(propsRes.content);
        setInquiries(inqRes.content);
        setFavoriteCount(favIds.length);
      } catch (err) {
        console.error('Failed to load dashboard overview', err);
      } finally {
        setLoading(false);
      }
    };
    loadOverviewData();
  }, []);

  const totalPublished = properties.filter((p) => p.status === 'PUBLISHED').length;
  const totalPending = properties.filter((p) => p.status === 'PENDING_REVIEW').length;

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-3xl p-8 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-extrabold uppercase tracking-wider text-primary-400">
            Account Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-black mt-1">
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <p className="text-slate-400 text-sm mt-1 max-w-lg">
            Manage your properties, inspect incoming buyer inquiries, and review your market reach.
          </p>
        </div>

        <Link
          to="/dashboard/properties/add"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-sm px-6 py-3 rounded-2xl shadow-md shadow-primary-500/25 transition-all self-start sm:self-auto"
        >
          <PlusCircle className="w-5 h-5" />
          <span>List New Property</span>
        </Link>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <Building className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">My Listings</p>
            <p className="text-2xl font-black text-slate-900">{properties.length}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Published</p>
            <p className="text-2xl font-black text-slate-900">{totalPublished}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">In Review</p>
            <p className="text-2xl font-black text-slate-900">{totalPending}</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <MessageSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase">Leads Received</p>
            <p className="text-2xl font-black text-slate-900">{inquiries.length}</p>
          </div>
        </div>
      </div>

      {/* Recent Leads & Inquiries Table */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Inquiries & Leads</h2>
            <p className="text-xs text-slate-400">Buyers and prospects interested in your listings</p>
          </div>
          <Link
            to="/dashboard/inquiries"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center"
          >
            <span>View All Leads</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {inquiries.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm font-medium">
            No inquiries received yet. Once buyers contact your listings, they will appear here.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <div key={inq.id} className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-slate-900 text-sm">{inq.name}</span>
                    <span className="text-xs text-slate-400">• {inq.email}</span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-1">
                    Property: <strong className="text-slate-800">{inq.propertyTitle}</strong> — "{inq.message}"
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      inq.status === 'NEW'
                        ? 'bg-rose-50 text-rose-700 border border-rose-200'
                        : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    }`}
                  >
                    {inq.status}
                  </span>
                  <Link
                    to="/dashboard/inquiries"
                    className="text-xs font-bold text-primary-600 hover:underline"
                  >
                    Respond
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* My Recent Properties Preview */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-6 space-y-4">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">My Property Portfolio</h2>
            <p className="text-xs text-slate-400">Listings you manage on EstateHub</p>
          </div>
          <Link
            to="/dashboard/properties"
            className="text-xs font-bold text-primary-600 hover:text-primary-700 flex items-center"
          >
            <span>Manage All Properties</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-10 space-y-3">
            <Building className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-slate-500 text-sm font-medium">You have not published any properties yet.</p>
            <Link
              to="/dashboard/properties/add"
              className="inline-block bg-primary-600 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs"
            >
              List Your First Property
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {properties.map((prop) => (
              <div key={prop.id} className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0">
                    <img
                      src={prop.primaryImageUrl || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-sm line-clamp-1">{prop.title}</h4>
                    <p className="text-xs text-slate-400">
                      {prop.locality}, {prop.city} • ${prop.price.toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-xs font-bold text-slate-500 uppercase">{prop.status}</span>
                  <Link
                    to={`/properties/${prop.id}`}
                    className="text-xs font-bold text-slate-700 hover:text-primary-600"
                  >
                    View
                  </Link>
                  <Link
                    to={`/dashboard/properties/edit/${prop.id}`}
                    className="text-xs font-bold text-primary-600 hover:text-primary-700"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
