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

export const GET_BLOG_CATEGORY_BY_SLUG = gql`
  query GetBlogCategoryBySlug($slug: String!, $language: Language!) {
    getBlogCategoryBySlug(slug: $slug, language: $language) {
      id
      icon
      translation {
        id
        name
        slug
        description
        href
      }
    }
  }
`;
