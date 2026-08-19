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

/**
 * The server's several ways of saying "no valid session".
 *
 * `UNAUTHORIZED` is the one that matters: every subgraph raises it via its own
 * `UnAuthorizedError` (`common/exceptions/graphql.exceptions.ts`), with messages
 * like "Debe iniciar sesión". It was missing from this list, so an expired
 * access token never triggered the silent refresh in the error link — the query
 * just failed. That went unnoticed while the gateway still accepted the refresh
 * token as a fallback credential; once it stopped, every 15-minute expiry
 * surfaced as a hard error on polling queries such as unreadNotificationCount.
 *
 * `UNAUTHENTICATED` and `401` are kept for anything raised by Apollo or the
 * gateway's own Nest layer rather than a subgraph.
 *
 * `FORBIDDEN` is deliberately NOT here. It means "signed in, but not allowed" —
 * refreshing the token cannot change the answer, and retrying would just burn a
 * refresh and fail again.
 */
export function isUnauthorizedResponse(error: unknown): boolean {
  if (!CombinedGraphQLErrors.is(error)) return false;
  return error.errors.some((e) => {
    const code = e.extensions?.code;
    return (
      code === "UNAUTHORIZED" ||
      code === "UNAUTHENTICATED" ||
      (code as number) === 401 ||
      e.message === "No autorizado" ||
      e.message === "Debe iniciar sesión"
    );
  });
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
