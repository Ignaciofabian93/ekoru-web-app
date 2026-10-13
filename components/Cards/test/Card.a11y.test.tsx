import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { Card } from "../Card";
import { FlipButton } from "../FlipButton";

function TestCard() {
  return (
    <Card
      href="/es/product/7"
      ariaLabel="Bicicleta urbana"
      actions={<button type="button">Editar</button>}
    >
      <Card.FrontSide>
        <p>Bicicleta urbana</p>
        <FlipButton label="Ver impacto" />
      </Card.FrontSide>
      <Card.BackSide>
        <p>Materiales</p>
        <FlipButton label="Volver" />
      </Card.BackSide>
    </Card>
  );
}

describe("Card accessibility", () => {
  it("has no violations on the front", async () => {
    const { container } = render(<TestCard />);

    expect((await axe(container)).violations).toEqual([]);
  });

  it("has no violations once turned over", async () => {
    const { container } = render(<TestCard />);
    await userEvent.click(screen.getByRole("button", { name: "Ver impacto" }));

    expect((await axe(container)).violations).toEqual([]);
  });
});
