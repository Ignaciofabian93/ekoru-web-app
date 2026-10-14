import { describe, expect, it } from "vitest";
import { catalogPath } from "./catalogPath";

describe("catalogPath", () => {
  it("joins the slugs under the language and the section", () => {
    expect(
      catalogPath("es", "marketplace", "parrillas-jardin-y-terraza", "terraza", "juego-de-terraza"),
    ).toBe("/es/marketplace/parrillas-jardin-y-terraza/terraza/juego-de-terraza");
  });

  it("gives no path when a slug is missing, never a /null segment", () => {
    expect(catalogPath("es", "marketplace", "terraza", null)).toBeUndefined();
    expect(catalogPath("es", "stores", undefined)).toBeUndefined();
    expect(catalogPath("es", "stores", "")).toBeUndefined();
  });
});
