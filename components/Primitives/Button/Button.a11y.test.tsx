import { render } from "@testing-library/react";
import { Heart } from "lucide-react";
import { describe, expect, it } from "vitest";
import { axe } from "@/test/axe";
import { Button } from "./Button";
import type { ButtonVariant } from "./Button.types";

const VARIANTS: ButtonVariant[] = [
  "primary",
  "secondary",
  "outline",
  "ghost",
  "success",
  "warning",
  "error",
];

// axe in jsdom checks structure and names, not colour contrast (no layout).
describe("Button accessibility", () => {
  it.each(VARIANTS)("the %s variant has no violations", async (variant) => {
    const { container } = render(<Button text="Guardar" variant={variant} />);

    expect((await axe(container)).violations).toEqual([]);
  });

  it("has no violations while loading, disabled, toggled or with icons", async () => {
    const { container } = render(
      <div>
        <Button text="Guardar" loading loadingText="Guardando…" />
        <Button text="Guardar" disabled />
        <Button text="Seguir" ariaPressed={false} />
        <Button text="Me gusta" leftIcon={Heart} />
      </div>,
    );

    expect((await axe(container)).violations).toEqual([]);
  });
});
