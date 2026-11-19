"use client";
import clsx from "clsx";
import {
  Eye,
  MoreVertical,
  Pencil,
  PowerOff,
  Power,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import {
  DropdownItem,
  DropdownPanel,
  useDropdown,
  useRovingFocus,
} from "@/components/Overlays/Dropdown";

export interface ProductMenuAction {
  key: string;
  label: string;
  icon: LucideIcon;
  onSelect: () => void;
  tone?: "default" | "danger";
}

interface ProductActionsMenuProps {
  actions: ProductMenuAction[];
  ariaLabel: string;
}

export function ProductActionsMenu({ actions, ariaLabel }: ProductActionsMenuProps) {
  const { isOpen, close, toggle, containerRef, triggerRef } =
    useDropdown<HTMLButtonElement>();
  const { itemRef, handleKeyDown } = useRovingFocus(isOpen, actions.length, close);
  // A pen when the menu holds the edit action; plain dots otherwise (e.g. a sold listing).
  const editable = actions.some((action) => action.key === "edit");
  const TriggerIcon = editable ? Pencil : MoreVertical;

  return (
    <div ref={containerRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        onClick={(e) => {
          // The menu sits on top of a clickable card.
          e.preventDefault();
          e.stopPropagation();
          toggle();
        }}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={ariaLabel}
        className={clsx(
          "flex size-8 cursor-pointer items-center justify-center rounded-full shadow-sm transition",
          "outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
          editable
            ? "bg-primary-active text-on-primary hover:bg-primary-dark"
            : "bg-white/95 text-foreground hover:scale-105",
        )}
      >
        <TriggerIcon size={15} strokeWidth={editable ? 2.5 : 2} aria-hidden />
      </button>

      <DropdownPanel isOpen={isOpen} width="w-44" className="py-1">
        <div role="menu" aria-label={ariaLabel}>
          {actions.map((action, index) => (
            <DropdownItem
              key={action.key}
              ref={itemRef(index)}
              icon={action.icon}
              label={action.label}
              tone={action.tone}
              onSelect={() => {
                close();
                action.onSelect();
              }}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
        </div>
      </DropdownPanel>
    </div>
  );
}

// Re-export the most common icons so call-sites don't need to import them too.
export { Eye, Pencil, Power, PowerOff, Trash2 };
