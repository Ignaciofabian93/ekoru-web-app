import { gql } from "@apollo/client";

import {
  CITY_FIELDS_FRAGMENT,
  COUNTRY_FIELDS_FRAGMENT,
  COUNTY_FIELDS_FRAGMENT,
  REGION_FIELDS_FRAGMENT,
} from "../location/fragments";

export const BUSINESS_ADDRESS_FIELDS_FRAGMENT = gql`
  ${COUNTRY_FIELDS_FRAGMENT}
  ${REGION_FIELDS_FRAGMENT}
  ${CITY_FIELDS_FRAGMENT}
  ${COUNTY_FIELDS_FRAGMENT}
  fragment BusinessAddressFields on BusinessAddress {
    id
    businessProfileId
    label
    address
    reference
    zipCode
    phone
    isPrimary
    createdAt
    updatedAt
    country {
      ...CountryFields
    }
    region {
      ...RegionFields
    }
    city {
      ...CityFields
    }
    county {
      ...CountyFields
    }
  }
`;

/** The current business seller's locations (read via `me.profile`). */
export const GET_MY_BUSINESS_ADDRESSES = gql`
  ${BUSINESS_ADDRESS_FIELDS_FRAGMENT}
  query GetMyBusinessAddresses {
    me {
      id
      profile {
        ... on BusinessProfile {
          id
          addresses {
            ...BusinessAddressFields
          }
        }
      }
    }
  }
`;

export const ADD_BUSINESS_ADDRESS = gql`
  ${BUSINESS_ADDRESS_FIELDS_FRAGMENT}
  mutation AddBusinessAddress($input: AddBusinessAddressInput!) {
    addBusinessAddress(input: $input) {
      ...BusinessAddressFields
    }
  }
`;

export const UPDATE_BUSINESS_ADDRESS = gql`
  ${BUSINESS_ADDRESS_FIELDS_FRAGMENT}
  mutation UpdateBusinessAddress($input: UpdateBusinessAddressInput!) {
    updateBusinessAddress(input: $input) {
      ...BusinessAddressFields
    }
  }
`;

export const DELETE_BUSINESS_ADDRESS = gql`
  mutation DeleteBusinessAddress($id: Int!) {
    deleteBusinessAddress(id: $id)
  }
`;

export const SET_PRIMARY_BUSINESS_ADDRESS = gql`
  ${BUSINESS_ADDRESS_FIELDS_FRAGMENT}
  mutation SetPrimaryBusinessAddress($id: Int!) {
    setPrimaryBusinessAddress(id: $id) {
      ...BusinessAddressFields
    }
  }
`;
