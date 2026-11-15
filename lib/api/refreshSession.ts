/**
 * One session renewal at a time for the whole tab (GW-8).
 *
 * The gateway rotates the refresh token on every renewal and refuses the used
 * one. When the 15-minute access token ran out with several requests on screen
 * (the deals badge, the notification count, `me`), each one started its own
 * `/api/auth/refresh` with the same cookie: one won, and the rest failed as
 * "already used or revoked", so those parts of the screen acted signed out
 * until a reload.
 *
 * Now the first caller starts the renewal and everyone who asks meanwhile gets
 * the same promise. Both the Apollo link and the axios client go through here,
 * so they can't race each other either.
 *
 * Resolves to whether the session was renewed; never rejects.
 */
let inFlight: Promise<boolean> | null = null;

export function refreshSession(): Promise<boolean> {
  if (!inFlight) {
    inFlight = fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then((res) => res.ok)
      .catch(() => false)
      .finally(() => {
        inFlight = null;
      });
  }
  return inFlight;
}
