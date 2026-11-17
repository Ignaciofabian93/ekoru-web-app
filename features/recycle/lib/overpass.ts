import "server-only";

import { SITE_URL } from "@/config/site";

import { MATERIAL_KEYS } from "../constants/points";
import type { RecyclePoint } from "../types";

export type BoundingBox = { south: number; west: number; north: number; east: number };

// Public Overpass instances, raced against each other: whichever answers first
// wins and the rest are cancelled. In November 2026 the main instance took
// 60–70 s to answer when it accepted a query at all, and the other two often
// didn't respond, so no single one can be relied on.
const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.private.coffee/api/interpreter",
];

// Overpass asks clients to say who they are, and answers 406 to requests that
// look anonymous (curl's default, a bare "Mozilla/5.0"). Browsers already send
// this origin as the Referer, so naming it here reveals nothing new.
const USER_AGENT = `recycle-map/1.0 (+${SITE_URL})`;

/** Server-side query budget (seconds). The query is tiny; waiting in the queue is what takes time. */
const QUERY_TIMEOUT_S = 25;

/** Statuses that mean "busy, try again later", not "the query is wrong". */
const RETRYABLE_STATUSES = new Set([429, 502, 503, 504]);

/** Pauses between attempts on one instance; the last one repeats. */
const BACKOFF_MS = [2_000, 5_000, 10_000, 20_000];

/** An answer that asking again won't change (a 400, say). Everything else is retried. */
class FatalError extends Error {}

export function parseOverpassElements(json: {
  elements?: Record<string, unknown>[];
}): RecyclePoint[] {
  return (json.elements ?? []).map((el): RecyclePoint => {
    const tags = (el.tags ?? {}) as Record<string, string>;
    const materials = MATERIAL_KEYS.filter((k) => tags[`recycling:${k}`] === "yes");
    return {
      id: el.id as number,
      lat: el.lat as number,
      lon: el.lon as number,
      name: tags.name,
      operator: tags.operator,
      openingHours: tags.opening_hours,
      materials,
    };
  });
}

function buildQuery(box: BoundingBox): string {
  const bbox = [box.south, box.west, box.north, box.east].map((n) => n.toFixed(4)).join(",");
  return `[out:json][timeout:${QUERY_TIMEOUT_S}];node[amenity=recycling](${bbox});out body;`;
}

function pause(ms: number, signal: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(resolve, ms);
    signal.addEventListener(
      "abort",
      () => {
        clearTimeout(timer);
        reject(signal.reason);
      },
      { once: true },
    );
  });
}

/** Keeps asking one instance, backing off while it is busy, until it answers or the deadline passes. */
async function askUntil(
  endpoint: string,
  body: string,
  deadline: number,
  signal: AbortSignal,
): Promise<RecyclePoint[]> {
  for (let attempt = 0; ; attempt++) {
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new Error(`Out of time waiting on ${endpoint}`);

    let error: unknown;
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Accept: "application/json",
          "User-Agent": USER_AGENT,
        },
        body,
        cache: "no-store",
        signal: AbortSignal.any([signal, AbortSignal.timeout(remaining)]),
      });
      if (!res.ok) {
        const message = `HTTP ${res.status} from ${endpoint}`;
        throw RETRYABLE_STATUSES.has(res.status)
          ? new Error(message)
          : new FatalError(message);
      }
      const json = (await res.json()) as {
        elements?: Record<string, unknown>[];
        remark?: string;
      };
      // A query that ran out of time still answers 200, with the error in `remark`.
      if (json.remark && /error/i.test(json.remark)) {
        throw new Error(`${endpoint}: ${json.remark}`);
      }
      return parseOverpassElements(json);
    } catch (err) {
      if (signal.aborted || err instanceof FatalError) throw err;
      // Busy answers, network failures and timeouts are worth another try.
      error = err;
    }

    const wait = BACKOFF_MS[Math.min(attempt, BACKOFF_MS.length - 1)];
    if (Date.now() + wait >= deadline) throw error;
    await pause(wait, signal);
  }
}

/**
 * Every recycling point (OSM `amenity=recycling` node) inside `box`, from
 * whichever Overpass instance answers first within `budgetMs`. Rejects once
 * every instance has failed or the budget runs out.
 */
export async function fetchRecyclePointsInBox(
  box: BoundingBox,
  budgetMs: number,
): Promise<RecyclePoint[]> {
  const body = `data=${encodeURIComponent(buildQuery(box))}`;
  const deadline = Date.now() + budgetMs;
  const controller = new AbortController();
  try {
    return await Promise.any(
      OVERPASS_ENDPOINTS.map((endpoint) =>
        askUntil(endpoint, body, deadline, controller.signal),
      ),
    );
  } finally {
    // The winner is in; stop the others from holding a slot on their instance.
    controller.abort();
  }
}
