/**
 * Cookie consent (WEB-15). The site sets only necessary cookies (session,
 * language, country), which need no consent, so today nothing asks. An
 * optional category is declared here when it starts being used, and anything
 * it loads must wait for `allows(choice, category)`.
 */

/** Optional cookie categories. Necessary cookies are not a category. */
export type ConsentCategory = "analytics";

export interface ConsentChoice {
  analytics: boolean;
  /** Bumped when the categories change, so an older answer asks again. */
  version: number;
}

export const CONSENT_COOKIE = "ekoru_consent";
export const CONSENT_VERSION = 1;
/** Six months, as the privacy notice says (terms 6.4). */
export const CONSENT_MAX_AGE_SECONDS = 60 * 60 * 24 * 182;

/**
 * The optional categories this build uses. Empty until analytics arrives
 * (WEB-19), which sets NEXT_PUBLIC_ANALYTICS_ENABLED=true and then loads its
 * script only when `allows(choice, "analytics")`.
 */
export const ACTIVE_CATEGORIES: readonly ConsentCategory[] =
  process.env.NEXT_PUBLIC_ANALYTICS_ENABLED === "true" ? ["analytics"] : [];

/** Reads the stored answer; anything unreadable or outdated counts as none. */
export function parseConsent(raw: string | null): ConsentChoice | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ConsentChoice>;
    if (value.version !== CONSENT_VERSION || typeof value.analytics !== "boolean") {
      return null;
    }
    return { analytics: value.analytics, version: value.version };
  } catch {
    return null;
  }
}

/** Cookie-safe form of an answer (JSON has commas and quotes). */
export function serializeConsent(choice: ConsentChoice): string {
  return encodeURIComponent(JSON.stringify(choice));
}

/** The visitor still has to answer: some category is in use and they have not. */
export function needsDecision(
  choice: ConsentChoice | null,
  active: readonly ConsentCategory[] = ACTIVE_CATEGORIES,
): boolean {
  return active.length > 0 && choice === null;
}

/** True only for a category in use that the visitor accepted. */
export function allows(
  choice: ConsentChoice | null,
  category: ConsentCategory,
  active: readonly ConsentCategory[] = ACTIVE_CATEGORIES,
): boolean {
  return active.includes(category) && choice?.[category] === true;
}
