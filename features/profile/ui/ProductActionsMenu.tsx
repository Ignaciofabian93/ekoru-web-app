"use client";
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
        className="flex h-7 w-7 items-center justify-center rounded-full bg-white/95 text-foreground shadow-sm transition-transform hover:scale-105"
      >
        <MoreVertical size={14} color="currentColor" strokeWidth={2} aria-hidden />
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
