import { beforeEach, describe, expect, it, vi } from "vitest";
import { EXPLORE_LOCATION_COOKIE, EXPLORE_RADIUS_COOKIE } from "@/constants/settings";
import { getExploreLocationSeed } from "../api/getExploreLocationSeed";

const jar = vi.hoisted(() => new Map<string, string>());

vi.mock("server-only", () => ({}));
vi.mock("next/headers", () => ({
  // Next hands cookie values over already URL-decoded.
  cookies: async () => ({
    get: (name: string) => (jar.has(name) ? { name, value: jar.get(name) } : undefined),
  }),
}));

beforeEach(() => jar.clear());

describe("getExploreLocationSeed", () => {
  it("reads the visitor's comuna and radius from the request", async () => {
    jar.set(
      EXPLORE_LOCATION_COOKIE,
      JSON.stringify({ county: "Ñuñoa", countyId: 10, source: "manual" }),
    );
    jar.set(EXPLORE_RADIUS_COOKIE, "25");

    expect(await getExploreLocationSeed()).toEqual({
      location: {
        county: "Ñuñoa",
        countyId: 10,
        latitude: undefined,
        longitude: undefined,
        source: "manual",
      },
      radius: 25,
    });
  });

  it("has no comuna and the default radius for a new visitor", async () => {
    expect(await getExploreLocationSeed()).toEqual({ location: null, radius: 10 });
  });

  it("ignores tampered cookies", async () => {
    jar.set(EXPLORE_LOCATION_COOKIE, "not json");
    jar.set(EXPLORE_RADIUS_COOKIE, "1000");

    expect(await getExploreLocationSeed()).toEqual({ location: null, radius: 10 });
  });
});
