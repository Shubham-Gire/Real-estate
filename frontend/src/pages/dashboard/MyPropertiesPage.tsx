import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { PropertyStatus, PropertySummary } from '../../types/property';
import { StatusBadge } from '../../components/common/StatusBadge';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import { useToast } from '../../context/ToastContext';
import {
  Building,
  PlusCircle,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

export const MyPropertiesPage: React.FC = () => {
  const { success, error } = useToast();

  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<PropertyStatus | 'ALL'>('ALL');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const fetchProperties = async () => {
    setIsLoading(true);
    try {
      const filter = {
        status: selectedStatus === 'ALL' ? undefined : selectedStatus,
        page,
        size: 10,
      };
      const res = await propertyService.getMyProperties(filter);
      setProperties(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      error(err.message || 'Failed to fetch properties');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProperties();
  }, [selectedStatus, page]);

  const handleStatusChange = async (id: string, status: PropertyStatus) => {
    try {
      await propertyService.updateStatus(id, status);
      success(`Property status transitioned to ${status}`);
      fetchProperties();
    } catch (err: any) {
      error(err.message || 'Failed to update status');
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to permanently delete this listing?')) return;

    try {
      await propertyService.deleteProperty(id);
      success('Listing deleted successfully');
      fetchProperties();
    } catch (err: any) {
      error(err.message || 'Failed to delete property');
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Properties Portfolio</h1>
          <p className="text-xs text-slate-500 mt-1">
            Review live listings, drafts, and approval status
          </p>
        </div>

        <Link
          to="/dashboard/properties/add"
          className="inline-flex items-center space-x-2 bg-primary-600 hover:bg-primary-700 text-white font-bold text-xs px-5 py-3 rounded-2xl shadow-sm transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Add New Property</span>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="flex space-x-1.5 p-1 bg-white rounded-2xl border border-slate-100 shadow-xs overflow-x-auto text-xs font-bold scrollbar-none">
        {(['ALL', 'PUBLISHED', 'PENDING_REVIEW', 'SOLD', 'RENTED'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => {
              setSelectedStatus(tab);
              setPage(0);
            }}
            className={`px-4 py-2 rounded-xl transition-all whitespace-nowrap ${
              selectedStatus === tab
                ? 'bg-primary-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            {tab === 'ALL' ? 'All Listings' : tab.replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Listings Table / Cards */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-400 font-bold">Querying property database...</p>
          </div>
        ) : properties.length === 0 ? (
          <div className="p-8">
            <EmptyState
              title="No Properties Found"
              description="You do not have any property listings under this status filter."
              actionText="List Property Now"
              onAction={() => window.location.assign('/dashboard/properties/add')}
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {properties.map((prop) => (
              <div
                key={prop.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-slate-50/50 transition-colors"
              >
                {/* Left: Thumbnail & Info */}
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative">
                    <img
                      src={
                        prop.primaryImageUrl ||
                        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
                      }
                      alt=""
                      className="w-full h-full object-cover"
                    />
                    {prop.featured && (
                      <span className="absolute top-1 left-1 p-1 bg-amber-500 rounded-md text-white text-[9px]">
                        <Sparkles className="w-2.5 h-2.5" />
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <StatusBadge status={prop.status} />
                      <span className="text-[11px] font-bold text-slate-400 uppercase">
                        For {prop.transactionType}
                      </span>
                    </div>

                    <Link
                      to={`/properties/${prop.id}`}
                      className="text-base font-bold text-slate-900 hover:text-primary-600 transition-colors line-clamp-1"
                    >
                      {prop.title}
                    </Link>

                    <p className="text-xs text-slate-500 mt-0.5">
                      {prop.locality}, {prop.city} •{' '}
                      <span className="font-extrabold text-slate-800">
                        ${prop.price.toLocaleString()}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Right: Actions */}
                <div className="flex flex-wrap items-center gap-2 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                  {prop.status === 'PUBLISHED' && (
                    <>
                      <button
                        onClick={() => handleStatusChange(prop.id, 'SOLD')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Mark Sold
                      </button>
                      <button
                        onClick={() => handleStatusChange(prop.id, 'RENTED')}
                        className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 hover:bg-slate-100 transition-colors"
                      >
                        Mark Rented
                      </button>
                    </>
                  )}

                  <Link
                    to={`/properties/${prop.id}`}
                    className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                    title="Public View"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </Link>

                  <Link
                    to={`/dashboard/properties/edit/${prop.id}`}
                    className="p-2 text-slate-500 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-colors"
                    title="Edit Listing"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>

                  <button
                    onClick={() => handleDelete(prop.id)}
                    className="p-2 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
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

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
};
