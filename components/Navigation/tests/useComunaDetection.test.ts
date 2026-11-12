import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EXPLORE_LOCATION_COOKIE } from "@/constants/settings";
import { useComunaDetection } from "../hooks/useComunaDetection";

const NUNOA = { latitude: -33.4569, longitude: -70.5976 };

function stubPosition(result: { coords: typeof NUNOA } | { code: number }) {
  Object.defineProperty(navigator, "geolocation", {
    configurable: true,
    value: {
      getCurrentPosition: (
        resolve: (p: unknown) => void,
        reject: (e: unknown) => void,
      ) => ("code" in result ? reject({ ...result, message: "stub" }) : resolve(result)),
    },
  });
}

function stubGeocoder(response: Promise<unknown>) {
  vi.stubGlobal("fetch", vi.fn(() => response));
}

async function detect() {
  const { result } = renderHook(() => useComunaDetection("es", { background: false }));
  let status: string | undefined;
  await act(async () => {
    status = await result.current.detect();
  });
  expect(result.current.status).toBe(status);
  return status;
}

beforeEach(() => {
  document.cookie = `${EXPLORE_LOCATION_COOKIE}=;path=/;max-age=0`;
  vi.spyOn(console, "warn").mockImplementation(() => {});
});
afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

describe("useComunaDetection", () => {
  it("saves the comuna and position when both steps work", async () => {
    stubPosition({ coords: NUNOA });
    stubGeocoder(Promise.resolve({ ok: true, json: async () => ({ name: "Ñuñoa" }) }));

    expect(await detect()).toBe("detected");
    expect(decodeURIComponent(document.cookie)).toContain('"county":"Ñuñoa"');
  });

  it("reports a refused permission as denied", async () => {
    stubPosition({ code: 1 });
    expect(await detect()).toBe("denied");
  });

  it.each([
    ["no position from the device", 2],
    ["a timeout", 3],
  ])("reports %s as unavailable, not as a naming error", async (_, code) => {
    stubPosition({ code });
    expect(await detect()).toBe("unavailable");
  });

  it("reports a failed comuna lookup as error, and keeps what was stored", async () => {
    stubPosition({ coords: NUNOA });
    stubGeocoder(Promise.reject(new TypeError("Failed to fetch")));

    expect(await detect()).toBe("error");
    expect(document.cookie).not.toContain(EXPLORE_LOCATION_COOKIE);
  });
});
