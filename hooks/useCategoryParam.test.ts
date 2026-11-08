import { renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useCategoryParam } from "./useCategoryParam";

let search = "";
vi.mock("next/navigation", () => ({
  usePathname: () => "/es/stores",
  useSearchParams: () => new URLSearchParams(search),
}));

describe("useCategoryParam", () => {
  let replaceState: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    replaceState = vi.spyOn(window.history, "replaceState").mockImplementation(() => {});
  });

  afterEach(() => {
    replaceState.mockRestore();
    search = "";
    window.history.pushState(null, "", "/");
  });

  it("reads the category from the URL", () => {
    search = "category=cosmetica";
    const { result } = renderHook(() => useCategoryParam());

    expect(result.current.category).toBe("cosmetica");
  });

  it("treats a missing or empty param as no category", () => {
    search = "category=";
    const { result } = renderHook(() => useCategoryParam());

    expect(result.current.category).toBeNull();
  });

  it("writes the slug without a navigation, keeping other params", () => {
    window.history.pushState(null, "", "/es/stores?ref=home");
    const { result } = renderHook(() => useCategoryParam());

    result.current.setCategory("deporte");

    expect(replaceState).toHaveBeenCalledWith(
      null,
      "",
      "/es/stores?ref=home&category=deporte",
    );
  });

  it("drops the param when cleared", () => {
    window.history.pushState(null, "", "/es/stores?category=deporte");
    const { result } = renderHook(() => useCategoryParam());

    result.current.setCategory(null);

    expect(replaceState).toHaveBeenCalledWith(null, "", "/es/stores");
  });
});
