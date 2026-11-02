import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { inquiryService } from '../../services/inquiryService';
import { Inquiry } from '../../types/inquiry';
import { MessageSquare, Clock, ArrowUpRight, Building } from 'lucide-react';

export const ClientInquiriesPage: React.FC = () => {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    inquiryService
      .getSentInquiries()
      .then((res) => setInquiries(res.content))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <MessageSquare className="w-6 h-6 mr-2 text-emerald-600" />
          My Property Inquiries
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Questions and inquiry messages you sent directly to listing agents.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : inquiries.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
          <MessageSquare className="w-12 h-12 text-stone-400 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">No sent inquiries</p>
          <p className="text-xs text-slate-500 mt-1">
            When you inquire about a property, your message and the agent's reply will show here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {inquiries.map((inq) => (
            <div
              key={inq.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 hover:border-stone-300 transition shadow-xs"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-base font-bold text-slate-900">{inq.propertyTitle}</h3>
                  <div className="flex items-center space-x-3 text-xs text-slate-500 mt-1">
                    <span className="flex items-center">
                      <Clock className="w-3.5 h-3.5 mr-1" />
                      {new Date(inq.createdAt).toLocaleDateString()}
                    </span>
                    <span>•</span>
                    <span className="capitalize">Status: <strong className="text-emerald-700">{inq.status}</strong></span>
                  </div>
                </div>

                <Link
                  to={`/properties/${inq.propertyId}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
                >
                  View Listing
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>

              <div className="mt-4 p-3.5 bg-stone-50 rounded-xl border border-stone-100 text-xs text-slate-700">
                <p className="font-semibold text-slate-500 mb-1">Your Message:</p>
                <p>{inq.message}</p>
              </div>

              {inq.notes && (
                <div className="mt-2 p-3 bg-indigo-50 rounded-xl border border-indigo-100 text-xs text-indigo-900">
                  <p className="font-semibold text-indigo-700 mb-0.5">Agent Update / Response:</p>
                  <p>{inq.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
