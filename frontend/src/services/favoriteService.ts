import { ApiClient } from './api';
import { PagedResponse } from '../types/api';
import { PropertySummary } from '../types/property';

export const favoriteService = {
  getFavorites: (page = 0, size = 12): Promise<PagedResponse<PropertySummary>> => {
    return ApiClient.get<PagedResponse<PropertySummary>>('/favorites', { page, size });
  },

  getFavoriteIds: (): Promise<string[]> => {
    return ApiClient.get<string[]>('/favorites/ids');
  },

  addFavorite: (propertyId: string): Promise<void> => {
    return ApiClient.post(`/favorites/${propertyId}`);
  },

  removeFavorite: (propertyId: string): Promise<void> => {
    return ApiClient.delete(`/favorites/${propertyId}`);
  },
};
