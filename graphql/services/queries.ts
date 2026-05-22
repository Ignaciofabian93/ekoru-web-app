import { gql } from "@apollo/client";

export const GET_SERVICES_CATALOG = gql`
  query GetServiceCatalog($language: Language = ES) {
    getServiceCatalog(language: $language) {
      id
      name
      href
      slug
      subCategoryItems {
        id
        name
        href
        slug
      }
    }
  }
`;
