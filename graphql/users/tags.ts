import { gql } from "@apollo/client";

// Business tag catalog, served by the users subgraph (USR-11). Only ids: the
// labels come from `editProfile.tags.options.<id>` in the profile locales.
export const GET_BUSINESS_TAGS = gql`
  query BusinessTags {
    businessTags {
      id
    }
  }
`;
