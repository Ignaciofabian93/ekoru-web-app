import { gql } from "@apollo/client";

import {
  HOME_EXCHANGEABLE_PRODUCT_FIELDS_FRAGMENT,
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
  ${HOME_EXCHANGEABLE_PRODUCT_FIELDS_FRAGMENT}
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
        ...HomeExchangeableProductFields
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
