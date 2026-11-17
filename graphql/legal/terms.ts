import { gql } from "@apollo/client";

/** The terms in force, as blocks of plain text (LEG-1). Public. */
export const CURRENT_TERMS_DOCUMENT = `
  query CurrentTerms($language: Language) {
    currentTerms(language: $language) {
      version
      publishedAt
      language
      title
      summary
      blocks {
        kind
        text
      }
    }
  }
`;

/** Just the version in force: what the sign-up form says it accepted. */
export const CURRENT_TERMS_VERSION = gql`
  query CurrentTermsVersion {
    currentTerms {
      version
    }
  }
`;

/** Whether the signed-in account has to accept the terms in force. */
export const MY_TERMS_STATUS = gql`
  query MyTermsStatus($language: Language) {
    myTermsStatus(language: $language) {
      currentVersion
      acceptedVersion
      mustAccept
      summary
    }
  }
`;

export const ACCEPT_TERMS = gql`
  mutation AcceptTerms($version: Int!, $language: Language) {
    acceptTerms(version: $version, language: $language) {
      currentVersion
      acceptedVersion
      mustAccept
      summary
    }
  }
`;
