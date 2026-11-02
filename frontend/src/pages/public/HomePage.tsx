import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import { PropertyCategory, PropertySummary } from '../../types/property';
import { PropertyCard } from '../../components/common/PropertyCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import {
  Search,
  Building,
  Home,
  ShieldCheck,
  CheckCircle,
  Clock,
  Sparkles,
  ArrowRight,
  MapPin,
  ChevronDown,
  Compass,
  Users,
} from 'lucide-react';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();

  // State
  const [featuredProperties, setFeaturedProperties] = useState<PropertySummary[]>([]);
  const [recentProperties, setRecentProperties] = useState<PropertySummary[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Search Bar Form State
  const [searchCity, setSearchCity] = useState('');
  const [transactionType, setTransactionType] = useState<'SALE' | 'RENT'>('SALE');
  const [searchPropertyType, setSearchPropertyType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [featured, recent, cats, locs] = await Promise.all([
          propertyService.getFeatured(),
          propertyService.getRecent(),
          propertyService.getCategories(),
          propertyService.getLocations(),
        ]);
        setFeaturedProperties(featured);
        setRecentProperties(recent);
        setCategories(cats);
        setCities(locs);
      } catch (err) {
        console.error('Failed to load homepage data', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (transactionType) params.append('transactionType', transactionType);
    if (searchCity) params.append('city', searchCity);
    if (searchPropertyType) params.append('propertyType', searchPropertyType);
    if (searchQuery) params.append('query', searchQuery);

    navigate(`/properties?${params.toString()}`);
  };

  return (
    <div className="space-y-20 pb-20">
      {/* 1. Hero Section */}
      <section className="relative min-h-[620px] flex items-center justify-center bg-slate-950 text-white overflow-hidden">
        {/* Background Image with Dark Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Luxury Real Estate"
            className="w-full h-full object-cover object-center opacity-70"
          />
          
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-bold text-amber-300 mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Discover Over 1,500+ Verified Homes & Penthouses</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-tight max-w-4xl mx-auto">
            Find Sanctuary In A Home Designed For Living.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto font-normal leading-relaxed">
            The curated marketplace where quality meets authenticity. Browse verified sales, luxury leases, and connect directly with premier agents.
          </p>

          {/* Interactive Search Bar Widget */}
          <div className="mt-10 max-w-4xl mx-auto bg-white rounded-3xl p-4 sm:p-5 shadow-2xl text-slate-900 border border-slate-100">
            {/* Sale / Rent Switcher */}
            <div className="flex space-x-2 border-b border-slate-100 pb-4 mb-4">
              <button
                type="button"
                onClick={() => setTransactionType('SALE')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  transactionType === 'SALE'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Buy Properties
              </button>
              <button
                type="button"
                onClick={() => setTransactionType('RENT')}
                className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                  transactionType === 'RENT'
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Rent Homes
              </button>
            </div>

            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-left">
              {/* Location Select */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Location
                </label>
                <select
                  value={searchCity}
                  onChange={(e) => setSearchCity(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-800 focus:outline-hidden"
                >
                  <option value="">All Supported Cities</option>
                  {cities.map((city) => (
                    <option key={city} value={city}>
                      {city}
                    </option>
                  ))}
                  <option value="New York">New York</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="Miami">Miami</option>
                  <option value="Austin">Austin</option>
                  <option value="Seattle">Seattle</option>
                  <option value="Chicago">Chicago</option>
                </select>
              </div>

              {/* Property Type */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Property Type
                </label>
                <select
                  value={searchPropertyType}
                  onChange={(e) => setSearchPropertyType(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-800 focus:outline-hidden"
                >
                  <option value="">Any Type</option>
                  <option value="APARTMENT">Apartments</option>
                  <option value="VILLA">Villas & Mansions</option>
                  <option value="HOUSE">Single Family Houses</option>
                  <option value="COMMERCIAL">Commercial Spaces</option>
                  <option value="OFFICE">Modern Offices</option>
                  <option value="PLOT">Residential Plots</option>
                </select>
              </div>

              {/* Search Keywords */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
                <label className="block text-[11px] font-extrabold uppercase tracking-wider text-slate-400 mb-1">
                  Keywords
                </label>
                <input
                  type="text"
                  placeholder="e.g. Waterfront, Hudson"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent font-bold text-sm text-slate-800 focus:outline-hidden placeholder:text-slate-400 placeholder:font-normal"
                />
              </div>

              {/* Submit CTA */}
              <div className="flex items-center">
                <button
                  type="submit"
                  className="w-full h-full min-h-[52px] bg-primary-600 hover:bg-primary-700 text-white font-bold rounded-2xl flex items-center justify-center space-x-2 shadow-md shadow-primary-500/25 transition-all hover:scale-[1.02]"
                >
                  <Search className="w-5 h-5" />
                  <span>Search Properties</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* 2. Featured Properties Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Sparkles className="w-4 h-4" />
              <span>Curated Selection</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Featured Properties
            </h2>
            <p className="text-slate-500 text-sm mt-1 max-w-lg">
              Hand-picked residences vetted for architectural prestige, supreme locations, and luxury standards.
            </p>
          </div>
          <Link
            to="/properties?isFeatured=true"
            className="mt-4 sm:mt-0 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 group"
          >
            <span>View All Featured</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Browse By Category */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center max-w-xl mx-auto mb-12">
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">
            Explore By Property Category
          </h2>
          <p className="text-slate-500 text-sm mt-2">
            Tailor your search across our catalog of certified residential and commercial categories.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/properties?categoryId=${cat.id}`}
              className="p-6 bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-xl hover:border-primary-200 hover:-translate-y-1 transition-all group flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary-50 text-primary-600 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary-600 group-hover:text-white transition-all shadow-xs">
                <Building className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-1 group-hover:text-primary-600 transition-colors">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-400 line-clamp-1">
                {cat.description || 'Browse curated listings'}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. Recently Added Properties */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
          <div>
            <div className="flex items-center space-x-2 text-primary-600 font-bold text-xs uppercase tracking-widest mb-2">
              <Clock className="w-4 h-4" />
              <span>Fresh On Market</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Recently Added Homes
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              Be the first to inspect the latest properties newly verified and published.
            </p>
          </div>
          <Link
            to="/properties"
            className="mt-4 sm:mt-0 inline-flex items-center text-sm font-bold text-primary-600 hover:text-primary-700 group"
          >
            <span>Explore All Properties</span>
            <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {recentProperties.map((prop) => (
              <PropertyCard key={prop.id} property={prop} />
            ))}
          </div>
        )}
      </section>

      {/* 5. Why Choose EstateHub Section */}
      <section className="bg-slate-900 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-primary-400">
              The EstateHub Standard
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight mt-2">
              Why Discerning Clients Choose Us
            </h2>
            <p className="text-slate-400 text-sm mt-3 leading-relaxed">
              We eliminate bait-and-switch listings with rigorous moderation, direct owner connections, and bank-grade data security.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-primary-600/20 text-primary-400 flex items-center justify-center mb-6">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">100% Moderated Listings</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Every property submission undergoes administrative review before going live, guaranteeing accurate photos, prices, and specifications.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/20 text-amber-400 flex items-center justify-center mb-6">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Direct Communication</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Connect directly with property owners and certified licensed agents. No middleman spam, no hidden commissions.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-slate-800/60 border border-slate-700/60 text-center flex flex-col items-center">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Full Transparency</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Detailed breakdowns of area, deposits, amenities, and floor plans so you make confident, informed real estate decisions.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call To Action (Sell with us) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-r from-primary-700 to-primary-900 text-white p-10 sm:p-16 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-2xl">
            <span className="text-xs font-extrabold uppercase tracking-widest text-primary-200">
              For Property Owners & Agents
            </span>
            <h2 className="text-3xl sm:text-5xl font-black tracking-tight mt-2 leading-tight">
              List Your Property To Thousands Of Qualified Buyers.
            </h2>
            <p className="text-primary-100 text-sm sm:text-base mt-4 leading-relaxed">
              Create an account in 60 seconds, upload high-resolution photos, and gain direct access to qualified inquiries with full analytics.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Link
                to="/register"
                className="bg-white text-primary-900 font-bold px-8 py-3.5 rounded-2xl shadow-lg hover:bg-primary-50 transition-all text-center"
              >
                List Your Property Free
              </Link>
              <Link
                to="/about"
                className="bg-primary-800/80 hover:bg-primary-800 text-white font-bold px-8 py-3.5 rounded-2xl border border-primary-600 transition-all text-center"
              >
                Learn How It Works
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
