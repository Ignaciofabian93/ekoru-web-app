import { gql } from "@apollo/client";

import {
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
  SELLER_FIELDS_FRAGMENT,
} from "../users/fragments";

export const STORE_CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment StoreCategoryTranslationFields on StoreCategoryTranslation {
    id
    storeCategoryId
    language
    name
    slug
    href
    metaTitle
    metaDescription
    metaKeywords
    createdAt
    updatedAt
  }
`;

export const STORE_SUB_CATEGORY_TRANSLATION_FIELDS_FRAGMENT = gql`
  fragment StoreSubCategoryTranslationFields on StoreSubCategoryTranslation {
    id
    storeSubCategoryId
    language
    name
    slug
    keywords
    href
    metaTitle
    metaDescription
    createdAt
    updatedAt
  }
`;

export const STORE_SUB_CATEGORY_FIELDS_FRAGMENT = gql`
  ${STORE_SUB_CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  fragment StoreSubCategoryFields on StoreSubCategory {
    id
    storeCategoryId
    averageWeight
    size
    weightUnit
    isActive
    sortOrder
    createdAt
    updatedAt
    translation {
      ...StoreSubCategoryTranslationFields
    }
  }
`;

export const STORE_CATEGORY_FIELDS_FRAGMENT = gql`
  ${STORE_CATEGORY_TRANSLATION_FIELDS_FRAGMENT}
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  fragment StoreCategoryFields on StoreCategory {
    id
    isActive
    sortOrder
    translation {
      ...StoreCategoryTranslationFields
    }
    storeSubCategory {
      ...StoreSubCategoryFields
    }
  }
`;

export const STORE_CATALOG_ITEM_FIELDS_FRAGMENT = gql`
  fragment StoreCatalogItemFields on StoreCatalogItem {
    id
    name
    slug
    href
    subCategoryItems {
      id
      name
      slug
      href
    }
  }
`;

/**
 * What a store product is made of (STO-4, decision D3). Store products are
 * new, so they show their materials, never a "saved" figure; the stores
 * subgraph returns null for their `environmentalImpact`.
 */
export const STORE_PRODUCT_MATERIALS_FIELDS_FRAGMENT = gql`
  fragment StoreProductMaterialsFields on StoreProductMaterialComposition {
    id
    materialTypeId
    materialType
    label
    percentage
  }
`;

export const STORE_PRODUCT_SELLER_FIELDS_FRAGMENT = gql`
  ${SELLER_FIELDS_FRAGMENT}
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  fragment StoreProductSellerFields on Seller {
    ...SellerFields
    profile {
      ... on BusinessProfile {
        ...BusinessProfileFields
      }
    }
  }
`;

export const STORE_PRODUCT_FIELDS_FRAGMENT = gql`
  fragment StoreProductFields on StoreProduct {
    id
    name
    description
    stock
    barcode
    sku
    price
    hasOffer
    offerPrice
    sellerId
    images
    isActive
    badges
    color
    brand
    averageRating
    reviewsNumber
    likesCount
    isLiked
    saleCount
    viewCount
    materialComposition
    recycledContent
    weight
    weightUnit
    length
    width
    height
    dimensionUnit
    lowStockThreshold
    isLowStock
    tags
    metaTitle
    metaDescription
    warranty
    warrantyDuration
    features
    createdAt
    updatedAt
    deletedAt
  }
`;

export const STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT = gql`
  ${STORE_PRODUCT_FIELDS_FRAGMENT}
  ${STORE_PRODUCT_MATERIALS_FIELDS_FRAGMENT}
  ${STORE_PRODUCT_SELLER_FIELDS_FRAGMENT}
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  fragment StoreProductDetailFields on StoreProduct {
    ...StoreProductFields
    materials {
      ...StoreProductMaterialsFields
    }
    seller {
      ...StoreProductSellerFields
    }
    storeSubCategory {
      ...StoreSubCategoryFields
    }
  }
`;

export const STORE_PAGE_INFO_FIELDS_FRAGMENT = gql`
  fragment StorePageInfoFields on PageInfo {
    currentPage
    totalPages
    totalCount
    hasNextPage
    hasPreviousPage
    startCursor
    endCursor
    pageSize
  }
`;

export const STORE_PRODUCT_REVIEW_FIELDS_FRAGMENT = gql`
  fragment StoreProductReviewFields on StoreProductReview {
    id
    storeProductId
    userId
    rating
    comment
    images
    isVerifiedPurchase
    createdAt
  }
`;
