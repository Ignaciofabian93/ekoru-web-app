import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Heart } from "lucide-react";
import { describe, expect, it, vi } from "vitest";
import { Button } from "./Button";

describe("Button", () => {
  it("renders its label as a plain button by default", () => {
    render(<Button text="Guardar" />);

    const button = screen.getByRole("button", { name: "Guardar" });
    expect(button).toHaveAttribute("type", "button");
    expect(button).toBeEnabled();
  });

  it("calls both onClick and onPress", async () => {
    const onClick = vi.fn();
    const onPress = vi.fn();
    render(<Button text="Guardar" onClick={onClick} onPress={onPress} />);

    await userEvent.click(screen.getByRole("button"));

    expect(onClick).toHaveBeenCalledTimes(1);
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("does nothing while disabled", async () => {
    const onPress = vi.fn();
    render(<Button text="Guardar" disabled onPress={onPress} />);

    await userEvent.click(screen.getByRole("button"));

    expect(screen.getByRole("button")).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("is disabled and shows its loading text while loading", async () => {
    const onPress = vi.fn();
    render(<Button text="Guardar" loading loadingText="Guardando…" onPress={onPress} />);

    const button = screen.getByRole("button", { name: "Guardando…" });
    await userEvent.click(button);

    expect(button).toBeDisabled();
    expect(onPress).not.toHaveBeenCalled();
  });

  it("keeps its label while loading without a loading text", () => {
    render(<Button text="Guardar" loading />);

    expect(screen.getByRole("button", { name: "Guardar" })).toBeDisabled();
  });

  it("reports a toggle's state with aria-pressed", () => {
    const { rerender } = render(<Button text="Seguir" ariaPressed={false} />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "false");

    rerender(<Button text="Siguiendo" ariaPressed />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-pressed", "true");
  });

  it("submits a form when asked to", () => {
    render(<Button text="Enviar" type="submit" />);

    expect(screen.getByRole("button")).toHaveAttribute("type", "submit");
  });

  it("renders icons on either side of the label", () => {
    const { container } = render(
      <Button
        text="Me gusta"
        leftIcon={Heart}
        rightIcon={<span data-testid="right" />}
      />,
    );

    expect(container.querySelector("svg")).not.toBeNull();
    expect(screen.getByTestId("right")).toBeInTheDocument();
  });
});
