import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import es from "@/i18n/locales/es.json";
import { axe } from "@/test/axe";
import { CONSENT_COOKIE, CONSENT_VERSION, parseConsent } from "../consent";
import { useConsentStore } from "../hooks/useConsent";
import { ConsentBanner, CookiePreferencesButton } from "./ConsentBanner";

vi.mock("next/navigation", () => ({ useParams: () => ({ lang: "es" }) }));

const ANALYTICS = ["analytics"] as const;

function Page({ categories = ANALYTICS }: { categories?: readonly "analytics"[] }) {
  return (
    <DictionaryProvider dictionary={es}>
      <ConsentBanner categories={categories} />
      <CookiePreferencesButton label="Preferencias de cookies" categories={categories} />
    </DictionaryProvider>
  );
}

const storedChoice = () =>
  parseConsent(
    decodeURIComponent(
      document.cookie.match(new RegExp(`${CONSENT_COOKIE}=([^;]*)`))?.[1] ?? "",
    ) || null,
  );

describe("ConsentBanner", () => {
  beforeEach(() => {
    document.cookie = `${CONSENT_COOKIE}=; max-age=0; path=/`;
    useConsentStore.setState({ choice: null, loaded: false, reopened: false });
  });

  it("shows nothing while the site uses no optional cookies", () => {
    render(<Page categories={[]} />);

    expect(screen.queryByRole("region")).toBeNull();
    expect(screen.queryByRole("button", { name: "Preferencias de cookies" })).toBeNull();
  });

  it("asks a first-time visitor, linking to the privacy notice", () => {
    render(<Page />);

    expect(screen.getByRole("heading", { name: "Tu privacidad" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Más información" })).toHaveAttribute(
      "href",
      "/es/terms-and-conditions#clause-s6",
    );
  });

  it("stores an acceptance and goes away", async () => {
    render(<Page />);

    await userEvent.click(screen.getByRole("button", { name: "Aceptar" }));

    expect(storedChoice()).toEqual({ analytics: true, version: CONSENT_VERSION });
    expect(screen.queryByRole("heading", { name: "Tu privacidad" })).toBeNull();
  });

  it("stores a refusal just as easily", async () => {
    render(<Page />);

    await userEvent.click(screen.getByRole("button", { name: "Rechazar" }));

    expect(storedChoice()).toEqual({ analytics: false, version: CONSENT_VERSION });
    expect(screen.queryByRole("heading", { name: "Tu privacidad" })).toBeNull();
  });

  it("remembers an answer and reopens from the footer", async () => {
    document.cookie = `${CONSENT_COOKIE}=${encodeURIComponent(
      JSON.stringify({ analytics: false, version: CONSENT_VERSION }),
    )}; path=/`;
    render(<Page />);

    expect(screen.queryByRole("heading", { name: "Tu privacidad" })).toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: "Preferencias de cookies" }),
    );
    expect(screen.getByRole("heading", { name: "Tu privacidad" })).toBeInTheDocument();
  });

  it("has no accessibility violations", async () => {
    const { container } = render(<Page />);

    expect((await axe(container)).violations).toEqual([]);
  });
});
