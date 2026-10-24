export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'SOLD'
  | 'RENTED'
  | 'ARCHIVED';

export type TransactionType = 'SALE' | 'RENT';

export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'PLOT'
  | 'COMMERCIAL'
  | 'OFFICE'
  | 'SHOP'
  | 'OTHER';

export interface PropertyImage {
  id: string;
  imageUrl: string;
  thumbnailUrl?: string;
  displayOrder: number;
  primary: boolean;
}

export interface Amenity {
  id: string;
  name: string;
  category: string;
  icon?: string;
}

export interface PropertyCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  displayOrder: number;
  active: boolean;
}

export interface PropertySummary {
  id: string;
  title: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  deposit?: number;
  city: string;
  locality: string;
  bedrooms: number;
  bathrooms: number;
  builtUpSqft?: number;
  primaryImageUrl?: string;
  featured: boolean;
  viewCount: number;
  ownerId?: string;
  ownerName?: string;
  ownerRole?: string;
  categoryName?: string;
  createdAt: string;
}

export interface PropertyDetail {
  id: string;
  title: string;
  description: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  deposit?: number;
  city: string;
  locality: string;
  postalCode?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  builtUpSqft?: number;
  carpetSqft?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishingStatus?: string;
  parkingAvailable: boolean;
  availabilityDate?: string;
  featured: boolean;
  viewCount: number;
  rejectionReason?: string;
  createdAt: string;
  updatedAt: string;
  categoryId?: string;
  categoryName?: string;
  ownerId: string;
  ownerName: string;
  ownerEmail?: string;
  ownerPhone?: string;
  ownerAvatar?: string;
  ownerAgency?: string;
  ownerRole: string;
  images: PropertyImage[];
  amenities: Amenity[];
}

export interface PropertyFilter {
  query?: string;
  city?: string;
  locality?: string;
  transactionType?: TransactionType;
  propertyType?: PropertyType;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  bathrooms?: number;
  furnishingStatus?: string;
  isFeatured?: boolean;
  status?: PropertyStatus;
  amenityIds?: string[];
  page?: number;
  size?: number;
  sort?: string;
}

export interface PropertyCreateInput {
  title: string;
  description: string;
  transactionType: TransactionType;
  propertyType: PropertyType;
  categoryId?: string;
  price: number;
  deposit?: number;
  city: string;
  locality: string;
  postalCode?: string;
  address: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  builtUpSqft?: number;
  carpetSqft?: number;
  floorNumber?: number;
  totalFloors?: number;
  furnishingStatus?: string;
  parkingAvailable: boolean;
  availabilityDate?: string;
  amenityIds?: string[];
}
