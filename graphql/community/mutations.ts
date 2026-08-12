import { gql } from "@apollo/client";

/**
 * Reserving a place. Works signed in — the reservation is then linked to the
 * account and can be cancelled — or as a guest who leaves name and email.
 */
export const REGISTER_FOR_COMMUNITY_EVENT = gql`
  mutation RegisterForCommunityEvent($input: RegisterForCommunityEventInput!) {
    registerForCommunityEvent(input: $input) {
      id
      communityPostId
      name
      email
      createdAt
    }
  }
`;

export const CANCEL_MY_EVENT_REGISTRATION = gql`
  mutation CancelMyCommunityEventRegistration($id: Int!) {
    cancelMyCommunityEventRegistration(id: $id)
  }
`;

/** Business accounts only — the subgraph refuses a person account. */
export const CREATE_MY_COMMUNITY_EVENT = gql`
  mutation CreateMyCommunityEvent($input: CreateCommunityEventInput!) {
    createMyCommunityEvent(input: $input) {
      id
      title
      startDate
      capacity
    }
  }
`;
