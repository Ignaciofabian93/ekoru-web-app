import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import { EXPLORE_LOCATION_COOKIE } from "@/constants/settings";
import en from "../i18n/locales/en.json";
import { NAMESPACE } from "../i18n";
import { LocationPicker } from "../LocationPicker";

const state = vi.hoisted(() => ({
  detect: vi.fn(),
  warning: vi.fn(),
}));

vi.mock("../hooks/useComunaDetection", async (importOriginal) => ({
  // Keeps the real locationStatusMessage.
  ...(await importOriginal<Record<string, unknown>>()),
  useComunaDetection: () => ({ status: "idle", detect: state.detect }),
}));
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ warning: state.warning }),
}));
vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ["en", vi.fn()],
}));

function renderPicker() {
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: en }}>
      <LocationPicker />
    </DictionaryProvider>,
  );
}

beforeEach(() => {
  document.cookie = `${EXPLORE_LOCATION_COOKIE}=;path=/;max-age=0`;
  state.detect.mockReset();
  state.warning.mockReset();
});

describe("LocationPicker", () => {
  it("asks for the location on click, with no dialog", async () => {
    const user = userEvent.setup();
    state.detect.mockResolvedValue("detected");
    renderPicker();

    await user.click(screen.getByRole("button", { name: "Use my location" }));

    expect(state.detect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(state.warning).not.toHaveBeenCalled();
  });

  it("explains a refused permission in a toast", async () => {
    const user = userEvent.setup();
    state.detect.mockResolvedValue("denied");
    renderPicker();

    await user.click(screen.getByRole("button", { name: "Use my location" }));

    expect(state.warning).toHaveBeenCalledWith(
      en.location.status.denied,
      expect.objectContaining({ toastId: "explore-location" }),
    );
  });

  it("shows the comuna it explores from", async () => {
    document.cookie = `${EXPLORE_LOCATION_COOKIE}=${encodeURIComponent(
      JSON.stringify({
        county: "Ñuñoa",
        latitude: -33.45,
        longitude: -70.6,
        source: "geolocation",
      }),
    )};path=/`;
    const { container } = renderPicker();

    expect(
      screen.getByRole("button", { name: "Exploring in: Ñuñoa" }),
    ).toBeInTheDocument();
    expect((await axe(container)).violations).toEqual([]);
  });
});
