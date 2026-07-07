import { gql } from "@apollo/client";

import {
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
  PERSON_PROFILE_FIELDS_FRAGMENT,
  SELLER_FIELDS_FRAGMENT,
  SELLER_LEVEL_FIELDS_FRAGMENT,
} from "./fragments";

export const GET_SELLER = gql`
  ${SELLER_FIELDS_FRAGMENT}
  ${PERSON_PROFILE_FIELDS_FRAGMENT}
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  query GetSeller($id: String!) {
    seller(id: $id) {
      ...SellerFields
      profile {
        ... on PersonProfile {
          ...PersonProfileFields
        }
        ... on BusinessProfile {
          ...BusinessProfileFields
        }
      }
    }
  }
`;

export const GET_SELLERS = gql`
  query GetSellers(
    $language: Language!
    $page: Int!
    $pageSize: Int!
    $sellerType: SellerType
    $businessType: BusinessType
    $isActive: Boolean
    $isVerified: Boolean
    $searchQuery: String
    $enablePreferences: Boolean = false
    $enableSellerLevel: Boolean = false
    $enablePagination: Boolean = true
  ) {
    getSellers(
      language: $language
      page: $page
      pageSize: $pageSize
      sellerType: $sellerType
      businessType: $businessType
      isActive: $isActive
      isVerified: $isVerified
      searchQuery: $searchQuery
    ) {
      nodes {
        id
        email
        sellerType
        isActive
        isVerified
        createdAt
        updatedAt
        address
        phone
        website
        preferredContactMethod
        socialMediaLinks
        points
        profile {
          ... on BusinessProfile {
            id
            sellerId
            businessName
            description
            logo
            coverImage
            businessType
            legalBusinessName
            taxId
            businessStartDate
            legalRepresentative
            legalRepresentativeTaxId
            shippingPolicy
            returnPolicy
            serviceArea
            yearsOfExperience
            certifications
            travelRadius
            businessHours
            createdAt
            updatedAt
            businessMembershipSubscriptionId
          }
          ... on PersonProfile {
            id
            sellerId
            firstName
            lastName
            displayName
            bio
            birthday
            profileImage
            coverImage
            allowExchanges
            personMembershipSubscriptionId
          }
        }
        preferences @include(if: $enablePreferences) {
          id
          sellerId
          preferredLanguage
          currency
          emailNotifications
          pushNotifications
          orderUpdates
          communityUpdates
          securityAlerts
          weeklySummary
          twoFactorAuth
        }
        sellerLevel @include(if: $enableSellerLevel) {
          id
          levelName
          minPoints
          maxPoints
          benefits
          badgeIcon
          createdAt
          updatedAt
          translations {
            id
            sellerLevelId
            language
            levelName
            createdAt
            updatedAt
          }
        }
        country {
          id
          country
          createdAt
          updatedAt
          translation {
            id
            countryId
            language
            name
          }
        }
        region {
          id
          region
          countryId
        }
        city {
          id
          city
          regionId
        }
        county {
          id
          county
          cityId
        }
      }
      pageInfo @include(if: $enablePagination) {
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

export const GET_SELLER_LEVELS = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  query GetSellerLevels {
    sellerLevels {
      ...SellerLevelFields
    }
  }
`;

export const GET_SELLER_LEVEL = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  query GetSellerLevel($id: String!) {
    sellerLevel(id: $id) {
      ...SellerLevelFields
    }
  }
`;
