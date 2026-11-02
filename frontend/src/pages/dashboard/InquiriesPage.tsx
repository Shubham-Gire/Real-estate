
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  MessageSquare,
  Phone,
  Mail,
  Calendar,
  Building,
  Search,
  RefreshCw,
  Clock,
  CheckCircle,
  Send,
  AlertCircle,
  Loader2,
} from 'lucide-react';

import { inquiryService } from '../../services/inquiryService';
import { Inquiry, InquiryStatus } from '../../types/inquiry';
import { useToast } from '../../context/ToastContext';
import { Pagination } from '../../components/common/Pagination';
import { EmptyState } from '../../components/common/EmptyState';

type InquiryTab = 'received' | 'sent';

const PAGE_SIZE = 15;

const STATUS_OPTIONS: InquiryStatus[] = [
  'NEW',
  'CONTACTED',
  'RESOLVED',
  'CLOSED',
];

const STATUS_STYLES: Record<string, string> = {
  NEW: 'bg-rose-50 text-rose-700 border-rose-200',
  CONTACTED: 'bg-amber-50 text-amber-700 border-amber-200',
  RESOLVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  CLOSED: 'bg-slate-100 text-slate-700 border-slate-200',
};

const formatDate = (value: string) => {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Date unavailable';
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
};

export const InquiriesPage: React.FC = () => {
  const { success, error } = useToast();

  const [activeTab, setActiveTab] = useState<InquiryTab>('received');
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [updatingIds, setUpdatingIds] = useState<Set<string>>(
    () => new Set()
  );

  const fetchInquiries = useCallback(async () => {
    setLoading(true);
    setLoadError(null);

    try {
      const response =
        activeTab === 'received'
          ? await inquiryService.getReceivedInquiries(page, PAGE_SIZE)
          : await inquiryService.getSentInquiries(page, PAGE_SIZE);

      setInquiries(response.content ?? []);
      setTotalPages(Math.max(1, response.totalPages ?? 1));
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : 'Unable to load inquiries. Please try again.';

      setLoadError(message);
      error(message);
    } finally {
      setLoading(false);
    }
  }, [activeTab, page, error]);

  useEffect(() => {
    void fetchInquiries();
  }, [fetchInquiries]);

  const filteredInquiries = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return inquiries;

    return inquiries.filter((inq) =>
      [
        inq.name,
        inq.email,
        inq.phone,
        inq.propertyTitle,
        inq.propertyCity,
        inq.message,
        inq.status,
      ].some((value) => String(value ?? '').toLowerCase().includes(query))
    );
  }, [inquiries, search]);

  const changeTab = (tab: InquiryTab) => {
    if (tab === activeTab) return;

    setActiveTab(tab);
    setPage(0);
    setSearch('');
  };

  const handleStatusChange = async (
    inquiry: Inquiry,
    newStatus: InquiryStatus
  ) => {
    if (inquiry.status === newStatus || updatingIds.has(inquiry.id)) {
      return;
    }

    const previousStatus = inquiry.status;

    setUpdatingIds((current) => new Set(current).add(inquiry.id));

    // Optimistic update: immediately reflect the selected status.
    setInquiries((current) =>
      current.map((item) =>
        item.id === inquiry.id ? { ...item, status: newStatus } : item
      )
    );

    try {
      await inquiryService.updateStatus(inquiry.id, newStatus);
      success(`Inquiry status updated to ${newStatus}`);
    } catch (err: unknown) {
      // Restore the previous status if the server rejects the update.
      setInquiries((current) =>
        current.map((item) =>
          item.id === inquiry.id
            ? { ...item, status: previousStatus }
            : item
        )
      );

      error(
        err instanceof Error
          ? err.message
          : 'Failed to update inquiry status.'
      );
    } finally {
      setUpdatingIds((current) => {
        const next = new Set(current);
        next.delete(inquiry.id);
        return next;
      });
    }
  };

  return (
    <main className="space-y-6">
      {/* Page header */}
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Inquiries &amp; Leads Center
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage property inquiries, follow up with prospects, and track
            lead status.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void fetchInquiries()}
          disabled={loading}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`}
          />
          Refresh
        </button>
      </header>

      {/* Tabs */}
      <div
        className="flex w-full flex-col gap-2 rounded-2xl border border-slate-200 bg-white p-2 sm:w-fit sm:flex-row"
        role="tablist"
        aria-label="Inquiry categories"
      >
        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'received'}
          onClick={() => changeTab('received')}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
            activeTab === 'received'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <MessageSquare className="h-4 w-4" />
          Received Leads
        </button>

        <button
          type="button"
          role="tab"
          aria-selected={activeTab === 'sent'}
          onClick={() => changeTab('sent')}
          className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-bold transition ${
            activeTab === 'sent'
              ? 'bg-primary-600 text-white shadow-sm'
              : 'text-slate-600 hover:bg-slate-50'
          }`}
        >
          <Send className="h-4 w-4" />
          Sent Inquiries
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-xl">
        <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search by name, email, property, city, or message..."
          aria-label="Search inquiries"
          className="w-full rounded-2xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-primary-500 focus:ring-2 focus:ring-primary-100"
        />
      </div>

      {/* Content */}
      <section
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        aria-label={activeTab === 'received' ? 'Received inquiries' : 'Sent inquiries'}
      >
        {loading ? (
          <div
            className="flex flex-col items-center justify-center gap-3 p-16"
            role="status"
          >
            <Loader2 className="h-8 w-8 animate-spin text-primary-600" />
            <p className="text-sm font-medium text-slate-500">
              Loading inquiries...
            </p>
          </div>
        ) : loadError ? (
          <div className="flex flex-col items-center gap-3 p-12 text-center">
            <AlertCircle className="h-10 w-10 text-rose-500" />
            <h2 className="font-bold text-slate-900">
              Could not load inquiries
            </h2>
            <p className="max-w-md text-sm text-slate-500">{loadError}</p>
            <button
              type="button"
              onClick={() => void fetchInquiries()}
              className="rounded-xl bg-primary-600 px-4 py-2.5 text-sm font-bold text-white hover:opacity-90"
            >
              Try again
            </button>
          </div>
        ) : filteredInquiries.length === 0 ? (
          <div className="p-8">
            {search.trim() ? (
              <EmptyState
                icon={Search}
                title="No matching inquiries"
                description="Try another name, email address, property, city, or keyword."
              />
            ) : (
              <EmptyState
                icon={MessageSquare}
                title={
                  activeTab === 'received'
                    ? 'No Leads Yet'
                    : 'No Sent Inquiries'
                }
                description={
                  activeTab === 'received'
                    ? 'Buyer messages and viewing requests for your properties will appear here.'
                    : 'Your requests about marketplace properties will appear here.'
                }
              />
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filteredInquiries.map((inq) => {
              const isUpdating = updatingIds.has(inq.id);

              return (
                <article
                  key={inq.id}
                  className="space-y-4 p-5 transition-colors hover:bg-slate-50/70 sm:p-6"
                >
                  {/* Inquiry heading */}
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div className="min-w-0">
                      <h2 className="break-words text-base font-extrabold text-slate-900">
                        {inq.name || 'Unknown contact'}
                      </h2>

                      <p className="mt-1 flex items-start gap-1.5 text-sm font-semibold text-primary-700">
                        <Building className="mt-0.5 h-4 w-4 shrink-0" />
                        <span className="break-words">
                          {inq.propertyTitle || 'Property unavailable'}
                          {inq.propertyCity ? ` · ${inq.propertyCity}` : ''}
                        </span>
                      </p>
                    </div>

                    <div className="flex shrink-0 items-center gap-1.5 text-xs text-slate-500">
                      <Calendar className="h-4 w-4" />
                      <time dateTime={inq.createdAt}>
                        {formatDate(inq.createdAt)}
                      </time>
                    </div>
                  </div>

                  {/* Message */}
                  <div className="whitespace-pre-wrap break-words rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-6 text-slate-700">
                    {inq.message || 'No message provided.'}
                  </div>

                  {/* Contact actions */}
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex flex-wrap items-center gap-2">
                      {inq.phone && (
                        <a
                          href={`tel:${inq.phone}`}
                          className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                          aria-label={`Call ${inq.name}`}
                        >
                          <Phone className="h-4 w-4 shrink-0 text-primary-600" />
                          <span className="break-all">{inq.phone}</span>
                        </a>
                      )}

                      {inq.email && (
                        <a
                          href={`mailto:${inq.email}`}
                          className="inline-flex max-w-full items-center gap-2 rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 transition hover:bg-slate-200"
                          aria-label={`Email ${inq.name}`}
                        >
                          <Mail className="h-4 w-4 shrink-0 text-primary-600" />
                          <span className="break-all">{inq.email}</span>
                        </a>
                      )}

                      {!inq.phone && !inq.email && (
                        <span className="text-xs text-slate-400">
                          No contact details available
                        </span>
                      )}
                    </div>

                    {/* Status management for received leads */}
                    {activeTab === 'received' && (
                      <div className="flex items-center gap-2">
                        {isUpdating ? (
                          <Loader2
                            className="h-4 w-4 animate-spin text-primary-600"
                            aria-label="Updating status"
                          />
                        ) : inq.status === 'RESOLVED' ? (
                          <CheckCircle className="h-4 w-4 text-emerald-600" />
                        ) : inq.status === 'NEW' ? (
                          <Clock className="h-4 w-4 text-rose-600" />
                        ) : null}

                        <label
                          htmlFor={`status-${inq.id}`}
                          className="text-xs font-bold text-slate-500"
                        >
                          Status
                        </label>

                        <select
                          id={`status-${inq.id}`}
                          value={inq.status}
                          disabled={isUpdating}
                          onChange={(event) =>
                            void handleStatusChange(
                              inq,
                              event.target.value as InquiryStatus
                            )
                          }
                          className={`max-w-full rounded-xl border px-3 py-2 text-xs font-extrabold outline-none transition focus:ring-2 focus:ring-primary-100 disabled:cursor-wait disabled:opacity-60 ${
                            STATUS_STYLES[inq.status] ??
                            'border-slate-200 bg-white text-slate-700'
                          }`}
                        >
                          {!STATUS_OPTIONS.includes(inq.status) && (
                            <option value={inq.status}>{inq.status}</option>
                          )}
                          {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                              {status}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {/* Pagination */}
      {!loading && !loadError && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={(nextPage) => {
            if (
              nextPage >= 0 &&
              nextPage < totalPages &&
              nextPage !== page
            ) {
              setPage(nextPage);
            }
          }}
        />
      )}

      {!loading && !loadError && (
        <p className="text-center text-xs text-slate-400">
          Showing {filteredInquiries.length} of {inquiries.length} inquiries on
          this page
        </p>
      )}
    </main>
  );
};
