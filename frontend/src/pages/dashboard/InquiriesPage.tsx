import React, { useState, useEffect } from 'react';
import { inquiryService } from '../../services/inquiryService';
import { Inquiry, InquiryStatus } from '../../types/inquiry';
import { useToast } from '../../context/ToastContext';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  CheckCircle,
  Clock,
  Send,
  Building,
} from 'lucide-react';

export const InquiriesPage: React.FC = () => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<'received' | 'sent'>('received');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchInquiries = async () => {
    setLoading(true);
    try {
      const res =
        activeTab === 'received'
          ? await inquiryService.getReceivedInquiries(page, 15)
          : await inquiryService.getSentInquiries(page, 15);
      setInquiries(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      error(err.message || 'Failed to fetch inquiries');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInquiries();
  }, [activeTab, page]);

  const handleStatusChange = async (id: string, newStatus: InquiryStatus) => {
    try {
      await inquiryService.updateStatus(id, newStatus);
      success(`Lead status updated to ${newStatus}`);
      fetchInquiries();
    } catch (err: any) {
      error(err.message || 'Failed to update inquiry status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Inquiries & Leads Center
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Review prospect messages, update inquiry status, and track your property communication
        </p>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 p-1 bg-white rounded-2xl border border-slate-100 shadow-xs text-xs font-bold w-fit">
        <button
          onClick={() => {
            setActiveTab('received');
            setPage(0);
          }}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'received'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Received Inquiries (Client Leads)
        </button>
        <button
          onClick={() => {
            setActiveTab('sent');
            setPage(0);
          }}
          className={`px-5 py-2.5 rounded-xl transition-all ${
            activeTab === 'sent'
              ? 'bg-primary-600 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Sent Inquiries (My Requests)
        </button>
      </div>

      {/* Inquiries List */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-xs text-slate-400 font-bold">Loading inquiries...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-8">
            <EmptyState
              icon={MessageSquare}
              title={activeTab === 'received' ? 'No Leads Yet' : 'No Sent Inquiries'}
              description={
                activeTab === 'received'
                  ? 'Buyer messages and tour inquiries on your properties will appear here.'
                  : 'You have not sent inquiries on any marketplace properties yet.'
              }
            />
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {inquiries.map((inq) => (
              <div key={inq.id} className="p-6 space-y-4 hover:bg-slate-50/50 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900 text-base">{inq.name}</span>
                    <span className="text-xs text-slate-400">•</span>
                    <span className="text-xs font-semibold text-primary-600 flex items-center">
                      <Building className="w-3.5 h-3.5 mr-1" />
                      {inq.propertyTitle} ({inq.propertyCity})
                    </span>
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-400">
                    <span className="flex items-center">
                      <Calendar className="w-3.5 h-3.5 mr-1" />
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                {/* Message Body */}
                <div className="p-4 bg-slate-50 rounded-2xl text-xs sm:text-sm text-slate-700 leading-relaxed border border-slate-100/80">
                  "{inq.message}"
                </div>

                {/* Contact Actions & Status Controls */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
                  <div className="flex items-center space-x-3 text-xs">
                    {inq.phone && (
                      <a
                        href={`tel:${inq.phone}`}
                        className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold transition-colors"
                      >
                        <Phone className="w-3.5 h-3.5 text-primary-600" />
                        <span>{inq.phone}</span>
                      </a>
                    )}
                    <a
                      href={`mailto:${inq.email}`}
                      className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-700 font-bold transition-colors"
                    >
                      <Mail className="w-3.5 h-3.5 text-primary-600" />
                      <span>{inq.email}</span>
                    </a>
                  </div>

                  {activeTab === 'received' && (
                    <div className="flex items-center space-x-2">
                      <span className="text-xs font-bold text-slate-400">Status:</span>
                      <select
                        value={inq.status}
                        onChange={(e) => handleStatusChange(inq.id, e.target.value as InquiryStatus)}
                        className={`text-xs font-extrabold px-3 py-1.5 rounded-xl border focus:outline-hidden ${
                          inq.status === 'NEW'
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : inq.status === 'CONTACTED'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : inq.status === 'RESOLVED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="NEW">NEW</option>
                        <option value="CONTACTED">CONTACTED</option>
                        <option value="RESOLVED">RESOLVED</option>
                        <option value="CLOSED">CLOSED</option>
                      </select>
                    </div>
                  )}
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
