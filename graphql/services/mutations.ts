import { gql } from "@apollo/client";

import {
  QUOTATION_FIELDS_FRAGMENT,
  SERVICE_BOOKING_FIELDS_FRAGMENT,
  SERVICE_REVIEW_FIELDS_FRAGMENT,
} from "./fragments";

export const ADD_SERVICE = gql`
  mutation AddService($input: AddServiceInput!) {
    addService(input: $input) {
      id
      name
    }
  }
`;

export const UPDATE_SERVICE = gql`
  mutation UpdateService($input: UpdateServiceInput!) {
    updateService(input: $input) {
      id
      name
      updatedAt
    }
  }
`;

export const DELETE_SERVICE = gql`
  mutation DeleteService($id: ID!) {
    deleteService(id: $id) {
      id
      deletedAt
    }
  }
`;

export const TOGGLE_SERVICE_ACTIVE = gql`
  mutation ToggleServiceActive($id: ID!) {
    toggleServiceActive(id: $id) {
      id
      isActive
    }
  }
`;

export const TOGGLE_SERVICE_LIKE = gql`
  mutation ToggleServiceLike($serviceId: ID!) {
    toggleServiceLike(serviceId: $serviceId) {
      id
      isLiked
    }
  }
`;

// ─── Bookings (EK-11) ────────────────────────────────────────────────────────
// `clientId` is not part of the input: the services subgraph fills it from the
// session so a booking cannot be made in someone else's name.

export const ADD_SERVICE_BOOKING = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  mutation AddServiceBooking($input: AddServiceBookingInput!) {
    addServiceBooking(input: $input) {
      ...ServiceBookingFields
    }
  }
`;

export const CANCEL_SERVICE_BOOKING = gql`
  ${SERVICE_BOOKING_FIELDS_FRAGMENT}
  mutation CancelServiceBooking($id: ID!, $reason: String!) {
    cancelServiceBooking(id: $id, reason: $reason) {
      ...ServiceBookingFields
    }
  }
`;

// ─── Quotations (EK-12) ──────────────────────────────────────────────────────

export const ADD_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation AddQuotation($input: AddQuotationInput!) {
    addQuotation(input: $input) {
      ...QuotationFields
    }
  }
`;

/** The provider's reply — price, duration and terms. Provider-only server-side. */
export const UPDATE_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation UpdateQuotation($input: UpdateQuotationInput!) {
    updateQuotation(input: $input) {
      ...QuotationFields
    }
  }
`;

export const ACCEPT_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation AcceptQuotation($id: ID!) {
    acceptQuotation(id: $id) {
      ...QuotationFields
    }
  }
`;

export const DECLINE_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation DeclineQuotation($id: ID!, $reason: String) {
    declineQuotation(id: $id, reason: $reason) {
      ...QuotationFields
    }
  }
`;

export const CANCEL_QUOTATION = gql`
  ${QUOTATION_FIELDS_FRAGMENT}
  mutation CancelQuotation($id: ID!, $reason: String) {
    cancelQuotation(id: $id, reason: $reason) {
      ...QuotationFields
    }
  }
`;

// ─── Reviews (EK-19) ─────────────────────────────────────────────────────────
// `reviewerId` is not part of the input — the subgraph takes it from the
// session, and only accepts a review from someone with a completed booking.

export const ADD_SERVICE_REVIEW = gql`
  ${SERVICE_REVIEW_FIELDS_FRAGMENT}
  mutation AddServiceReview($input: AddServiceReviewInput!) {
    addServiceReview(input: $input) {
      ...ServiceReviewFields
    }
  }
`;

export const DELETE_SERVICE_REVIEW = gql`
  mutation DeleteServiceReview($id: ID!) {
    deleteServiceReview(id: $id)
  }
`;
