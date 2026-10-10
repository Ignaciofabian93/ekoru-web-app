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

/**
 * The organiser cancels their own event. Everyone registered is emailed
 * (guests included) and members get an in-app notice; the event leaves the
 * public lists.
 */
export const CANCEL_MY_COMMUNITY_EVENT = gql`
  mutation CancelMyCommunityEvent($id: Int!, $reason: String) {
    cancelMyCommunityEvent(id: $id, reason: $reason) {
      id
      status
    }
  }
`;

/**
 * The organiser confirms (or clears) that a registered person came. Confirming
 * earns eco-points for them and for the organiser, once.
 */
export const SET_EVENT_ATTENDANCE = gql`
  mutation SetEventAttendance($registrationId: Int!, $attended: Boolean!) {
    setEventAttendance(registrationId: $registrationId, attended: $attended) {
      id
      attendedAt
    }
  }
`;

/** Flag an event for moderators. Needs an account; one report per event. */
export const REPORT_COMMUNITY_EVENT = gql`
  mutation ReportCommunityEvent($input: ReportCommunityEventInput!) {
    reportCommunityEvent(input: $input)
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
