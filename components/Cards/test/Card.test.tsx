import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Card } from "../Card";
import { FlipButton } from "../FlipButton";
import { getInitials } from "../utils/initials";

function TestCard({ actions }: { actions?: React.ReactNode }) {
  return (
    <Card href="/es/product/7" ariaLabel="Bicicleta urbana" actions={actions}>
      <Card.FrontSide>
        <p>Frente</p>
        <FlipButton label="Ver impacto" />
      </Card.FrontSide>
      <Card.BackSide>
        <p>Reverso</p>
        <FlipButton label="Volver" />
      </Card.BackSide>
    </Card>
  );
}

/** The face (`div[inert]` or not) that holds a piece of text. */
const faceOf = (text: string) => screen.getByText(text).closest(".card-face");

describe("Card", () => {
  it("links the front face to the item, named for screen readers", () => {
    render(<TestCard />);

    const link = screen.getByRole("link", { name: "Bicicleta urbana" });
    expect(link).toHaveAttribute("href", "/es/product/7");
  });

  it("starts on the front, with the back out of reach", () => {
    render(<TestCard />);

    expect(faceOf("Frente")).not.toHaveAttribute("inert");
    expect(faceOf("Reverso")).toHaveAttribute("inert");
  });

  it("turns over and back with the flip buttons", async () => {
    render(<TestCard />);

    await userEvent.click(screen.getByRole("button", { name: "Ver impacto" }));
    expect(faceOf("Frente")).toHaveAttribute("inert");
    expect(faceOf("Reverso")).not.toHaveAttribute("inert");

    await userEvent.click(screen.getByRole("button", { name: "Volver" }));
    expect(faceOf("Frente")).not.toHaveAttribute("inert");
    expect(faceOf("Reverso")).toHaveAttribute("inert");
  });

  it("takes the owner controls out of reach while turned over", async () => {
    render(<TestCard actions={<button type="button">Editar</button>} />);

    expect(screen.getByText("Editar").closest("[inert]")).toBeNull();

    await userEvent.click(screen.getByRole("button", { name: "Ver impacto" }));
    expect(screen.getByText("Editar").closest("[inert]")).not.toBeNull();
  });

  it("refuses a card slot rendered outside a card", () => {
    // React logs the thrown error before rethrowing it; keep the output clean.
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => render(<FlipButton label="Girar" />)).toThrow(/within <Card>/);
    spy.mockRestore();
  });
});

describe("getInitials", () => {
  it("takes the first letter of the first two words", () => {
    expect(getInitials("Verde Market Chile")).toBe("VM");
    expect(getInitials("  eco  ")).toBe("E");
  });

  it("is empty without a name", () => {
    expect(getInitials(null)).toBe("");
    expect(getInitials("")).toBe("");
  });
});
