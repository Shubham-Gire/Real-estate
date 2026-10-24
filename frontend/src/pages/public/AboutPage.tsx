import React from 'react';
import { Building, ShieldCheck, Award, Users, Target, CheckCircle2 } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <span className="text-xs font-black uppercase tracking-widest text-primary-600">
          Our Foundation & Philosophy
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Redefining Integrity in Real Estate.
        </h1>
        <p className="text-slate-600 text-base leading-relaxed">
          EstateHub was founded on a simple principle: property transactions should be transparent, verified, and direct. We connect discerning buyers, premier property owners, and certified licensed agents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Listing Moderation</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Every property submission is reviewed by our operations team before publication. No phantom units, inaccurate prices, or expired listings.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Award className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Licensed Professional Network</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Our agent network comprises licensed specialists vetted for local market acumen, fiduciary responsibility, and high client ratings.
          </p>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Target className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Direct Inquiries</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Inquiries bypass aggressive third-party lead brokers and are delivered directly to the authorized owner or representing broker.
          </p>
        </div>
      </div>
    </div>
  );
};
