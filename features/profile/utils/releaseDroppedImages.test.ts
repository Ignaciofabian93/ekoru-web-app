import { afterEach, describe, expect, it, vi } from "vitest";
import { releaseDroppedImages } from "./releaseDroppedImages";

describe("releaseDroppedImages (GW-3)", () => {
  const fetchMock = vi.fn(() => Promise.resolve(new Response("{}")));
  vi.stubGlobal("fetch", fetchMock);

  afterEach(() => fetchMock.mockClear());

  it("asks the server to delete only the images the edit dropped", () => {
    releaseDroppedImages(
      ["product/s1/a.webp", "product/s1/b.webp"],
      ["product/s1/b.webp"],
    );

    expect(fetchMock).toHaveBeenCalledWith("/api/products/images", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ keys: ["product/s1/a.webp"] }),
    });
  });

  it("sends nothing when no image was dropped", () => {
    releaseDroppedImages(
      ["product/s1/a.webp"],
      ["product/s1/a.webp", "product/s1/c.webp"],
    );
    releaseDroppedImages(null, ["product/s1/c.webp"]);

    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("never throws when the request fails", () => {
    fetchMock.mockImplementationOnce(() => Promise.reject(new Error("offline")));

    expect(() => releaseDroppedImages(["product/s1/a.webp"], [])).not.toThrow();
  });
});
