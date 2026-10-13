import { describe, expect, it } from "vitest";
import {
  ACTIVE_CATEGORIES,
  allows,
  CONSENT_VERSION,
  needsDecision,
  parseConsent,
  serializeConsent,
} from "./consent";

const accepted = { analytics: true, version: CONSENT_VERSION };
const rejected = { analytics: false, version: CONSENT_VERSION };

describe("consent", () => {
  it("uses no optional category until one is switched on", () => {
    expect(ACTIVE_CATEGORIES).toEqual([]);
  });

  it("reads back what it stored", () => {
    // The cookie helper hands back the decoded value.
    const stored = decodeURIComponent(serializeConsent(accepted));
    expect(parseConsent(stored)).toEqual(accepted);
  });

  it("treats a missing, broken or outdated answer as none", () => {
    expect(parseConsent(null)).toBeNull();
    expect(parseConsent("not json")).toBeNull();
    expect(parseConsent(JSON.stringify({ analytics: "yes", version: 1 }))).toBeNull();
    expect(
      parseConsent(JSON.stringify({ analytics: true, version: CONSENT_VERSION + 1 })),
    ).toBeNull();
  });

  it("asks only when a category is in use and nobody has answered", () => {
    expect(needsDecision(null, [])).toBe(false);
    expect(needsDecision(null, ["analytics"])).toBe(true);
    expect(needsDecision(rejected, ["analytics"])).toBe(false);
  });

  it("allows a category only when it is in use and was accepted", () => {
    expect(allows(accepted, "analytics", ["analytics"])).toBe(true);
    expect(allows(rejected, "analytics", ["analytics"])).toBe(false);
    expect(allows(null, "analytics", ["analytics"])).toBe(false);
    // Accepted earlier, but the build no longer uses it.
    expect(allows(accepted, "analytics", [])).toBe(false);
  });
});
