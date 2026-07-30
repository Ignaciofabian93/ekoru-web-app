import { CombinedGraphQLErrors } from "@apollo/client";

/**
 * Thrown by the error link when a request needs a session the visitor doesn't
 * have and the silent refresh could not obtain one. A typed marker rather than
 * a message string so callers can branch on it reliably.
 */
export class UnauthorizedError extends Error {
  readonly isUnauthorized = true;

  constructor(message = "Unauthorized") {
    super(message);
    this.name = "UnauthorizedError";
  }
}

/** The server's several ways of saying "no valid session". */
export function isUnauthorizedResponse(error: unknown): boolean {
  if (!CombinedGraphQLErrors.is(error)) return false;
  return error.errors.some(
    (e) =>
      e.message === "No autorizado" ||
      e.extensions?.code === "UNAUTHENTICATED" ||
      (e.extensions?.code as number) === 401,
  );
}

/**
 * True when an Apollo error means "you need to sign in" — either the raw
 * rejection from the server, or our marker after a failed token refresh.
 * Screens use this to invite a login instead of showing a generic failure.
 */
export function isUnauthorizedError(error: unknown): boolean {
  if (!error) return false;
  if (error instanceof UnauthorizedError) return true;
  // Apollo may re-wrap the thrown error, so fall back to the marker property.
  if (typeof error === "object" && (error as { isUnauthorized?: boolean }).isUnauthorized) {
    return true;
  }
  return isUnauthorizedResponse(error);
}
