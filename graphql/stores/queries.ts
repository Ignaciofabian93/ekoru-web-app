import { gql } from "@apollo/client";

import {
  STORE_CATALOG_ITEM_FIELDS_FRAGMENT,
  STORE_CATEGORY_FIELDS_FRAGMENT,
  STORE_PAGE_INFO_FIELDS_FRAGMENT,
  STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT,
  STORE_SUB_CATEGORY_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_STORES_CATALOG = gql`
  ${STORE_CATALOG_ITEM_FIELDS_FRAGMENT}
  query GetStoreCatalog($language: Language = ES) {
    getStoreCatalog(language: $language) {
      ...StoreCatalogItemFields
    }
  }
`;

export const GET_STORES_CATEGORIES = gql`
  ${STORE_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreCategories(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getStoreCategories(limit: $limit, offset: $offset, language: $language) {
      ...StoreCategoryFields
    }
  }
`;

export const GET_STORE_SUBCATEGORIES = gql`
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreSubCategories(
    $limit: Int = 20
    $offset: Int = 0
    $language: Language = ES
  ) {
    getStoreSubCategories(limit: $limit, offset: $offset, language: $language) {
      ...StoreSubCategoryFields
    }
  }
`;

export const GET_STORE_CATEGORY_BY_SLUG = gql`
  ${STORE_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreCategoryBySlug($slug: String!, $language: Language!) {
    getStoreCategoryBySlug(slug: $slug, language: $language) {
      ...StoreCategoryFields
    }
  }
`;

export const GET_STORE_SUBCATEGORY_BY_SLUG = gql`
  ${STORE_SUB_CATEGORY_FIELDS_FRAGMENT}
  query GetStoreSubCategoryBySlug($slug: String!, $language: Language) {
    getStoreSubCategoryBySlug(slug: $slug, language: $language) {
      ...StoreSubCategoryFields
    }
  }
`;

export const GET_STORE_PRODUCT_BY_ID = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  query GetStoreProductById($id: ID!) {
    getStoreProductById(id: $id) {
      ...StoreProductDetailFields
    }
  }
`;

export const GET_STORE_PRODUCTS = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetStoreProducts(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getStoreProducts(
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_BY_SELLER = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetStoreProductsBySeller(
    $sellerId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getStoreProductsBySeller(
      sellerId: $sellerId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_BY_SUBCATEGORY = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetStoreProductsBySubCategory(
    $subCategoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getStoreProductsBySubCategory(
      subCategoryId: $subCategoryId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_BY_CATEGORY = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetProductsByStoreCategory(
    $categoryId: ID!
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getProductsByStoreCategory(
      categoryId: $categoryId
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;

export const GET_STORE_PRODUCTS_ON_OFFER = gql`
  ${STORE_PRODUCT_DETAIL_FIELDS_FRAGMENT}
  ${STORE_PAGE_INFO_FIELDS_FRAGMENT}
  query GetProductsOnOffer(
    $page: Int = 1
    $pageSize: Int = 10
    $filter: StoreProductFilterInput
    $sort: StoreProductSortInput
  ) {
    getProductsOnOffer(
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      pageInfo {
        ...StorePageInfoFields
      }
      nodes {
        ...StoreProductDetailFields
      }
    }
  }
`;
