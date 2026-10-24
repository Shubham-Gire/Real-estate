import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PropertySummary } from '../../types/property';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { favoriteService } from '../../services/favoriteService';
import {
  Bed,
  Bath,
  Maximize2,
  MapPin,
  Heart,
  Sparkles,
  User as UserIcon,
} from 'lucide-react';

interface PropertyCardProps {
  property: PropertySummary;
  isFavorited?: boolean;
  onFavoriteChange?: (id: string, isFavorited: boolean) => void;
  viewMode?: 'grid' | 'list';
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorited = false,
  onFavoriteChange,
  viewMode = 'grid',
}) => {
  const { user } = useAuth();
  const { success, error } = useToast();
  const navigate = useNavigate();
  const [favorited, setFavorited] = useState(isFavorited);
  const [favLoading, setFavLoading] = useState(false);

  const fallbackImage =
    'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80';

  const handleFavoriteToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    setFavLoading(true);
    try {
      if (favorited) {
        await favoriteService.removeFavorite(property.id);
        setFavorited(false);
        onFavoriteChange?.(property.id, false);
        success('Removed from saved properties');
      } else {
        await favoriteService.addFavorite(property.id);
        setFavorited(true);
        onFavoriteChange?.(property.id, true);
        success('Saved to your favorites');
      }
    } catch (err: any) {
      error(err.message || 'Failed to update favorite status');
    } finally {
      setFavLoading(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (viewMode === 'list') {
    return (
      <div className="group bg-white rounded-2xl border border-slate-100 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col sm:flex-row">
        {/* Thumbnail */}
        <div className="relative sm:w-80 h-56 sm:h-auto flex-shrink-0 overflow-hidden bg-slate-100">
          <img
            src={property.primaryImageUrl || fallbackImage}
            alt={property.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${
                property.transactionType === 'SALE'
                  ? 'bg-slate-900 text-white'
                  : 'bg-primary-600 text-white'
              }`}
            >
              For {property.transactionType === 'SALE' ? 'Sale' : 'Rent'}
            </span>
            {property.featured && (
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-amber-500 text-white flex items-center shadow-xs">
                <Sparkles className="w-3 h-3 mr-1" /> Featured
              </span>
            )}
          </div>
          <button
            onClick={handleFavoriteToggle}
            disabled={favLoading}
            className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-all ${
              favorited
                ? 'bg-rose-500 text-white shadow-md'
                : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
            }`}
            title="Save property"
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start gap-4 mb-2">
              <span className="text-xs font-bold text-primary-600 uppercase tracking-widest">
                {property.categoryName || property.propertyType}
              </span>
              <div className="text-xl font-black text-slate-900">
                {formatPrice(property.price)}
                {property.transactionType === 'RENT' && (
                  <span className="text-xs font-normal text-slate-500"> /mo</span>
                )}
              </div>
            </div>

            <Link to={`/properties/${property.id}`}>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
                {property.title}
              </h3>
            </Link>

            <p className="flex items-center text-sm text-slate-500 mt-1 mb-4">
              <MapPin className="w-4 h-4 mr-1 text-slate-400 flex-shrink-0" />
              <span className="line-clamp-1">
                {property.locality}, {property.city}
              </span>
            </p>

            <div className="flex items-center gap-6 py-3 border-y border-slate-100 text-xs font-semibold text-slate-600">
              <span className="flex items-center">
                <Bed className="w-4 h-4 mr-1.5 text-slate-400" />
                {property.bedrooms} Beds
              </span>
              <span className="flex items-center">
                <Bath className="w-4 h-4 mr-1.5 text-slate-400" />
                {property.bathrooms} Baths
              </span>
              {property.builtUpSqft && (
                <span className="flex items-center">
                  <Maximize2 className="w-4 h-4 mr-1.5 text-slate-400" />
                  {property.builtUpSqft.toLocaleString()} sqft
                </span>
              )}
            </div>
          </div>

          <div className="pt-4 flex items-center justify-between text-xs text-slate-500">
            <span className="flex items-center font-medium">
              <UserIcon className="w-3.5 h-3.5 mr-1.5 text-primary-500" />
              {property.ownerName || 'Verified Agent'}
            </span>
            <Link
              to={`/properties/${property.id}`}
              className="font-bold text-primary-600 hover:text-primary-700"
            >
              View Details →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Grid View (Default)
  return (
    <div className="group bg-white rounded-3xl border border-slate-100 shadow-xs hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col">
      {/* Thumbnail */}
      <div className="relative aspect-4/3 w-full overflow-hidden bg-slate-100">
        <img
          src={property.primaryImageUrl || fallbackImage}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
          loading="lazy"
        />
        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span
            className={`px-3 py-1 rounded-xl text-[11px] font-extrabold uppercase tracking-wider backdrop-blur-md shadow-xs ${
              property.transactionType === 'SALE'
                ? 'bg-slate-900/90 text-white'
                : 'bg-primary-600/90 text-white'
            }`}
          >
            For {property.transactionType === 'SALE' ? 'Sale' : 'Rent'}
          </span>
          {property.featured && (
            <span className="px-2.5 py-1 rounded-xl text-[11px] font-extrabold bg-amber-500/95 text-white flex items-center shadow-xs backdrop-blur-md">
              <Sparkles className="w-3 h-3 mr-1" /> Featured
            </span>
          )}
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteToggle}
          disabled={favLoading}
          className={`absolute top-3 right-3 p-2.5 rounded-2xl backdrop-blur-md transition-all shadow-md ${
            favorited
              ? 'bg-rose-500 text-white'
              : 'bg-white/80 hover:bg-white text-slate-700 hover:text-rose-500'
          }`}
          title="Save property"
        >
          <Heart className={`w-4 h-4 ${favorited ? 'fill-current' : ''}`} />
        </button>

        {/* Price Floating Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-2xl shadow-md border border-slate-100">
          <span className="text-base font-black text-slate-900">
            {formatPrice(property.price)}
          </span>
          {property.transactionType === 'RENT' && (
            <span className="text-[11px] font-medium text-slate-500"> /mo</span>
          )}
        </div>
      </div>

      {/* Body */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <span className="text-[11px] font-bold text-primary-600 uppercase tracking-wider">
            {property.categoryName || property.propertyType}
          </span>

          <Link to={`/properties/${property.id}`} className="block mt-1">
            <h3 className="text-base font-bold text-slate-900 group-hover:text-primary-600 transition-colors line-clamp-1">
              {property.title}
            </h3>
          </Link>

          <p className="flex items-center text-xs text-slate-500 mt-1 mb-4">
            <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400 flex-shrink-0" />
            <span className="line-clamp-1">
              {property.locality}, {property.city}
            </span>
          </p>

          <div className="grid grid-cols-3 gap-2 py-3 border-t border-slate-100 text-center text-xs font-semibold text-slate-700">
            <div className="bg-slate-50 py-1.5 rounded-xl flex items-center justify-center space-x-1">
              <Bed className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bedrooms} Beds</span>
            </div>
            <div className="bg-slate-50 py-1.5 rounded-xl flex items-center justify-center space-x-1">
              <Bath className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.bathrooms} Baths</span>
            </div>
            <div className="bg-slate-50 py-1.5 rounded-xl flex items-center justify-center space-x-1">
              <Maximize2 className="w-3.5 h-3.5 text-slate-400" />
              <span>{property.builtUpSqft ? `${property.builtUpSqft} sqft` : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <span className="flex items-center truncate max-w-[150px]">
            <UserIcon className="w-3.5 h-3.5 mr-1 text-primary-500 flex-shrink-0" />
            <span className="truncate">{property.ownerName || 'Verified Agent'}</span>
          </span>
          <Link
            to={`/properties/${property.id}`}
            className="font-bold text-primary-600 hover:text-primary-700"
          >
            Explore →
          </Link>
        </div>
      </div>
    </div>
  );
};
