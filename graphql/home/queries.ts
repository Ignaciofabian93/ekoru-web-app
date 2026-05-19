import { gql } from "@apollo/client";

export const GET_EXCHANGEABLE_PRODUCTS_HOME = gql`
  query GetExchangeableProductsHome(
    $page: Int = 1
    $pageSize: Int = 20
    $sort: ProductSortInput
    $filter: ProductFilterInput
  ) {
    getExchangeableProducts(
      page: $page
      pageSize: $pageSize
      sort: $sort
      filter: $filter
    ) {
      nodes {
        id
        name
        description
        color
        images
        brand
        price
        badges
        condition
        isExchangeable
        sellerId
        environmentalImpact {
          totalCo2SavingsKG
          totalWaterSavingsLT
          materialBreakdown {
            materialType
            quantity
            unit
            co2SavingsKG
            waterSavingsLT
          }
        }
        seller {
          id
          email
          sellerType
          isVerified
          address
          phone
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
        productCategory {
          id
          translation {
            name
            slug
            href
          }
        }
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
        hasPreviousPage
        pageSize
      }
    }
  }
`;
