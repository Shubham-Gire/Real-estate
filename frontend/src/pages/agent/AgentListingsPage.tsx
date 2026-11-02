import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { PropertySummary } from '../../types/property';
import {
  Building2,
  Eye,
  MessageSquare,
  Plus,
  ArrowUpRight,
  MapPin,
  Calendar,
} from 'lucide-react';

export const AgentListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    propertyService
      .getMyProperties()
      .then((res) => {
        setProperties(res.content);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center">
            <Building2 className="w-6 h-6 mr-2 text-indigo-400" />
            Agent Property Portfolio
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Properties listed and represented under your exclusive agency.
          </p>
        </div>

        <Link
          to="/portal/submit-property"
          className="inline-flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold shadow-lg shadow-indigo-600/30 transition"
        >
          <Plus className="w-3.5 h-3.5 mr-1.5" />
          Create New Listing
        </Link>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-12 text-center">
          <Building2 className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-slate-300">No properties in portfolio</p>
          <p className="text-xs text-slate-500 mt-1">List your luxury inventory to generate buyer leads.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition shadow-lg flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-slate-950">
                  {prop.primaryImageUrl ? (
                    <img
                      src={prop.primaryImageUrl}
                      alt={prop.title}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-700">
                      <Building2 className="w-12 h-12" />
                    </div>
                  )}

                  <span
                    className={`absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                      prop.status === 'PUBLISHED'
                        ? 'bg-emerald-500/90 text-white'
                        : prop.status === 'PENDING_REVIEW'
                        ? 'bg-amber-500/90 text-white'
                        : 'bg-slate-800/90 text-slate-300'
                    }`}
                  >
                    {prop.status.replace('_', ' ')}
                  </span>

                  <span className="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-900/90 text-indigo-300">
                    {prop.transactionType}
                  </span>
                </div>

                <div className="p-5">
                  <p className="text-lg font-bold text-white">
                    ${prop.price.toLocaleString()}
                    {prop.transactionType === 'RENT' && (
                      <span className="text-xs text-slate-400 font-normal"> / mo</span>
                    )}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-200 mt-1 line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-400 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {prop.locality}, {prop.city}
                  </p>

                  <div className="flex items-center space-x-3 text-xs text-slate-400 mt-3 pt-3 border-t border-slate-800/80">
                    <span>{prop.bedrooms} Beds</span>
                    <span>•</span>
                    <span>{prop.bathrooms} Baths</span>
                    <span>•</span>
                    <span>{prop.builtUpSqft ? `${prop.builtUpSqft} sqft` : 'N/A'}</span>
                  </div>
                </div>
              </div>

              <div className="px-5 py-3.5 bg-slate-950/60 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center space-x-3">
                  <span className="flex items-center" title="Views">
                    <Eye className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    {prop.viewCount || 0}
                  </span>
                  <span className="flex items-center" title="Leads generated">
                    <MessageSquare className="w-3.5 h-3.5 mr-1 text-slate-500" />
                    Active
                  </span>
                </div>

                <Link
                  to={`/properties/${prop.id}`}
                  className="font-semibold text-indigo-400 hover:text-indigo-300 flex items-center"
                >
                  Public View
                  <ArrowUpRight className="w-3.5 h-3.5 ml-0.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
