// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("server-only", () => ({}));

import { fetchRecyclePointsInBox } from "./overpass";

const BOX = { south: -33.55, west: -70.76, north: -33.35, east: -70.54 };

const OK_BODY = {
  elements: [
    {
      id: 7,
      lat: -33.44,
      lon: -70.65,
      tags: { name: "Punto Limpio", "recycling:glass": "yes", "recycling:paper": "no" },
    },
  ],
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });

/** A request that never answers until it is aborted. */
const hang = (init?: RequestInit) =>
  new Promise<Response>((_, reject) => {
    init?.signal?.addEventListener("abort", () => reject(init.signal!.reason));
  });

const fetchMock = vi.fn<typeof fetch>();

beforeEach(() => {
  fetchMock.mockReset();
  vi.stubGlobal("fetch", fetchMock);
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

const isMain = (url: unknown) => String(url).includes("overpass-api.de");

describe("fetchRecyclePointsInBox", () => {
  it("parses the first answer into points", async () => {
    fetchMock.mockImplementation((url, init) =>
      isMain(url) ? Promise.resolve(json(OK_BODY)) : hang(init),
    );

    const points = await fetchRecyclePointsInBox(BOX, 60_000);

    expect(points).toEqual([
      {
        id: 7,
        lat: -33.44,
        lon: -70.65,
        name: "Punto Limpio",
        operator: undefined,
        openingHours: undefined,
        materials: ["glass"],
      },
    ]);
  });

  it("identifies itself and cancels the instances that lost the race", async () => {
    const signals: AbortSignal[] = [];
    fetchMock.mockImplementation((url, init) => {
      signals.push(init!.signal!);
      return isMain(url) ? Promise.resolve(json(OK_BODY)) : hang(init);
    });

    await fetchRecyclePointsInBox(BOX, 60_000);

    const headers = fetchMock.mock.calls[0][1]!.headers as Record<string, string>;
    expect(headers["User-Agent"]).toMatch(/^recycle-map\/1\.0 \(\+https?:\/\//);
    expect(signals).toHaveLength(3);
    expect(signals.every((s) => s.aborted)).toBe(true);
  });

  it("backs off and asks again while an instance is busy", async () => {
    vi.useFakeTimers();
    let mainCalls = 0;
    fetchMock.mockImplementation((url, init) => {
      if (!isMain(url)) return hang(init);
      mainCalls += 1;
      return Promise.resolve(mainCalls === 1 ? json({}, 502) : json(OK_BODY));
    });

    const result = fetchRecyclePointsInBox(BOX, 60_000);
    await vi.advanceTimersByTimeAsync(2_000);

    expect(await result).toHaveLength(1);
    expect(mainCalls).toBe(2);
  });

  it("retries a query that timed out inside Overpass", async () => {
    vi.useFakeTimers();
    let mainCalls = 0;
    fetchMock.mockImplementation((url, init) => {
      if (!isMain(url)) return hang(init);
      mainCalls += 1;
      return Promise.resolve(
        mainCalls === 1
          ? json({ elements: [], remark: "runtime error: Query timed out" })
          : json(OK_BODY),
      );
    });

    const result = fetchRecyclePointsInBox(BOX, 60_000);
    await vi.advanceTimersByTimeAsync(2_000);

    expect(await result).toHaveLength(1);
  });

  it("gives up on an answer that asking again won't change", async () => {
    fetchMock.mockResolvedValue(json({}, 400));

    await expect(fetchRecyclePointsInBox(BOX, 60_000)).rejects.toThrow();
    // One try per instance, no retries.
    expect(fetchMock).toHaveBeenCalledTimes(3);
  });

  it("gives up once the budget runs out", async () => {
    // Real timers: the per-request cap is AbortSignal.timeout, which fake
    // timers don't drive.
    fetchMock.mockImplementation((_, init) => hang(init));

    await expect(fetchRecyclePointsInBox(BOX, 200)).rejects.toThrow();
  });
});
