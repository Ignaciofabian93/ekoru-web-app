/**
 * Subject options for the contact form. Values are stable, language-agnostic
 * keys; their labels are resolved through i18n (`subjects.<value>`).
 */
export const CONTACT_SUBJECTS = [
  "platformIssues",
  "accountProblems",
  "paymentBilling",
  "productInquiry",
  "feedback",
  "other",
] as const;

export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];
