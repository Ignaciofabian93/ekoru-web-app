import { gql } from "@apollo/client";

import {
  BUSINESS_PROFILE_FIELDS_FRAGMENT,
  PERSON_PROFILE_FIELDS_FRAGMENT,
  SELLER_FIELDS_FRAGMENT,
  SELLER_LEVEL_FIELDS_FRAGMENT,
  SELLER_PREFERENCES_FIELDS_FRAGMENT,
} from "../users/fragments";

export const UPDATE_SELLER = gql`
  ${SELLER_FIELDS_FRAGMENT}
  mutation UpdateSeller($input: UpdateSellerInput!) {
    updateSeller(input: $input) {
      ...SellerFields
    }
  }
`;

export const UPDATE_PERSON_PROFILE = gql`
  ${PERSON_PROFILE_FIELDS_FRAGMENT}
  mutation UpdatePersonProfile($input: UpdatePersonProfileInput!) {
    updatePersonProfile(input: $input) {
      ...PersonProfileFields
    }
  }
`;

export const UPDATE_BUSINESS_PROFILE = gql`
  ${BUSINESS_PROFILE_FIELDS_FRAGMENT}
  mutation UpdateBusinessProfile($input: UpdateBusinessProfileInput!) {
    updateBusinessProfile(input: $input) {
      ...BusinessProfileFields
    }
  }
`;

export const UPDATE_SELLER_PREFERENCES = gql`
  ${SELLER_PREFERENCES_FIELDS_FRAGMENT}
  mutation UpdateSellerPreferences($input: UpdateSellerPreferencesInput!) {
    updateSellerPreferences(input: $input) {
      ...SellerPreferencesFields
    }
  }
`;

/** The current seller's preference toggles (read via `me`). */
export const GET_MY_PREFERENCES = gql`
  ${SELLER_PREFERENCES_FIELDS_FRAGMENT}
  query GetMyPreferences {
    me {
      id
      preferences {
        ...SellerPreferencesFields
      }
    }
  }
`;

export const UPDATE_PASSWORD = gql`
  mutation UpdatePassword($currentPassword: String!, $newPassword: String!) {
    updatePassword(
      currentPassword: $currentPassword
      newPassword: $newPassword
    ) {
      id
      email
    }
  }
`;

export const REQUEST_PASSWORD_RESET = gql`
  mutation RequestPasswordReset($email: String!, $language: Language = ES) {
    requestPasswordReset(email: $email, language: $language)
  }
`;

/**
 * Second half of the recovery flow. The token comes from the emailed link, so
 * this runs unauthenticated; the backend consumes the token and signs every
 * existing session out.
 */
export const RESET_PASSWORD = gql`
  mutation ResetPassword(
    $token: String!
    $newPassword: String!
    $language: Language = ES
  ) {
    resetPassword(token: $token, newPassword: $newPassword, language: $language)
  }
`;

export const DEACTIVATE_ACCOUNT = gql`
  mutation DeactivateAccount {
    deactivateAccount {
      id
      isActive
    }
  }
`;

export const REACTIVATE_ACCOUNT = gql`
  mutation ReactivateAccount {
    reactivateAccount {
      id
      isActive
    }
  }
`;

/** Permanently delete (anonymise + lock) the current account. Returns Boolean. */
export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount {
    deleteAccount
  }
`;

export const UPDATE_SELLER_CATEGORY = gql`
  ${SELLER_LEVEL_FIELDS_FRAGMENT}
  mutation UpdateSellerCategory($id: String!, $categoryId: Int!) {
    updateSellerCategory(id: $id, categoryId: $categoryId) {
      id
      sellerLevel {
        ...SellerLevelFields
      }
    }
  }
`;
