import { gql } from "@apollo/client";

// Business tag catalog, served by the users subgraph. The field does not exist
// on the schema yet — `useBusinessTags` queries with `errorPolicy: "all"` and
// falls back to a local eco list until the backend exposes real tag data.
export const GET_BUSINESS_TAGS = gql`
  query BusinessTags {
    businessTags {
      id
      label
    }
  }
`;
