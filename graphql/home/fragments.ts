import { gql } from "@apollo/client";

// Fragments for the home feature's product queries. The exchangeable-products
// section renders MarketplaceCard, whose front/back sides read the product's
// scalars, environmental impact and seller, so the fragments below project
// exactly those fields. Field sets mirror the TS types in `types/product.ts`
// and `types/user.ts` to stay aligned with the GraphQL schema.

export const HOME_ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT = gql`
  fragment HomeEnvironmentalImpactFields on EnvironmentalImpact {
    totalCo2SavingsKG
    totalWaterSavingsLT
    materialBreakdown {
      materialType
      materialTypeLabel
      quantity
      unit
      co2SavingsKG
      waterSavingsLT
    }
  }
`;

export const HOME_SELLER_FIELDS_FRAGMENT = gql`
  fragment HomeSellerFields on Seller {
    id
    email
    sellerType
    isActive
    isVerified
    address
    phone
    profile {
      ... on PersonProfile {
        id
        sellerId
        firstName
        lastName
        displayName
        profileImage
        coverImage
        allowExchanges
      }
      ... on BusinessProfile {
        id
        sellerId
        businessName
        description
        logo
        coverImage
        businessType
      }
    }
    county {
      id
      county
      cityId
    }
  }
`;

export const HOME_PRODUCT_CATEGORY_FIELDS_FRAGMENT = gql`
  fragment HomeProductCategoryFields on ProductCategory {
    id
    translation {
      name
      slug
      href
    }
  }
`;

export const HOME_EXCHANGEABLE_PRODUCT_FIELDS_FRAGMENT = gql`
  ${HOME_ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  ${HOME_SELLER_FIELDS_FRAGMENT}
  ${HOME_PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  fragment HomeExchangeableProductFields on Product {
    id
    name
    description
    color
    images
    brand
    price
    productCategoryId
    badges
    interests
    condition
    conditionDescription
    isActive
    isExchangeable
    sellerId
    viewCount
    createdAt
    updatedAt
    deletedAt
    environmentalImpact {
      ...HomeEnvironmentalImpactFields
    }
    seller {
      ...HomeSellerFields
    }
    productCategory {
      ...HomeProductCategoryFields
    }
  }
`;

export const HOME_SERVICE_CATEGORY_FIELDS_FRAGMENT = gql`
  fragment HomeServiceCategoryFields on ServiceSubCategory {
    id
    serviceCategoryId
    isActive
    sortOrder
    subCategory
    serviceCount
    href
    translation {
      id
      serviceSubCategoryId
      language
      subCategory
      slug
      href
      metaTitle
      metaDescription
      metaKeywords
      createdAt
      updatedAt
    }
  }
`;

export const HOME_SERVICE_FIELDS_FRAGMENT = gql`
  ${HOME_SELLER_FIELDS_FRAGMENT}
  ${HOME_SERVICE_CATEGORY_FIELDS_FRAGMENT}
  fragment HomeServiceFields on Service {
    id
    name
    description
    sellerId
    subcategoryId
    pricingType
    basePrice
    priceRange
    duration
    isActive
    images
    tags
    createdAt
    updatedAt
    deletedAt
    availabilitySchedule
    isCurrentlyAvailable
    maxConcurrentBookings
    advanceBookingDays
    serviceRadius
    serviceLocations
    isRemoteService
    averageRating
    reviewCount
    viewCount
    isLiked
    seller {
      ...HomeSellerFields
    }
    serviceCategory {
      ...HomeServiceCategoryFields
    }
  }
`;
