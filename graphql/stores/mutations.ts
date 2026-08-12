import { gql } from "@apollo/client";

import { STORE_PRODUCT_REVIEW_FIELDS_FRAGMENT } from "./fragments";

export const ADD_STORE_PRODUCT = gql`
  mutation AddStoreProduct($input: AddStoreProductInput!) {
    addStoreProduct(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_STORE_PRODUCT = gql`
  mutation UpdateStoreProduct($input: UpdateStoreProductInput!) {
    updateStoreProduct(input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_STORE_PRODUCT = gql`
  mutation DeleteStoreProduct($id: ID!) {
    deleteStoreProduct(id: $id) {
      id
      deletedAt
    }
  }
`;

export const TOGGLE_STORE_PRODUCT_ACTIVE = gql`
  mutation ToggleStoreProductActive($id: ID!) {
    toggleStoreProductActive(id: $id) {
      id
      isActive
    }
  }
`;

export const TOGGLE_STORE_PRODUCT_LIKE = gql`
  mutation ToggleStoreProductLike($storeProductId: ID!) {
    toggleStoreProductLike(storeProductId: $storeProductId) {
      id
      isLiked
    }
  }
`;

// ─── Reviews (EK-18) ─────────────────────────────────────────────────────────
// The reviewer comes from the session and must have a paid order for the
// product, so neither is part of the input.

export const ADD_STORE_PRODUCT_REVIEW = gql`
  ${STORE_PRODUCT_REVIEW_FIELDS_FRAGMENT}
  mutation AddStoreProductReview($input: AddStoreProductReviewInput!) {
    addStoreProductReview(input: $input) {
      ...StoreProductReviewFields
    }
  }
`;

export const DELETE_STORE_PRODUCT_REVIEW = gql`
  mutation DeleteStoreProductReview($id: ID!) {
    deleteStoreProductReview(id: $id)
  }
`;
