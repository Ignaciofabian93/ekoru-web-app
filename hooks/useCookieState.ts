"use client";

import { useCallback, useSyncExternalStore } from "react";
import { getCookie, setCookie } from "@/utils/cookies";

const listeners = new Set<() => void>();

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

/**
 * Cookie-backed state that survives reloads and is readable server-side.
 * Renders `fallback` on the server and first client paint to avoid hydration
 * mismatches, then resolves to the cookie value. `validate` rejects stale or
 * tampered values.
 */
export function useCookieState(
  name: string,
  fallback: string,
  validate: (value: string) => boolean = () => true
): [string, (value: string) => void] {
  const value = useSyncExternalStore(
    subscribe,
    () => {
      const stored = getCookie(name);
      return stored && validate(stored) ? stored : fallback;
    },
    () => fallback
  );

  const set = useCallback(
    (next: string) => {
      setCookie(name, next);
      listeners.forEach((listener) => listener());
    },
    [name]
  );

  return [value, set];
}
