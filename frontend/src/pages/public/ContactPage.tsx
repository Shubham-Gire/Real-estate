import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { success } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    success('Thank you! Your message has been routed to our concierge team.');
    setSubmitted(true);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-12">
      <div className="text-center max-w-2xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">Contact Concierge & Support</h1>
        <p className="text-xs text-slate-500 mt-2">
          Have inquiries regarding listing moderation, partnership, or platform assistance? Our specialists are available 24/7.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Email Us</p>
              <p className="text-sm font-black text-slate-800">concierge@estatehub.com</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Telephone</p>
              <p className="text-sm font-black text-slate-800">+1 (800) 555-ESTATE</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xs flex items-center space-x-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-400">Corporate HQ</p>
              <p className="text-sm font-black text-slate-800">500 Market St, San Francisco</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
          {submitted ? (
            <div className="text-center py-12 space-y-3">
              <MessageCircle className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-black text-slate-900">Message Delivered</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                A member of our client concierge team will follow up at {email} within two hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                <input
                  type="text"
                  required
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Partnering as a Brokerage or Listing Verification"
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Message</label>
                <textarea
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full p-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl shadow-md transition-all flex items-center justify-center space-x-2"
              >
                <Send className="w-4 h-4" />
                <span>Submit Message</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
