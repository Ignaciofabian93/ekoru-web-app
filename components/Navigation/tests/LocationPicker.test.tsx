import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderToString } from "react-dom/server";
import { beforeEach, describe, expect, it, onTestFinished, vi } from "vitest";
import { ExploreLocationSeedProvider } from "@/context/ExploreLocationContext";
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
  it("names the comuna in the server's HTML when the page read the cookie", () => {
    const container = document.body.appendChild(document.createElement("div"));
    onTestFinished(() => container.remove());
    container.innerHTML = renderToString(
      <ExploreLocationSeedProvider
        seed={{ location: { county: "Ñuñoa", source: "geolocation" }, radius: 10 }}
      >
        <DictionaryProvider dictionary={{ [NAMESPACE]: en }}>
          <LocationPicker />
        </DictionaryProvider>
      </ExploreLocationSeedProvider>,
    );

    // Same text as after hydration, so the pill doesn't change width.
    expect(
      within(container).getByRole("button", { name: "Exploring in: Ñuñoa" }),
    ).toBeInTheDocument();
  });

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
