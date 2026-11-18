import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { EkoruLogo } from "../EkoruLogo";

vi.mock("@/hooks/useLanguage", () => ({
  useLanguage: () => ["es", vi.fn()],
}));

// jsdom loads no CSS, so these assert the Tailwind classes, not computed styles.
const FOCUS_RING = [
  "focus-visible:outline-2",
  "focus-visible:outline-offset-2",
  "focus-visible:outline-border-focus",
];
const DEFAULT_SIZE = ["h-6", "w-26", "drop-shadow-sm"];

function getLogo() {
  return screen.getByRole("img", { name: "EKORU" });
}

describe("EkoruLogo", () => {
  describe("as a home link (default)", () => {
    it("links to the home page of the active language", () => {
      render(<EkoruLogo label="Go to home" />);

      const link = screen.getByRole("link", { name: "Go to home" });
      expect(link).toHaveAttribute("href", "/es");
      expect(link).toContainElement(getLogo());
    });

    it('falls back to "EKORU" as the link name', () => {
      render(<EkoruLogo />);

      expect(screen.getByRole("link", { name: "EKORU" })).toBeInTheDocument();
    });

    it("shows the same focus ring as the header buttons", () => {
      render(<EkoruLogo />);

      expect(screen.getByRole("link")).toHaveClass(...FOCUS_RING);
    });

    it("keeps the focus ring on the link, not on the image", () => {
      render(<EkoruLogo />);

      for (const cls of FOCUS_RING) expect(getLogo()).not.toHaveClass(cls);
    });

    it("can be reached with the keyboard", async () => {
      const user = userEvent.setup();
      render(<EkoruLogo />);

      await user.tab();

      expect(screen.getByRole("link")).toHaveFocus();
    });

    it("has the link's shape and hover styles", () => {
      render(<EkoruLogo />);

      expect(screen.getByRole("link")).toHaveClass(
        "inline-flex",
        "rounded-sm",
        "px-2",
        "py-1",
        "transition-all",
        "hover:brightness-110",
      );
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<EkoruLogo label="Go to home" />);

      expect((await axe(container)).violations).toEqual([]);
    });
  });

  describe("without redirection", () => {
    it("renders the image alone, with no link", () => {
      render(<EkoruLogo enableRedirection={false} />);

      expect(getLogo()).toBeInTheDocument();
      expect(screen.queryByRole("link")).not.toBeInTheDocument();
    });

    it("is not focusable and has no focus ring", async () => {
      const user = userEvent.setup();
      render(<EkoruLogo enableRedirection={false} />);

      await user.tab();

      expect(document.body).toHaveFocus();
      for (const cls of FOCUS_RING) expect(getLogo()).not.toHaveClass(cls);
    });

    it("has no accessibility violations", async () => {
      const { container } = render(<EkoruLogo enableRedirection={false} />);

      expect((await axe(container)).violations).toEqual([]);
    });
  });

  describe.each([
    ["with a link", true],
    ["without a link", false],
  ])("image %s", (_, enableRedirection) => {
    it("has a fixed size, so it does not shift the layout while loading", () => {
      render(<EkoruLogo enableRedirection={enableRedirection} />);

      const logo = getLogo();
      expect(logo).toHaveClass(...DEFAULT_SIZE);
      // Intrinsic size of /brand/logo.webp; reserves the aspect ratio.
      expect(logo).toHaveAttribute("width", "4096");
      expect(logo).toHaveAttribute("height", "996");
    });

    it("replaces the default size with a custom className", () => {
      render(<EkoruLogo enableRedirection={enableRedirection} className="h-10 w-40" />);

      const logo = getLogo();
      expect(logo).toHaveClass("h-10", "w-40");
      for (const cls of DEFAULT_SIZE) expect(logo).not.toHaveClass(cls);
    });

    it("loads eagerly, since it sits above the fold", () => {
      render(<EkoruLogo enableRedirection={enableRedirection} />);

      expect(getLogo()).not.toHaveAttribute("loading", "lazy");
    });
  });
});
