import { gql } from "@apollo/client";

export const GET_COMMUNITY_CATALOG = gql`
  query GetCommunityCatalog(
    $language: Language = ES
    $enableSubCategories: Boolean = true
  ) {
    getCommunityCatalog(language: $language) {
      id
      category
      slug
      href
      description
      subcategories @include(if: $enableSubCategories) {
        id
        subcategory
        slug
        href
        description
      }
    }
  }
`;

export const GET_COMMUNITY_CATEGORY_BY_SLUG = gql`
  query GetCommunityCategoryBySlug($slug: String!, $language: Language!) {
    getCommunityCategoryBySlug(slug: $slug, language: $language) {
      id
      translation {
        id
        category
        slug
        description
        href
      }
      subcategories {
        id
        translation {
          id
          subCategory
          slug
          description
          href
        }
      }
    }
  }
`;

export const GET_COMMUNITY_SUBCATEGORY_BY_SLUG = gql`
  query GetCommunitySubCategoryBySlug($slug: String!, $language: Language) {
    getCommunitySubCategoryBySlug(slug: $slug, language: $language) {
      id
      communityCategoryId
      translation {
        id
        subCategory
        slug
        description
        href
      }
    }
  }
`;

/**
 * Community events (workshops, tutorials, meet-ups). Organised by business
 * accounts; anyone can reserve a place. Upcoming first — past events only when
 * `includePast` is set.
 */
export const GET_COMMUNITY_EVENTS = gql`
  query CommunityEvents(
    $page: Int = 1
    $pageSize: Int = 12
    $includePast: Boolean = false
    $authorId: String
  ) {
    communityEvents(
      page: $page
      pageSize: $pageSize
      includePast: $includePast
      authorId: $authorId
    ) {
      nodes {
        id
        title
        content
        coverImage
        startDate
        endDate
        capacity
        registrationCount
        remainingCapacity
        authorId
      }
      pageInfo {
        currentPage
        totalPages
        totalCount
        hasNextPage
      }
    }
  }
`;

export const GET_MY_EVENT_REGISTRATIONS = gql`
  query MyCommunityEventRegistrations($page: Int = 1, $pageSize: Int = 20) {
    myCommunityEventRegistrations(page: $page, pageSize: $pageSize) {
      nodes {
        id
        communityPostId
        name
        email
        createdAt
      }
      pageInfo {
        totalCount
      }
    }
  }
`;
