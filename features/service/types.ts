import type { ServicePricing } from "@/types/enums";
import type { Seller } from "@/types/user";

/**
 * The subcategory a service hangs off. `ServiceSubCategoryFields` carries the
 * parent's id but not its slug, so a detail page can name the subcategory but
 * cannot rebuild the `/services/[category]/[subcategory]` path from it alone.
 */
export type ServiceSubCategoryRef = {
  id: number;
  serviceCategoryId: number | null;
  subCategory: string | null;
  href: string | null;
  translation: {
    subCategory: string;
    slug: string;
    href: string | null;
  } | null;
};

/**
 * A single service as returned by `getService` / `ServiceDetailFields`.
 *
 * Most operational fields are nullable because the services subgraph accepts a
 * listing long before its owner fills in scheduling, coverage or availability —
 * the detail screen simply omits the rows it has no value for.
 */
export type ServiceDetail = {
  id: string;
  /** First image, or the provider's logo when the service has none. */
  displayImage?: string | null;
  /** Only fetched by the detail query — grids do not ask for these. */
  faqs?: ServiceFaq[] | null;
  packages?: ServicePackage[] | null;
  name: string;
  description: string | null;
  sellerId: string;
  subcategoryId: number | null;
  pricingType: ServicePricing | null;
  basePrice: number | null;
  /**
   * Free text on the publish form ("50.000–150.000 CLP") but declared as a
   * numeric pair elsewhere in the schema, so both shapes are accepted and the
   * renderer narrows before formatting.
   */
  priceRange: string | number[] | null;
  /** Minutes, stored as a string by the subgraph. */
  duration: string | null;
  isActive: boolean | null;
  images: string[] | null;
  tags: string[] | null;
  createdAt: string;
  updatedAt: string | null;
  isCurrentlyAvailable: boolean | null;
  maxConcurrentBookings: number | null;
  advanceBookingDays: number | null;
  /** Kilometres the provider is willing to travel. */
  serviceRadius: number | null;
  serviceLocations: string[] | null;
  isRemoteService: boolean | null;
  averageRating: number | null;
  reviewCount: number | null;
  viewCount: number | null;
  isLiked: boolean | null;
  seller: Seller | null;
  serviceCategory: ServiceSubCategoryRef | null;
};

/** A provider's answer published against one service. */
export type ServiceFaq = {
  id: string;
  question: string;
  answer: string;
};

export type ServicePackageItem = {
  id: string;
  serviceId: number;
  quantity: number;
  serviceName?: string | null;
};

/**
 * A bundle sold by the provider. Packages belong to the seller and reach
 * services through their items, so one package can appear on several services.
 */
export type ServicePackage = {
  id: string;
  name: string;
  description: string;
  totalPrice: number;
  discountPercentage?: number | null;
  validityDays?: number | null;
  items: ServicePackageItem[];
};
