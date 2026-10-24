import React from 'react';

export const PrivacyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-6">
      <h1 className="text-3xl font-black text-slate-900 tracking-tight">Privacy Policy</h1>
      <p className="text-xs text-slate-400">Effective Date: October 2026</p>

      <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
        <h3 className="font-bold text-slate-900 text-base">1. Information We Collect</h3>
        <p>
          We collect personal information necessary to deliver marketplace services, including account credentials (name, email, phone), property specifications, uploaded photos, and messages submitted via property inquiry forms.
        </p>

        <h3 className="font-bold text-slate-900 text-base">2. How We Protect Your Data</h3>
        <p>
          Passwords are protected using cryptographic BCrypt work factors. Authentication sessions utilize stateless HMAC-signed JWT tokens. Private owner phone numbers and email addresses are not exposed publicly unless authorized by the listing submitter.
        </p>

        <h3 className="font-bold text-slate-900 text-base">3. Third-Party Disclosures</h3>
        <p>
          EstateHub never sells or rents personal customer data or search telemetry to third-party ad networks or unsolicited telemarketers.
        </p>
      </div>
    </div>
  );
};
