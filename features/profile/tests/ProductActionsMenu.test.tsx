import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { axe } from "@/test/axe";
import { Eye, Pencil, ProductActionsMenu, Trash2 } from "../ui/ProductActionsMenu";

const view = { key: "view", label: "View", icon: Eye, onSelect: vi.fn() };
const remove = { key: "delete", label: "Delete", icon: Trash2, onSelect: vi.fn() };

describe("ProductActionsMenu", () => {
  it("shows a pen when the listing can be edited, and edits from the menu", async () => {
    const user = userEvent.setup();
    const onEdit = vi.fn();
    const { container } = render(
      <ProductActionsMenu
        ariaLabel="Edit or manage listing"
        actions={[view, { key: "edit", label: "Quick edit", icon: Pencil, onSelect: onEdit }, remove]}
      />,
    );
    const trigger = screen.getByRole("button", { name: "Edit or manage listing" });

    expect(trigger.querySelector(".lucide-pencil")).not.toBeNull();
    expect((await axe(container)).violations).toEqual([]);

    await user.click(trigger);
    await user.click(screen.getByRole("menuitem", { name: "Quick edit" }));
    expect(onEdit).toHaveBeenCalledTimes(1);
  });

  it("keeps the dots when there is nothing to edit", () => {
    render(<ProductActionsMenu ariaLabel="Product actions" actions={[view, remove]} />);
    const trigger = screen.getByRole("button", { name: "Product actions" });

    expect(trigger.querySelector(".lucide-pencil")).toBeNull();
    expect(trigger.querySelector(".lucide-ellipsis-vertical")).not.toBeNull();
  });
});
