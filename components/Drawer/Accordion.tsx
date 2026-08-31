import clsx from "clsx";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import React, { useState } from "react";
import { Text } from "@/components/Primitives/Text";
import { drawerRowClass, drawerRowIconClass, drawerRowIconSize } from "@/design/drawer";

// ── Types ─────────────────────────────────────────────────────────────────────
export type L3Item = { label: string; route: string };
export type L2Item = { label: string; route: string; children?: L3Item[] };
export type L1Item = { label: string; route: string; children?: L2Item[] };

export type AccordionSectionDef = {
  key: string;
  label: string;
  icon: LucideIcon;
  baseRoute: string;
  items: L1Item[];
};

// ── AccordionContent ──────────────────────────────────────────────────────────
function AccordionContent({
  isOpen,
  children,
}: {
  isOpen: boolean;
  children: React.ReactNode;
}) {
  const [hasEverOpened, setHasEverOpened] = useState(false);

  // Latch open-state during render so content stays mounted after the first
  // open (cheap re-renders on toggle) while staying lazy until then.
  if (isOpen && !hasEverOpened) setHasEverOpened(true);

  if (!hasEverOpened || !isOpen) return null;
  return <div>{children}</div>;
}

// ── AccordionL2Row ────────────────────────────────────────────────────────────
function AccordionL2Row({
  item,
  isLast,
  onNavigate,
}: {
  item: L2Item;
  isLast: boolean;
  onNavigate: (route: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={clsx(
          "flex flex-row items-center bg-background-tertiary py-2.5 pr-3.5 pl-8",
          (!isLast || isOpen) && "border-b border-border-strong",
        )}
      >
        <button
          type="button"
          onClick={() => onNavigate(item.route)}
          className="flex-1 cursor-pointer p-0 text-left"
        >
          <span className="font-sans text-xs font-normal text-foreground-secondary">
            {item.label}
          </span>
        </button>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex cursor-pointer px-1.5 py-2.5"
          >
            <div
              className={clsx(
                "text-foreground-muted transition-transform duration-200",
                isOpen ? "rotate-90" : "rotate-0",
              )}
            >
              <ChevronRight size={13} color="currentColor" strokeWidth={2} />
            </div>
          </button>
        )}
      </div>

      {hasChildren && (
        <AccordionContent isOpen={isOpen}>
          {item.children!.map((l3, i) => (
            <button
              key={l3.route}
              type="button"
              onClick={() => onNavigate(l3.route)}
              className={clsx(
                "flex w-full cursor-pointer flex-row items-center bg-surface-active py-2.25 pr-3.5 pl-11.5 text-left",
                i < item.children!.length - 1 && "border-b border-border-strong",
              )}
            >
              <span className="flex-1 font-sans text-xs font-normal text-foreground-tertiary">
                {l3.label}
              </span>
            </button>
          ))}
        </AccordionContent>
      )}
    </div>
  );
}

// ── AccordionL1Row ────────────────────────────────────────────────────────────
function AccordionL1Row({
  item,
  isLast,
  onNavigate,
}: {
  item: L1Item;
  isLast: boolean;
  onNavigate: (route: string) => void;
}) {
  const hasChildren = !!item.children?.length;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div>
      <div
        className={clsx(
          "flex flex-row items-center bg-background-secondary py-2.75 pr-3.5 pl-4.5",
          (!isLast || isOpen) && "border-b border-border-strong",
        )}
      >
        <button
          type="button"
          onClick={() => onNavigate(item.route)}
          className="flex-1 cursor-pointer p-0 text-left"
        >
          <span className="font-sans text-sm font-medium text-foreground-secondary">
            {item.label}
          </span>
        </button>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            className="flex cursor-pointer px-1.5 py-2.5"
          >
            <div
              className={clsx(
                "text-foreground-tertiary transition-transform duration-200",
                isOpen ? "rotate-90" : "rotate-0",
              )}
            >
              <ChevronRight size={14} color="currentColor" strokeWidth={2} />
            </div>
          </button>
        )}
      </div>

      {hasChildren && (
        <AccordionContent isOpen={isOpen}>
          {item.children!.map((l2, i) => (
            <AccordionL2Row
              key={l2.route}
              item={l2}
              isLast={i === item.children!.length - 1}
              onNavigate={onNavigate}
            />
          ))}
        </AccordionContent>
      )}
    </div>
  );
}

// ── AccordionSection ──────────────────────────────────────────────────────────
function AccordionSection({
  section,
  onNavigate,
}: {
  section: AccordionSectionDef;
  onNavigate: (route: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const Icon = section.icon;

  return (
    <div>
      <div className="flex flex-row items-center border-b border-border-strong pr-3.5">
        {/* Same skin as MenuRow: the two sit in one list, so the section header
            has to carry the icon and label exactly the way a link does. */}
        <button
          type="button"
          onClick={() => onNavigate(section.baseRoute)}
          className={clsx(drawerRowClass, "flex-1 cursor-pointer hover:bg-surface-hover")}
        >
          <span className={drawerRowIconClass}>
            <Icon size={drawerRowIconSize} color="currentColor" strokeWidth={2} />
          </span>
          <Text variant="span" weight="medium" size="base" className="flex-1">
            {section.label}
          </Text>
        </button>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          className="flex cursor-pointer px-1.5 py-2.5"
        >
          <div
            className={clsx(
              "text-foreground-tertiary transition-transform duration-200",
              isOpen ? "rotate-180" : "rotate-0",
            )}
          >
            <ChevronDown size={16} color="currentColor" strokeWidth={2} />
          </div>
        </button>
      </div>

      <AccordionContent isOpen={isOpen}>
        {section.items.map((item, i) => (
          <AccordionL1Row
            key={item.route}
            item={item}
            isLast={i === section.items.length - 1}
            onNavigate={onNavigate}
          />
        ))}
      </AccordionContent>
    </div>
  );
}

// ── Compound export ───────────────────────────────────────────────────────────
export const Accordion = Object.assign(AccordionSection, {
  Content: AccordionContent,
  L1Row: AccordionL1Row,
  L2Row: AccordionL2Row,
});
