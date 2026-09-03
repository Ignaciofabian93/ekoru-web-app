import { gql } from "@apollo/client";

import {
  HOME_MARKETPLACE_PRODUCT_FIELDS_FRAGMENT,
  HOME_SERVICE_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_SERVICES_HOME = gql`
  ${HOME_SERVICE_FIELDS_FRAGMENT}
  query GetServices($page: Int = 1, $pageSize: Int = 20, $isActive: Boolean = true) {
    getServices(page: $page, pageSize: $pageSize, isActive: $isActive) {
      nodes {
        ...HomeServiceFields
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        pageSize
      }
    }
  }
`;

export const GET_EXCHANGEABLE_PRODUCTS_HOME = gql`
  ${HOME_MARKETPLACE_PRODUCT_FIELDS_FRAGMENT}
  query GetExchangeableProducts(
    $page: Int = 1
    $pageSize: Int = 24
    $filter: ProductFilterInput = { isExchangeable: true }
    $sort: ProductSortInput
  ) {
    getExchangeableProducts(
      page: $page
      pageSize: $pageSize
      filter: $filter
      sort: $sort
    ) {
      nodes {
        ...HomeMarketplaceProductFields
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        pageSize
      }
    }
  }
`;

/**
 * The sale-only rail. `getExchangeableProducts` cannot serve this one: it
 * overrides `filter.isExchangeable` with `true` server-side, so asking it for
 * `false` still returns swaps. `getProducts` honours the filter as given.
 */
export const GET_SALE_PRODUCTS_HOME = gql`
  ${HOME_MARKETPLACE_PRODUCT_FIELDS_FRAGMENT}
  query GetSaleProducts(
    $page: Int = 1
    $pageSize: Int = 24
    $filter: ProductFilterInput = { isExchangeable: false }
    $sort: ProductSortInput
  ) {
    getProducts(page: $page, pageSize: $pageSize, filter: $filter, sort: $sort) {
      nodes {
        ...HomeMarketplaceProductFields
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
        pageSize
      }
    }
  }
`;
