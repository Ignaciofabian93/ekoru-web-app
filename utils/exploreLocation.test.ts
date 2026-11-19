import { describe, expect, it } from "vitest";
import { DEFAULT_EXPLORE_RADIUS_KM } from "@/constants/settings";
import { parseExploreLocation, parseExploreRadius } from "./exploreLocation";

describe("parseExploreLocation", () => {
  it("reads a geolocated comuna with its position", () => {
    expect(
      parseExploreLocation(
        JSON.stringify({
          county: "Ñuñoa",
          latitude: -33.45,
          longitude: -70.6,
          source: "geolocation",
        }),
      ),
    ).toEqual({
      county: "Ñuñoa",
      countyId: undefined,
      latitude: -33.45,
      longitude: -70.6,
      source: "geolocation",
    });
  });

  it("drops half a position, and treats an unknown source as detected", () => {
    expect(
      parseExploreLocation(
        JSON.stringify({ county: "Ñuñoa", countyId: 10, latitude: -33.45 }),
      ),
    ).toEqual({
      county: "Ñuñoa",
      countyId: 10,
      latitude: undefined,
      longitude: undefined,
      source: "geolocation",
    });
  });

  it.each([
    ["no cookie", undefined],
    ["an empty cookie", ""],
    ["something that isn't JSON", "Ñuñoa"],
    ["a location without a comuna", JSON.stringify({ countyId: 10 })],
  ])("returns null for %s", (_, raw) => {
    expect(parseExploreLocation(raw)).toBeNull();
  });
});

describe("parseExploreRadius", () => {
  it("reads an offered radius", () => {
    expect(parseExploreRadius("25")).toBe(25);
  });

  it.each([undefined, "", "7", "far"])("falls back to the default for %s", (raw) => {
    expect(parseExploreRadius(raw)).toBe(DEFAULT_EXPLORE_RADIUS_KM);
  });
});
