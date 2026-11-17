import { NextResponse } from "next/server";
import { lookupRecyclePoints } from "@/features/recycle/lib/pointsCache";
import { RateWindow } from "@/lib/api/rateWindow";
import { visitorAddress } from "@/lib/api/requestLimits";

/**
 * Recycling points around a position, for the recycling map. The browser used
 * to ask public Overpass directly and sat on "loading" for a minute or more
 * whenever it was busy; now the server keeps a shared copy per area
 * (`features/recycle/lib/pointsCache.ts`) and the map polls this route.
 *
 *   200 { points }   ready, nearest first
 *   202 { pending }  the area is still loading; ask again
 *   429              too many new areas from this visitor, or the server is
 *                    already loading as many as it will at once
 *   503              Overpass couldn't be reached
 */

/** New areas a visitor may start loading. Areas already known or loading are free. */
const newAreasPerVisitor = new RateWindow(10, 10 * 60_000);

/** How long one request waits for a loading area before answering 202. Under nginx's 60 s. */
const WAIT_MS = 20_000;

const NO_STORE = { "Cache-Control": "private, no-store" };

function coordinate(value: string | null, limit: number): number | null {
  if (value === null || value.trim() === "") return null;
  const n = Number(value);
  return Number.isFinite(n) && Math.abs(n) <= limit ? n : null;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = coordinate(searchParams.get("lat"), 90);
  const lng = coordinate(searchParams.get("lng"), 180);
  if (lat === null || lng === null) {
    return NextResponse.json({ error: "invalid_coordinates" }, { status: 400, headers: NO_STORE });
  }

  const ip = visitorAddress(request);
  const result = await lookupRecyclePoints(lat, lng, {
    waitMs: WAIT_MS,
    mayStartFetch: () => newAreasPerVisitor.take(ip),
  });

  switch (result.status) {
    case "ready":
      return NextResponse.json({ points: result.points }, { headers: NO_STORE });
    case "pending":
      return NextResponse.json(
        { pending: true },
        { status: 202, headers: { ...NO_STORE, "Retry-After": "1" } },
      );
    case "limited":
      return NextResponse.json(
        { error: "too_many_areas" },
        { status: 429, headers: { ...NO_STORE, "Retry-After": "60" } },
      );
    case "failed":
      return NextResponse.json({ error: "upstream_unavailable" }, { status: 503, headers: NO_STORE });
  }
}
