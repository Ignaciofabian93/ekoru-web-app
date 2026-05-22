import { gql } from "@apollo/client";

export const GET_COMMUNITY_CATALOG = gql`
  query GetCommunityCatalog($language: Language = ES) {
    getCommunityCatalog(language: $language) {
      id
      category
      slug
      href
      description
      subcategories {
        id
        subcategory
        slug
        href
        description
      }
    }
  }
`;
