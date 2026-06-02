import { gql } from "@apollo/client";

export const GET_BLOG_CATALOG = gql`
  query GetBlogCatalog($language: Language = ES) {
    getBlogCatalog(language: $language) {
      id
      icon
      name
      description
      slug
      href
    }
  }
`;
