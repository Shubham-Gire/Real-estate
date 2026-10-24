import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How does EstateHub verify property listings?',
      a: 'All submitted properties undergo strict administrative moderation before being marked as PUBLISHED. Moderators inspect photo originality, location accuracy, pricing consistency, and owner credentials to prevent bait-and-switch listings.',
    },
    {
      q: 'Can private property owners list without an agent?',
      a: 'Yes. Registered individual owners (ROLE_USER) can list their properties for sale or rent directly, receive buyer inquiries into their dashboard, and manage negotiations without mandatory broker representation.',
    },
    {
      q: 'How do buyer inquiries work?',
      a: 'When an inquiry is submitted, it is immediately persisted in our PostgreSQL database and routed directly to the recipient property owner or representing broker. Notifications appear instantly in their dashboard inbox.',
    },
    {
      q: 'What are the image upload requirements?',
      a: 'Images must be in JPEG, PNG, or WebP format with a maximum size of 10MB per file. Each listing can feature multiple photos with one designated as the primary showcase image.',
    },
    {
      q: 'Is there any fee to register and browse listings?',
      a: 'No. Searching, filtering, viewing particulars, saving favorites, and sending property inquiries are 100% free of charge for all prospective buyers and tenants.',
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
      <div className="text-center max-w-xl mx-auto">
        <span className="text-xs font-black uppercase tracking-widest text-primary-600">
          Knowledge Base
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-slate-500 mt-2">
          Everything you need to know about our moderation standards, inquiries, and platform security.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div
            key={i}
            className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden transition-all"
          >
            <button
              onClick={() => setOpenIdx(openIdx === i ? null : i)}
              className="w-full p-6 text-left flex items-center justify-between font-bold text-slate-900 text-sm sm:text-base hover:text-primary-600 transition-colors"
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-5 h-5 text-slate-400 transition-transform duration-200 ${
                  openIdx === i ? 'rotate-180 text-primary-600' : ''
                }`}
              />
            </button>
            {openIdx === i && (
              <div className="px-6 pb-6 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
