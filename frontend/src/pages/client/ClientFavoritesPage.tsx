import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { favoriteService } from '../../services/favoriteService';
import { PropertySummary } from '../../types/property';
import { Heart, Trash2, ArrowUpRight, MapPin, Building } from 'lucide-react';

export const ClientFavoritesPage: React.FC = () => {
  const [favorites, setFavorites] = useState<PropertySummary[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const data = await favoriteService.getMyFavorites();
      setFavorites(data);
    } catch (err) {
      console.error('Failed fetching favorites:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const handleRemove = async (propertyId: string) => {
    try {
      await favoriteService.toggleFavorite(propertyId);
      setFavorites((prev) => prev.filter((p) => p.id !== propertyId));
    } catch (err) {
      console.error('Failed removing favorite:', err);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center">
          <Heart className="w-6 h-6 mr-2 text-rose-500 fill-rose-500" />
          Saved Favorites & Wishlist
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Track price updates and schedule walkthroughs for your favorite properties.
        </p>
      </div>

      {loading ? (
        <div className="h-64 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 text-center shadow-xs">
          <Heart className="w-12 h-12 text-stone-300 mx-auto mb-3" />
          <p className="text-sm font-bold text-slate-800">Your wishlist is empty</p>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Click the heart icon on any marketplace property to save it here for fast access.
          </p>
          <Link
            to="/properties"
            className="mt-5 inline-flex items-center px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-sm transition"
          >
            Explore Marketplace
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((prop) => (
            <div
              key={prop.id}
              className="bg-white border border-stone-200 rounded-2xl overflow-hidden hover:border-emerald-500/50 transition shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 w-full bg-stone-100">
                  {prop.primaryImageUrl ? (
                    <img src={prop.primaryImageUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-stone-400">
                      <Building className="w-10 h-10" />
                    </div>
                  )}
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 text-slate-800 shadow-xs">
                    {prop.transactionType}
                  </span>
                  <button
                    onClick={() => handleRemove(prop.id)}
                    className="absolute top-3 right-3 p-1.5 rounded-full bg-white/90 text-rose-500 hover:bg-rose-50 shadow-xs transition"
                    title="Remove from favorites"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-5">
                  <p className="text-lg font-bold text-slate-900">
                    ${prop.price.toLocaleString()}
                  </p>
                  <h3 className="text-sm font-semibold text-slate-800 mt-1 line-clamp-1">
                    {prop.title}
                  </h3>
                  <p className="text-xs text-slate-500 flex items-center mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    {prop.locality}, {prop.city}
                  </p>
                </div>
              </div>

              <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  {prop.bedrooms} beds • {prop.bathrooms} baths
                </span>
                <Link
                  to={`/properties/${prop.id}`}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center"
                >
                  View Details
                  <ArrowUpRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
