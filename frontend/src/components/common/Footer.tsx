import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Mail, Phone, MapPin, Heart, Shield, Award, Sparkles } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800/80">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-primary-500/20">
                <Building className="w-5 h-5" />
              </div>
              <span className="text-2xl font-black tracking-tight text-white">
                Estate<span className="text-primary-500">Hub</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm leading-relaxed">
              EstateHub is a modern, verified property marketplace connecting discerning home buyers, tenants, and premier real estate professionals with transparency and ease.
            </p>
            <div className="flex items-center space-x-3 text-xs text-slate-400 pt-2">
              <span className="flex items-center">
                <Shield className="w-4 h-4 text-emerald-400 mr-1.5" /> Moderated Listings
              </span>
              <span className="flex items-center">
                <Award className="w-4 h-4 text-amber-400 mr-1.5" /> Verified Agents
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Discover</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  All Properties
                </Link>
              </li>
              <li>
                <Link to="/properties?transactionType=SALE" className="hover:text-white transition-colors">
                  Homes for Sale
                </Link>
              </li>
              <li>
                <Link to="/properties?transactionType=RENT" className="hover:text-white transition-colors">
                  Rental Residences
                </Link>
              </li>
              <li>
                <Link to="/properties?isFeatured=true" className="hover:text-white transition-colors">
                  Featured Listings
                </Link>
              </li>
            </ul>
          </div>

          {/* Company & Support */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Frequently Asked
                </Link>
              </li>
              <li>
                <Link to="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li className="flex items-start">
                <MapPin className="w-4 h-4 mr-2.5 mt-0.5 text-primary-400 flex-shrink-0" />
                <span>500 Market Street, Suite 400, San Francisco, CA 94105</span>
              </li>
              <li className="flex items-center">
                <Phone className="w-4 h-4 mr-2.5 text-primary-400 flex-shrink-0" />
                <span>+1 (800) 555-ESTATE</span>
              </li>
              <li className="flex items-center">
                <Mail className="w-4 h-4 mr-2.5 text-primary-400 flex-shrink-0" />
                <span>concierge@estatehub.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-slate-500">
          <p>© {new Date().getFullYear()} EstateHub Marketplace Inc. All rights reserved.</p>
          <p className="mt-3 sm:mt-0 flex items-center">
            Engineered for high performance, accessibility, and security.
          </p>
        </div>
      </div>
    </footer>
  );
};
