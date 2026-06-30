import { gql } from "@apollo/client";

/**
 * Federated catalog search (ekoru-search subgraph). `language` and `country`
 * are required and always supplied by the client (web + mobile): results are
 * scoped to that market and the items indexed under that language. The `input`
 * carries the free-text query plus paging — see SearchInput in the subgraph.
 */
export const SEARCH = gql`
  query Search(
    $input: SearchInput!
    $language: Language!
    $country: String!
  ) {
    search(input: $input, language: $language, country: $country) {
      searchId
      query
      processingTimeMs
      items {
        id
        type
        name
        description
        price
        offerPrice
        hasOffer
        images
        category
        subcategory
        rating
        reviewCount
        sellerId
        tags
        highlightedName
      }
      pageInfo {
        currentPage
        pageSize
        totalItems
        totalPages
        hasNextPage
        hasPreviousPage
      }
      facets {
        categories {
          name
          count
        }
        types {
          name
          count
        }
        tags {
          name
          count
        }
      }
    }
  }
`;
