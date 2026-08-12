import { gql } from "@apollo/client";

/**
 * Plan cards render the catalogue: the DB membership id (needed to start the
 * payment) plus the price the seller's country is actually charged. Pricing is
 * per country, so `countryId` decides which row comes back — pass the signed-in
 * seller's country or the card can quote a price nobody will be charged.
 */
export const PERSON_MEMBERSHIPS = gql`
  query PersonMemberships($countryId: Int) {
    personMemberships(countryId: $countryId) {
      id
      membershipType
      durationMonths
      pricing {
        price
        currency
      }
    }
  }
`;

export const BUSINESS_MEMBERSHIPS = gql`
  query BusinessMemberships($countryId: Int) {
    businessMemberships(countryId: $countryId) {
      id
      membershipType
      durationMonths
      pricing {
        price
        currency
      }
    }
  }
`;

/**
 * The signed-in seller's own membership and its term. Null on the free tier —
 * a free plan has no subscription row and therefore no dates to show.
 */
export const MY_SUBSCRIPTION = gql`
  query MySubscription {
    mySubscription {
      id
      membershipId
      plan
      isBusiness
      startDate
      endDate
      isActive
      autoRenew
    }
  }
`;
