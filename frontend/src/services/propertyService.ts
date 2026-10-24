import { ApiClient } from './api';
import { PagedResponse } from '../types/api';
import {
  Amenity,
  PropertyCategory,
  PropertyCreateInput,
  PropertyDetail,
  PropertyFilter,
  PropertyImage,
  PropertyStatus,
  PropertySummary,
} from '../types/property';

export const propertyService = {
  searchProperties: (filter: PropertyFilter): Promise<PagedResponse<PropertySummary>> => {
    return ApiClient.get<PagedResponse<PropertySummary>>('/properties', filter);
  },

  getPropertyDetail: (id: string): Promise<PropertyDetail> => {
    return ApiClient.get<PropertyDetail>(`/properties/${id}`);
  },

  getFeatured: (): Promise<PropertySummary[]> => {
    return ApiClient.get<PropertySummary[]>('/properties/featured');
  },

  getRecent: (): Promise<PropertySummary[]> => {
    return ApiClient.get<PropertySummary[]>('/properties/recent');
  },

  getLocations: (): Promise<string[]> => {
    return ApiClient.get<string[]>('/properties/locations');
  },

  getCategories: (): Promise<PropertyCategory[]> => {
    return ApiClient.get<PropertyCategory[]>('/properties/categories');
  },

  getAmenities: (): Promise<Amenity[]> => {
    return ApiClient.get<Amenity[]>('/properties/amenities');
  },

  createProperty: (data: PropertyCreateInput): Promise<PropertyDetail> => {
    return ApiClient.post<PropertyDetail>('/properties', data);
  },

  updateProperty: (id: string, data: Partial<PropertyCreateInput>): Promise<PropertyDetail> => {
    return ApiClient.put<PropertyDetail>(`/properties/${id}`, data);
  },

  updateStatus: (id: string, status: PropertyStatus, reason?: string): Promise<void> => {
    return ApiClient.patch(`/properties/${id}/status`, { status, reason });
  },

  deleteProperty: (id: string): Promise<void> => {
    return ApiClient.delete(`/properties/${id}`);
  },

  getMyProperties: (filter?: PropertyFilter): Promise<PagedResponse<PropertySummary>> => {
    return ApiClient.get<PagedResponse<PropertySummary>>('/users/me/properties', filter);
  },

  uploadImage: (propertyId: string, file: File, isPrimary = false): Promise<PropertyImage> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('isPrimary', String(isPrimary));
    return ApiClient.post<PropertyImage>(`/properties/${propertyId}/images`, formData);
  },

  deleteImage: (propertyId: string, imageId: string): Promise<void> => {
    return ApiClient.delete(`/properties/${propertyId}/images/${imageId}`);
  },

  setPrimaryImage: (propertyId: string, imageId: string): Promise<void> => {
    return ApiClient.put(`/properties/${propertyId}/images/primary/${imageId}`);
  },
};
