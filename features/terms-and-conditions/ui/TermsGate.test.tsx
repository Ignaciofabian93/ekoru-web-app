import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DictionaryProvider } from "@/i18n/context";
import { axe } from "@/test/axe";
import es from "../i18n/locales/es.json";
import { NAMESPACE } from "../i18n";
import { TermsGate } from "./TermsGate";

const state = vi.hoisted(() => ({
  seller: { id: "s1" } as { id: string } | null,
  pathname: "/es/marketplace",
  status: null as null | {
    currentVersion: number | null;
    acceptedVersion: number | null;
    mustAccept: boolean;
    summary: string | null;
  },
  accept: vi.fn(),
  refetch: vi.fn(),
  logout: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useParams: () => ({ lang: "es" }),
  usePathname: () => state.pathname,
}));
vi.mock("@/store/useAuthStore", () => ({
  default: (pick: (s: { seller: typeof state.seller }) => unknown) =>
    pick({ seller: state.seller }),
}));
vi.mock("@/features/auth/hooks/useLogout", () => ({
  useLogout: () => ({ handleLogout: state.logout, loading: false }),
}));
vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({ error: vi.fn(), success: vi.fn() }),
}));
vi.mock("@apollo/client/react", () => ({
  useQuery: (_doc: unknown, opts: { skip?: boolean }) => ({
    data: opts.skip || !state.status ? undefined : { myTermsStatus: state.status },
    refetch: state.refetch,
  }),
  useMutation: () => [state.accept, { loading: false }],
}));

function renderGate() {
  return render(
    <DictionaryProvider dictionary={{ [NAMESPACE]: es }}>
      <TermsGate />
    </DictionaryProvider>,
  );
}

describe("TermsGate (LEG-1)", () => {
  beforeEach(() => {
    state.seller = { id: "s1" };
    state.pathname = "/es/marketplace";
    state.status = {
      currentVersion: 2,
      acceptedVersion: 1,
      mustAccept: true,
      summary: "Nueva cláusula 14 sobre envíos.",
    };
    state.accept.mockReset().mockResolvedValue({});
    state.refetch.mockReset();
    state.logout.mockReset();
  });

  it("asks a signed-in account to accept a new version, with what changed", async () => {
    const { container } = renderGate();

    expect(
      screen.getByRole("dialog", { name: "Actualizamos los Términos y Políticas" }),
    ).toBeInTheDocument();
    expect(screen.getByText(/la versión 2 de los Términos/)).toBeInTheDocument();
    expect(screen.getByText("Nueva cláusula 14 sobre envíos.")).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Leer los Términos y Políticas/ }),
    ).toHaveAttribute("href", "/es/terms-and-conditions");
    // No close button: only accepting or signing out.
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual([
      "Cerrar sesión",
      "Los leí y los acepto",
    ]);
    expect((await axe(container.ownerDocument.body)).violations).toEqual([]);
  });

  it("records the acceptance of the version shown, then checks again", async () => {
    renderGate();
    await userEvent.click(screen.getByRole("button", { name: "Los leí y los acepto" }));
    expect(state.accept).toHaveBeenCalledWith({
      variables: { version: 2, language: "ES" },
    });
    expect(state.refetch).toHaveBeenCalled();
  });

  it("lets the person sign out instead", async () => {
    renderGate();
    await userEvent.click(screen.getByRole("button", { name: "Cerrar sesión" }));
    expect(state.logout).toHaveBeenCalled();
  });

  it("titles the first acceptance differently", () => {
    state.status = { currentVersion: 1, acceptedVersion: null, mustAccept: true, summary: null };
    renderGate();
    expect(
      screen.getByRole("dialog", { name: "Acepta los Términos y Políticas" }),
    ).toBeInTheDocument();
  });

  it("stays away from visitors, accounts up to date and the terms page", () => {
    state.seller = null;
    const { unmount } = renderGate();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    unmount();

    state.seller = { id: "s1" };
    state.status = { currentVersion: 2, acceptedVersion: 2, mustAccept: false, summary: null };
    const second = renderGate();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    second.unmount();

    state.status = { currentVersion: 2, acceptedVersion: 1, mustAccept: true, summary: null };
    state.pathname = "/es/terms-and-conditions";
    renderGate();
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});
