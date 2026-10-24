import React from 'react';

export const TermsPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Terms and Conditions</h1>
      <p className="text-xs text-slate-400">Effective Date: October 2026</p>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-base">1. Platform Nature & Moderation Notice</h3>
        <p>
          EstateHub operates as an advertising and inquiry marketplace for property owners, real estate agents, buyers, and tenants. While we maintain a strict administrative moderation workflow to screen listings for accuracy and standards compliance, platform approval does not constitute legal title verification, physical structural inspection, or financial certification.
        </p>

        <h3 className="font-bold text-slate-900 text-base">2. User Representations & Accuracy</h3>
        <p>
          Listing creators represent and warrant that all photographs, square footages, prices, and descriptions submitted are authentic, current, and authorized by the title owner or representing brokerage.
        </p>

        <h3 className="font-bold text-slate-900 text-base">3. Prohibited Conduct</h3>
        <p>
          Users agree not to submit fraudulent properties, scrape marketplace data via unauthorized automated systems, upload harmful media, or impersonate licensed agents. Violations result in immediate account suspension and IP blacklisting.
        </p>
      </div>
    </div>
  );
};
