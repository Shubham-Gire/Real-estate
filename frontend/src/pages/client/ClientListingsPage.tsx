import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { PropertySummary, PropertyStatus } from '../../types/property';
import {
  Building,
  PlusCircle,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Edit,
  Trash2,
} from 'lucide-react';

export const ClientListingsPage: React.FC = () => {
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [statusFilter, setStatusFilter] = useState<'ALL' | PropertyStatus>('ALL');
  const [loading, setLoading] = useState(true);

  const fetchProperties = async () => {
    try {
      const res = await propertyService.getMyProperties(
        statusFilter === 'ALL' ? undefined : { status: statusFilter }
      );
      setProperties(res.content);
    } catch (err) {
      console.error('Failed fetching owner listings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [statusFilter]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) return;
    try {
      await propertyService.deleteProperty(id);
      setProperties((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      console.error('Failed deleting property:', err);
    }
  };

  const handleMarkStatus = async (id: string, newStatus: PropertyStatus) => {
    try {
      await propertyService.updatePropertyStatus(id, newStatus);
      await fetchProperties();
    } catch (err) {
      console.error('Failed updating status:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
            <Building className="w-6 h-6 mr-2 text-emerald-600" />
            My Listed Properties
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track approval status, marketplace visibility, and mark properties as sold or rented.
          </p>
        </div>

        <Link
          to="/portal/submit-property"
          className="inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
        >
          <PlusCircle className="w-3.5 h-3.5 mr-1.5" />
          List New Property
        </Link>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center space-x-2 border-b border-stone-200 pb-3">
        {(['ALL', 'PENDING_REVIEW', 'PUBLISHED', 'SOLD', 'RENTED'] as const).map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              statusFilter === s
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white border border-stone-200 text-slate-600 hover:bg-stone-50'
            }`}
          >
            {s.replace('_', ' ')}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : properties.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
          <Building className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">No properties in this category</p>
          <p className="text-xs text-slate-500 mt-1">Post your property to start receiving buyer inquiries.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {properties.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
            >
              <div className="flex items-start space-x-4">
                {prop.primaryImageUrl ? (
                  <img
                    src={prop.primaryImageUrl}
                    alt=""
                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-xl bg-stone-100 flex items-center justify-center text-stone-400 shrink-0">
                    <Building className="w-8 h-8" />
                  </div>
                )}

                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="text-base font-bold text-slate-900">{prop.title}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        prop.status === 'PUBLISHED'
                          ? 'bg-emerald-100 text-emerald-800'
                          : prop.status === 'PENDING_REVIEW'
                          ? 'bg-amber-100 text-amber-800'
                          : prop.status === 'REJECTED'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {prop.status.replace('_', ' ')}
                    </span>
                  </div>

                  <p className="text-emerald-700 font-bold text-sm mt-1">
                    ${prop.price.toLocaleString()}
                    {prop.transactionType === 'RENT' && ' / month'}
                  </p>

                  <p className="text-xs text-slate-500 mt-1">
                    {prop.locality}, {prop.city} • {prop.bedrooms} Beds • {prop.bathrooms} Baths
                  </p>

                  <div className="flex items-center space-x-4 text-xs text-slate-400 mt-2">
                    <span className="flex items-center">
                      <Eye className="w-3.5 h-3.5 mr-1 text-slate-400" />
                      {prop.viewCount || 0} Marketplace Views
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 self-end md:self-center shrink-0">
                {prop.status === 'PUBLISHED' && (
                  <>
                    <button
                      onClick={() => handleMarkStatus(prop.id, 'SOLD')}
                      className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-slate-700 text-xs font-semibold transition"
                    >
                      Mark as Sold
                    </button>
                    <Link
                      to={`/properties/${prop.id}`}
                      className="px-3 py-1.5 rounded-lg border border-stone-200 text-slate-700 hover:text-emerald-700 text-xs font-semibold flex items-center transition"
                    >
                      View Live
                      <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                    </Link>
                  </>
                )}

                <Link
                  to={`/dashboard/properties/${prop.id}/edit`}
                  className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg transition"
                  title="Edit Listing"
                >
                  <Edit className="w-4 h-4" />
                </Link>

                <button
                  onClick={() => handleDelete(prop.id)}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
