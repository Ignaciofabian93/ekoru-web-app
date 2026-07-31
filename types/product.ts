import {
  type DimensionUnit,
  type Badge,
  type ProductCondition,
  type ProductSize,
  type WeightUnit,
} from "./enums";
import { type Seller } from "./user";

export type MaterialImpactBreakdown = {
  __typename: "MaterialImpactBreakdown";
  materialType: string;
  materialTypeLabel: string;
  quantity: number;
  unit: string;
  co2SavingsKG: number;
  waterSavingsLT: number;
};

export type EnvironmentalImpact = {
  __typename: "EnvironmentalImpact";
  totalCo2SavingsKG: number;
  totalWaterSavingsLT: number;
  materialBreakdown: MaterialImpactBreakdown[];
};

export type Product = {
  __typename: "Product";
  id: number;
  productCategoryId: number;
  productCategory: ProductCategory;
  name: string;
  description?: string;
  price: number;
  sellerId: string;
  // Resolved via federation; queries that only need the card projection omit it.
  seller?: Seller | null;
  viewCount: number;
  badges: Badge[] | null;
  brand: string;
  color: string | null;
  images: string[];
  interests: string[] | null;
  isActive: boolean;
  isExchangeable: boolean;
  /** Set when a completed P2P deal marked it sold/exchanged; kept in the profile
   *  ~a week then soft-deleted. */
  soldAt?: string | null;
  /** "SALE" | "EXCHANGE" — for the profile "sold/exchanged" label. */
  soldVia?: string | null;
  condition: ProductCondition;
  conditionDescription: string | null;
  isLiked: boolean;
  environmentalImpact: EnvironmentalImpact | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type StoreProduct = {
  __typename: "StoreProduct";
  averageRating: number;
  badges: Badge[];
  barcode: string;
  brand: string;
  color: string;
  createdAt: string;
  deletedAt: string | null;
  description: string;
  dimensionUnit: DimensionUnit;
  environmentalImpact?: EnvironmentalImpact;
  features: string[];
  hasOffer: boolean;
  height: number;
  id: number;
  images: string[];
  isActive: boolean;
  isLiked: boolean;
  isLowStock: boolean;
  length: number;
  likesCount: number;
  lowStockThreshold: number;
  materials?: StoreProductMaterialComposition[];
  metaDescription: string | null;
  metaTitle: string | null;
  name: string;
  offerPrice?: number;
  price: number;
  recycledContent: number;
  reviewsNumber: number;
  saleCount: number;
  seller?: Seller | null;
  sellerId: string;
  sku?: string;
  stock: number;
  storeSubCategory: StoreSubCategory;
  tags: string[];
  updatedAt: string;
  viewCount: number;
  warranty: boolean;
  warrantyDuration: number;
  weight: number;
  weightUnit: WeightUnit;
  width: number;
  storeSubCategoryId: number;
};

export type ProductVariant = {
  id: number;
  storeProductId: number;
  variantName: string;
  sku?: string;
  price: number;
  stock: number;
  attributes?: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

/**
 * One row of a store product's declared material composition, as returned by
 * the `materials` field on a StoreProduct (GraphQL: StoreProductMaterialComposition).
 */
export type StoreProductMaterialComposition = {
  id: number;
  materialTypeId: number;
  /** Raw material key, e.g. "COTTON" — stable identifier for icons/logic. */
  materialType: string;
  /** Localized, render-ready material label for the requested language. */
  label: string;
  /** Percentage of the product (0-100). */
  percentage: number;
};

export type ProductCategoryMaterial = {
  id: number;
  productCategoryId: number;
  materialTypeId: number;
  quantity: number;
  unit: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  material: MaterialImpactEstimate;
};

export type StoreCategory = {
  id: number;
  category: string;
  subcategories: StoreSubCategory[];
  href: string;
  translation: {
    id: number;
    storeCategoryId: number;
    language: string;
    name: string;
    href: string;
  };
};

export type StoreSubCategory = {
  id: number;
  storeCategoryId: number;
  storeCategory: StoreCategory;
  averageWeight: number;
  size: ProductSize;
  weightUnit: WeightUnit;
  isActive: boolean;
  sortOrder: Record<string, string>;
  createdAt: string;
  updatedAt: string;
  translation: {
    id: number;
    storeSubCategoryId: number;
    language: string;
    name: string;
    slug: string;
    keywords: string[];
    href: string;
    metaTitle: string;
    metaDescription: string;
    createdAt: string;
    updatedAt: string;
  };
};

export type ProductLike = {
  id: number;
  productId: number;
  sellerId: string; // Changed from userId to sellerId
};

export type ProductComment = {
  id: number;
  comment: string;
  productId: number;
  sellerId: string; // Changed from userId to sellerId
};

export type MaterialImpactEstimate = {
  id: number;
  materialType: string;
  estimatedCo2SavingsKG: number;
  estimatedWaterSavingsLT: number;
};

export type ProductCategoryTranslation = {
  id: number;
  productCategoryId: number;
  name: string;
  slug: string;
  href: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
  keywords: string[];
};

export type ProductCategory = {
  __typename: "ProductCategory";
  id: number;
  departmentCategoryId: number;
  departmentCategory: DepartmentCategory;
  isActive: boolean;
  sortOrder: number;
  averageWeight: number;
  size: ProductSize;
  weightUnit: WeightUnit;
  createdAt: string;
  updatedAt: string;
  // Single translation resolved for the requested language.
  translation: ProductCategoryTranslation;
};

export type DepartmentCategoryTranslation = {
  __typename: "DepartmentCategoryTranslation";
  id: number;
  departmentCategoryId: number;
  name: string;
  slug: string;
  href: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
};

export type DepartmentCategory = {
  __typename: "DepartmentCategory";
  id: number;
  departmentId: number;
  department: Department;
  isActive: boolean;
  sortOrder: number;
  translation: DepartmentCategoryTranslation;
  productCategory: ProductCategory[];
};

export type DepartmentTranslation = {
  __typename: "DepartmentTranslation";
  id: number;
  departmentId: number;
  name: string;
  slug: string;
  href: string;
  language: string;
  createdAt: string;
  updatedAt: string;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string[];
};

export type Department = {
  __typename: "Department";
  id: number;
  isActive: boolean;
  sortOrder: number;
  translation: DepartmentTranslation;
  departmentCategory: DepartmentCategory[];
};

export type FilterInput = {
  name: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  condition: ProductCondition | null;
  isExchangeable: boolean | null;
  badges: Badge[] | null;
};

export type SortInput = {
  field: string;
  order: "asc" | "desc";
};
