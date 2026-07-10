import type { Seller } from "./user";

export type ServiceCatalog = {
  id: number;
  name: string;
  href: string;
  slug: string;
  subCategoryItems: {
    id: number;
    name: string;
    href: string;
    slug: string;
  }[];
};

export type Service = {
  id: number;
  name: string;
  description: string;
  sellerId: string;
  subcategoryId: number;
  pricingType: string;
  basePrice: number | null;
  priceRange: number[] | null;
  duration: string | null;
  isActive: boolean;
  images: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  deletedAt: null;
  availabilitySchedule: null;
  isCurrentlyAvailable: null;
  maxConcurrentBookings: null;
  advanceBookingDays: null;
  serviceRadius: null;
  serviceLocations: null;
  isRemoteService: null;
  averageRating: 0;
  reviewCount: 0;
  viewCount: null;
  isLiked: false;
  seller: Seller;
  serviceCategory: {
    id: number;
    serviceCategoryId: number;
    isActive: boolean;
    sortOrder: number;
    subCategory: null;
    serviceCount: null;
    href: null;
    translation: {
      id: string;
      serviceSubCategoryId: number;
      language: string;
      subCategory: string;
      slug: string;
      href: string;
      metaTitle: null;
      metaDescription: null;
      metaKeywords: [];
      createdAt: string;
      updatedAt: string;
    };
  };
};
