import {
  type AdminPermission,
  type AdminRole,
  type AdminType,
  type BusinessSubscriptionPlan,
  type BusinessType,
  type ContactMethod,
  type PersonSubscriptionPlan,
  type SellerType,
} from "./enums";
import type { City, Country, County, Region } from "./location";

export type Admin = {
  id: string;
  email: string;
  password: string;
  name: string;
  lastName?: string;

  // Admin type and access control
  adminType: AdminType;
  role: AdminRole;
  permissions: AdminPermission[];

  // Location
  countryId?: number;
  country?: Country;
  regionId?: number;
  region?: Region;
  cityId?: number;
  city?: City;
  countyId?: number;
  county?: County;

  // Business admin relation (null for platform admins)
  sellerId?: string;
  seller?: Seller;

  // Account status and security
  isActive: boolean;
  isEmailVerified: boolean;
  accountLocked: boolean;
  loginAttempts: number;
  lastLoginAt?: string;
  lastLoginIp?: string;

  // Timestamps
  createdAt: string;
  updatedAt: string;
};

export type AdminActivityLog = {
  id: number;
  adminId: string;
  action: string;
  entityType?: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type Seller = {
  id: string;
  email: string;
  // Auth-only fields; never returned to the web client.
  password?: string;
  sellerType: SellerType;
  isActive?: boolean;
  isVerified?: boolean;
  createdAt?: string;
  updatedAt?: string;

  // Profile Relations - Each seller has ONE profile based on sellerType.
  // Optional because partial GraphQL projections may omit it.
  profile?: PersonProfile | BusinessProfile | null;

  // Location information
  address?: string | null;
  cityId?: number;
  countryId?: number;
  countyId?: number;
  regionId?: number;
  county?: County | null;
  region?: Region | null;
  country?: Country | null;
  city?: City | null;

  // Contact information
  phone?: string | null;
  website?: string | null;
  preferredContactMethod?: ContactMethod;
  socialMediaLinks?: Record<string, string>;

  // Points and Level System
  points?: number;
  sellerLevelId?: number;
  sellerLevel?: SellerLevel | null;
  sellerCategoryId?: number;
  sellerCategory?: SellerCategory | null;
};

export type PersonProfile = {
  __typename: "PersonProfile";
  id: string;
  sellerId?: string;
  firstName: string;
  lastName?: string | null;
  displayName?: string | null;
  bio?: string | null;
  birthday?: string | null;
  profileImage?: string | null;
  coverImage?: string | null;
  allowExchanges?: boolean;
  personSubscriptionPlan?: PersonSubscriptionPlan;
};

export type BusinessProfile = {
  __typename: "BusinessProfile";
  id: string;
  sellerId?: string;

  // Basic Information
  businessName: string;
  description?: string | null;
  // Eco descriptors chosen by the business (max 3). Sourced from the users
  // subgraph; currently client-side only until the field lands server-side.
  tags?: string[] | null;
  logo?: string | null;
  coverImage?: string | null;
  businessType?: BusinessType;

  // Chilean Legal Requirements
  legalBusinessName?: string | null;
  taxId?: string | null;
  businessStartDate?: string | null;
  legalRepresentative?: string | null;
  legalRepresentativeTaxId?: string | null;

  // For RETAIL and MIXED
  shippingPolicy?: string | null;
  returnPolicy?: string | null;

  // For SERVICES and MIXED
  serviceArea?: string | null;
  yearsOfExperience?: number | null;
  certifications?: string[];
  travelRadius?: number | null;

  // Operating Hours
  businessHours?: Record<string, unknown> | null;

  businessSubscriptionPlan?: BusinessSubscriptionPlan;
  createdAt?: string;
  updatedAt?: string;
};

export type SellerCategory = {
  id: number;
  name: string;
  categoryDiscountAmount: number;
  pointsThreshold: number;
  level: number;
};

export type SellerPreferences = {
  id: number;
  sellerId: string;
  preferredLanguage?: string;
  currency?: string;
  emailNotifications: boolean;
  pushNotifications: boolean;
  orderUpdates: boolean;
  communityUpdates: boolean;
  securityAlerts: boolean;
  weeklySummary: boolean;
  twoFactorAuth: boolean;
};

export type SellerLevel = {
  id: number;
  levelName: string;
  minPoints: number;
  maxPoints?: number;
  benefits?: Record<string, unknown>;
  badgeIcon?: string;
  createdAt: string;
  updatedAt: string;
};

export type MembershipPricing = {
  id: string;
  personMembershipId?: string;
  businessMembershipId?: string;
  countryId: number;
  currency: string;
  price: number;
  isActive: boolean;
};

export type MembershipTranslation = {
  id: string;
  personMembershipId?: string;
  businessMembershipId?: string;
  language: string;
  name: string;
  description: string[];
};

export type PersonMembership = {
  id: string;
  membershipType: PersonSubscriptionPlan;
  durationMonths: number;
  isActive: boolean;
  pricing: MembershipPricing | null;
  translation: MembershipTranslation;
};

export type BusinessMembership = {
  id: string;
  membershipType: BusinessSubscriptionPlan;
  durationMonths: number;
  isActive: boolean;
  pricing: MembershipPricing | null;
  translation: MembershipTranslation;
};

type MembershipRef = {
  id: string;
  membershipType: string;
  durationMonths: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
};

export type SellerMembershipSubscription = {
  id: string;
  sellerId: string;
  personMembershipId?: string;
  businessMembershipId?: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  autoRenew: boolean;
  paymentId?: string;
  createdAt: string;
  updatedAt: string;
  personMembership?: MembershipRef;
  businessMembership?: MembershipRef;
};

export type Session = {
  id: string;
  token: string;
  createdAt: string;
  expiresAt: string;
  sellerId: string;
};
