import { gql } from "@apollo/client";

export const TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment TranslationFields on DepartmentTranslation {
    id
    name
    slug
    href
  }
`;

export const CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment CategoryTranslationFields on DepartmentCategoryTranslation {
    id
    name
    slug
    href
  }
`;

export const PRODUCT_CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment ProductCategoryTranslationFields on ProductCategoryTranslation {
    id
    name
    slug
    href
  }
`;

export const PRODUCT_CATEGORY_FIELDS_FRAGMENT = gql`
  ${PRODUCT_CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  fragment ProductCategoryFields on ProductCategory {
    id
    translation {
      ...ProductCategoryTranslationFields
    }
  }
`;

export const DEPARTMENT_CATEGORY_FIELDS_FRAGMENT = gql`
  ${CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  ${PRODUCT_CATEGORY_FIELDS_FRAGMENT}
  fragment DepartmentCategoryFields on DepartmentCategory {
    id
    translation {
      ...CategoryTranslationFields
    }
    productCategory {
      ...ProductCategoryFields
    }
  }
`;

export const DEPARTMENT_FIELDS_FRAGMENT = gql`
  ${TRANSLATION_FIELDS_FRAGMENT}
  ${DEPARTMENT_CATEGORY_FIELDS_FRAGMENT}
  fragment DepartmentFields on Department {
    id
    translation {
      ...TranslationFields
    }
    departmentCategory {
      ...DepartmentCategoryFields
    }
  }
`;

export const CATALOG_ITEM_FIELDS_FRAGMENT = gql`
  fragment CatalogItemFields on MarketplaceCatalogItem {
    id
    name
    slug
    href
    categories {
      id
      name
      slug
      href
      productCategories {
        id
        name
        slug
        href
      }
    }
  }
`;

// Environmental impact projection used by the product card back side + the
// detailed impact modal. Mirrors `EnvironmentalImpact` in `types/product.ts`.
// Declared before ProductFields because that fragment composes it.
export const ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT = gql`
  fragment EnvironmentalImpactFields on EnvironmentalImpact {
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

/**
 * The product projection every card renders from.
 *
 * `environmentalImpact` is part of it because the card's back face is impact —
 * without it the panel still renders, silently reading 0 kg / 0 L, which is
 * indistinguishable from a product that genuinely saves nothing. It is resolved
 * server-side from the product's category, so it costs no extra client input.
 */
export const PRODUCT_FIELDS_FRAGMENT = gql`
  ${ENVIRONMENTAL_IMPACT_FIELDS_FRAGMENT}
  fragment ProductFields on Product {
    id
    name
    description
    color
    brand
    price
    images
    badges
    interests
    condition
    conditionDescription
    isActive
    isExchangeable
    sellerId
    viewCount
    isLiked
    createdAt
    updatedAt
    environmentalImpact {
      ...EnvironmentalImpactFields
    }
  }
`;

// Lean seller projection for the card back side (name + profile image + type
// + location). Full seller detail is fetched separately on the product page.
export const PRODUCT_CARD_SELLER_FIELDS_FRAGMENT = gql`
  fragment ProductCardSellerFields on Seller {
    id
    email
    sellerType
    isVerified
    address
    phone
    region {
      id
      region
      countryId
    }
    county {
      id
      county
      cityId
    }
    profile {
      ... on PersonProfile {
        id
        firstName
        lastName
        displayName
        profileImage
      }
      ... on BusinessProfile {
        id
        businessName
        logo
      }
    }
  }
`;
