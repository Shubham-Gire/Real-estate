import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { crmService } from '../../services/crmService';
import { CrmShowing } from '../../types/crm';
import {
  Calendar,
  Clock,
  MapPin,
  Building,
  Video,
  Eye,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react';

export const ClientShowingsPage: React.FC = () => {
  const [showings, setShowings] = useState<CrmShowing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    crmService
      .getMyShowings()
      .then(setShowings)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-emerald-600" />
          My Scheduled Property Tours
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review your upcoming and past walkthrough appointments with verified agents.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : showings.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
          <Calendar className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">No scheduled walkthroughs</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            When you request private tours on any property listing, they will appear here with confirmation details from the agent.
          </p>
          <Link
            to="/properties"
            className="mt-5 inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Browse Marketplace
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {showings.map((s) => (
            <div
              key={s.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center font-bold shrink-0">
                  <span className="text-[10px] uppercase text-emerald-800">
                    {new Date(s.showingTime).toLocaleString([], { month: 'short' })}
                  </span>
                  <span className="text-xl leading-none">
                    {new Date(s.showingTime).getDate()}
                  </span>
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{s.propertyTitle}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        s.status === 'CONFIRMED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : s.status === 'REQUESTED'
                          ? 'bg-amber-100 text-amber-800'
                          : s.status === 'COMPLETED'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {s.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                    <span className="flex items-center font-semibold text-emerald-700">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {new Date(s.showingTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span className="flex items-center">
                      {s.showingType === 'VIRTUAL_TOUR' ? (
                        <Video className="w-3.5 h-3.5 mr-1 text-blue-600" />
                      ) : (
                        <Eye className="w-3.5 h-3.5 mr-1 text-amber-600" />
                      )}
                      <span className="capitalize">{s.showingType.replace('_', ' ').toLowerCase()}</span>
                    </span>
                    {s.propertyAddress && (
                      <span className="flex items-center">
                        <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                        {s.propertyAddress}
                      </span>
                    )}
                  </div>

                  {s.notes && (
                    <p className="mt-2 text-xs text-slate-600 italic bg-stone-50 p-2 rounded-lg border border-stone-100">
                      Your note: "{s.notes}"
                    </p>
                  )}

                  {s.feedback && (
                    <p className="mt-2 text-xs text-indigo-700 font-medium bg-indigo-50 p-2 rounded-lg border border-indigo-100">
                      Agent feedback: "{s.feedback}"
                    </p>
                  )}
                </div>
              </div>

              <Link
                to={`/properties/${s.propertyId}`}
                className="inline-flex items-center px-4 py-2 border border-stone-200 hover:border-emerald-500 hover:text-emerald-700 rounded-xl text-xs font-semibold text-slate-700 transition shrink-0"
              >
                View Property Details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
