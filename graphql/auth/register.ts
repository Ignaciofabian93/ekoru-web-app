import { gql } from "@apollo/client";

export const REGISTER_PERSON = gql`
  mutation RegisterPerson($input: RegisterPersonInput!, $language: Language = ES) {
    registerPerson(input: $input, language: $language) {
      id
      email
      sellerType
      createdAt
      updatedAt
    }
  }
`;

export const REGISTER_BUSINESS = gql`
  mutation RegisterBusiness($input: RegisterBusinessInput!, $language: Language = ES) {
    registerBusiness(input: $input, language: $language) {
      id
      email
      sellerType
      createdAt
      updatedAt
    }
  }
`;
