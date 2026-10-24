import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { propertyService } from '../../services/propertyService';
import {
  PropertyCategory,
  PropertyFilter,
  PropertySummary,
  PropertyType,
  TransactionType,
} from '../../types/property';
import { PropertyCard } from '../../components/common/PropertyCard';
import { SkeletonCard } from '../../components/common/SkeletonCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Pagination } from '../../components/common/Pagination';
import {
  Filter,
  LayoutGrid,
  List as ListIcon,
  X,
  Search,
  SlidersHorizontal,
  ChevronDown,
} from 'lucide-react';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Data State
  const [properties, setProperties] = useState<PropertySummary[]>([]);
  const [categories, setCategories] = useState<PropertyCategory[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Pagination State
  const [page, setPage] = useState(Number(searchParams.get('page')) || 0);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Mobile Filter Drawer Toggle
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Form Filter State (Derived from URL parameters)
  const currentQuery = searchParams.get('query') || '';
  const currentCity = searchParams.get('city') || '';
  const currentLocality = searchParams.get('locality') || '';
  const currentTransactionType = (searchParams.get('transactionType') as TransactionType) || undefined;
  const currentPropertyType = (searchParams.get('propertyType') as PropertyType) || undefined;
  const currentCategoryId = searchParams.get('categoryId') || '';
  const currentMinPrice = searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined;
  const currentMaxPrice = searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined;
  const currentBedrooms = searchParams.get('bedrooms') ? Number(searchParams.get('bedrooms')) : undefined;
  const currentBathrooms = searchParams.get('bathrooms') ? Number(searchParams.get('bathrooms')) : undefined;
  const currentFurnishing = searchParams.get('furnishingStatus') || '';
  const currentSort = searchParams.get('sort') || 'createdAt,desc';

  // Load Categories & Locations on mount
  useEffect(() => {
    Promise.all([propertyService.getCategories(), propertyService.getLocations()])
      .then(([cats, locs]) => {
        setCategories(cats);
        setCities(locs);
      })
      .catch((err) => console.error('Failed to load filter metadata', err));
  }, []);

  // Fetch Properties when query params or page change
  useEffect(() => {
    const fetchProperties = async () => {
      setIsLoading(true);
      try {
        const filter: PropertyFilter = {
          query: currentQuery || undefined,
          city: currentCity || undefined,
          locality: currentLocality || undefined,
          transactionType: currentTransactionType,
          propertyType: currentPropertyType,
          categoryId: currentCategoryId || undefined,
          minPrice: currentMinPrice,
          maxPrice: currentMaxPrice,
          bedrooms: currentBedrooms,
          bathrooms: currentBathrooms,
          furnishingStatus: currentFurnishing || undefined,
          page,
          size: 12,
          sort: currentSort,
        };

        const res = await propertyService.searchProperties(filter);
        setProperties(res.content);
        setTotalPages(res.totalPages);
        setTotalElements(res.totalElements);
      } catch (err) {
        console.error('Failed to query properties', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperties();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [searchParams, page]);

  const updateParam = (key: string, value: string | undefined) => {
    const newParams = new URLSearchParams(searchParams);
    if (value !== undefined && value !== '') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '0');
    setPage(0);
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setPage(0);
  };

  // Active filters count
  const activeFiltersCount = Array.from(searchParams.keys()).filter((k) => k !== 'sort' && k !== 'page').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Browse Verified Properties
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Showing {totalElements} available properties matching your criteria
        </p>
      </div>

      {/* Top Filter & Toolbar */}
      <div className="bg-white p-4 rounded-3xl border border-slate-100 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative flex-1 w-full">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by title, location or keywords..."
            defaultValue={currentQuery}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                updateParam('query', (e.target as HTMLInputElement).value);
              }
            }}
            onBlur={(e) => updateParam('query', e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-slate-50 rounded-2xl text-sm font-semibold text-slate-800 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-primary-500/20"
          />
        </div>

        {/* Right Tool Buttons */}
        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          {/* Mobile Filter Drawer Button */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-sm rounded-2xl transition-colors"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="text-slate-400 font-medium hidden sm:inline">Sort:</span>
            <select
              value={currentSort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 font-bold text-slate-700 text-sm focus:outline-hidden"
            >
              <option value="createdAt,desc">Newest Listings</option>
              <option value="price,asc">Price: Low to High</option>
              <option value="price,desc">Price: High to Low</option>
              <option value="viewCount,desc">Most Popular</option>
            </select>
          </div>

          {/* Grid / List View Toggle */}
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'grid' ? 'bg-white text-primary-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg transition-colors ${
                viewMode === 'list' ? 'bg-white text-primary-600 shadow-xs' : 'text-slate-500 hover:text-slate-800'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout Grid */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Desktop Left Filter Sidebar */}
        <aside className="hidden lg:block w-72 flex-shrink-0">
          <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-xs sticky top-28 space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center">
                <SlidersHorizontal className="w-4 h-4 mr-2 text-primary-600" />
                Refine Search
              </h3>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearAllFilters}
                  className="text-xs font-bold text-rose-500 hover:text-rose-600"
                >
                  Clear All
                </button>
              )}
            </div>

            {/* Transaction Type */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Transaction Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    updateParam(
                      'transactionType',
                      currentTransactionType === 'SALE' ? undefined : 'SALE'
                    )
                  }
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    currentTransactionType === 'SALE'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  For Sale
                </button>
                <button
                  type="button"
                  onClick={() =>
                    updateParam(
                      'transactionType',
                      currentTransactionType === 'RENT' ? undefined : 'RENT'
                    )
                  }
                  className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                    currentTransactionType === 'RENT'
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  For Rent
                </button>
              </div>
            </div>

            {/* City Filter */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                City
              </label>
              <select
                value={currentCity}
                onChange={(e) => updateParam('city', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="">All Cities</option>
                {cities.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Category
              </label>
              <select
                value={currentCategoryId}
                onChange={(e) => updateParam('categoryId', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Price Boundary ($)
              </label>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="number"
                  placeholder="Min Price"
                  defaultValue={currentMinPrice || ''}
                  onBlur={(e) => updateParam('minPrice', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
                <input
                  type="number"
                  placeholder="Max Price"
                  defaultValue={currentMaxPrice || ''}
                  onBlur={(e) => updateParam('maxPrice', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2 text-xs font-bold text-slate-800 placeholder:text-slate-400 focus:outline-hidden"
                />
              </div>
            </div>

            {/* Bedrooms Filter */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Minimum Bedrooms
              </label>
              <div className="flex space-x-1.5">
                {[1, 2, 3, 4, 5].map((bed) => (
                  <button
                    key={bed}
                    type="button"
                    onClick={() =>
                      updateParam(
                        'bedrooms',
                        currentBedrooms === bed ? undefined : String(bed)
                      )
                    }
                    className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                      currentBedrooms === bed
                        ? 'bg-primary-600 text-white border-primary-600'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {bed}+
                  </button>
                ))}
              </div>
            </div>

            {/* Furnishing Status */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2">
                Furnishing
              </label>
              <select
                value={currentFurnishing}
                onChange={(e) => updateParam('furnishingStatus', e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-bold text-slate-800 focus:outline-hidden"
              >
                <option value="">Any Furnishing</option>
                <option value="FULLY_FURNISHED">Fully Furnished</option>
                <option value="SEMI_FURNISHED">Semi Furnished</option>
                <option value="UNFURNISHED">Unfurnished</option>
              </select>
            </div>
          </div>
        </aside>

        {/* Properties Results Stream */}
        <main className="flex-1 min-w-0">
          {/* Active Filter Chips */}
          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="text-xs font-bold text-slate-400">Active filters:</span>
              {currentCity && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
                  City: {currentCity}
                  <button onClick={() => updateParam('city', undefined)} className="ml-1.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentTransactionType && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
                  Type: {currentTransactionType}
                  <button onClick={() => updateParam('transactionType', undefined)} className="ml-1.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {currentBedrooms && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-primary-50 text-primary-700">
                  {currentBedrooms}+ Bedrooms
                  <button onClick={() => updateParam('bedrooms', undefined)} className="ml-1.5">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              <button
                onClick={clearAllFilters}
                className="text-xs font-bold text-rose-500 hover:underline ml-2"
              >
                Reset All
              </button>
            </div>
          )}

          {/* Properties Grid or List */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          ) : properties.length === 0 ? (
            <EmptyState
              title="No Properties Found"
              description="No published properties matched your exact filters. Try broadening your price range, clearing specific filters, or checking back soon."
              actionText="Clear All Filters"
              onAction={clearAllFilters}
            />
          ) : (
            <>
              <div
                className={
                  viewMode === 'grid'
                    ? 'grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'
                    : 'flex flex-col space-y-6'
                }
              >
                {properties.map((prop) => (
                  <PropertyCard key={prop.id} property={prop} viewMode={viewMode} />
                ))}
              </div>

              {/* Pagination */}
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={(p) => {
                  setPage(p);
                  updateParam('page', String(p));
                }}
              />
            </>
          )}
        </main>
      </div>
    </div>
  );
};
