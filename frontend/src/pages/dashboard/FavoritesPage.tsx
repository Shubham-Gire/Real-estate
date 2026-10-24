import React, { useState, useEffect } from 'react';
import { favoriteService } from '../../services/favoriteService';
import { PropertySummary } from '../../types/property';
import { PropertyCard } from '../../components/common/PropertyCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import { useToast } from '../../context/ToastContext';
import { Heart } from 'lucide-react';

export const FavoritesPage: React.FC = () => {
  const { error } = useToast();

  const [favorites, setFavorites] = useState<PropertySummary[]>([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const res = await favoriteService.getFavorites(page, 12);
      setFavorites(res.content);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      error(err.message || 'Failed to fetch favorites');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, [page]);

  const handleFavoriteChange = (id: string, isFav: boolean) => {
    if (!isFav) {
      setFavorites((prev) => prev.filter((p) => p.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Saved Favorites</h1>
        <p className="text-xs text-slate-500 mt-1">
          Quickly access your saved properties and compare asking prices
        </p>
      </div>

      {loading ? (
        <div className="p-16 text-center">
          <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-slate-400 font-bold">Retrieving your favorite properties...</p>
        </div>
      ) : favorites.length === 0 ? (
        <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-xs">
          <EmptyState
            icon={Heart}
            title="No Saved Properties"
            description="You have not saved any properties to your favorites yet. Click the heart icon on any property to save it here."
            actionText="Browse Marketplace"
            onAction={() => window.location.assign('/properties')}
          />
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((prop) => (
              <PropertyCard
                key={prop.id}
                property={prop}
                isFavorited={true}
                onFavoriteChange={handleFavoriteChange}
              />
            ))}
          </div>

          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(p) => setPage(p)}
          />
        </>
      )}
    </div>
  );
};
