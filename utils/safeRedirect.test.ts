import { describe, expect, it } from "vitest";
import { safeRedirectPath } from "./safeRedirect";

describe("safeRedirectPath (GW-7)", () => {
  it("keeps a path inside the site, with its query", () => {
    expect(safeRedirectPath("/es/profile")).toBe("/es/profile");
    expect(safeRedirectPath("/es/cart/checkout?g=2")).toBe("/es/cart/checkout?g=2");
  });

  it.each([
    ["a full URL", "https://example.com"],
    ["a scheme-relative URL", "//example.com"],
    ["a backslash read as a slash", "/\\example.com"],
    ["a backslash further in", "/es\\..\\example.com"],
    ["a tab the browser drops", "/\t/example.com"],
    ["a line break the browser drops", "/\n/example.com"],
    ["a script URL", "javascript:alert(1)"],
    ["a relative path", "es/profile"],
    ["nothing", ""],
    ["no value", null],
  ])("refuses %s", (_label, value) => {
    expect(safeRedirectPath(value)).toBeNull();
  });
});
