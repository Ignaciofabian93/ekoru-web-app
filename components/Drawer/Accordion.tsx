import { borderRadius, colors, fontFamily, fontSize } from "@/design/tokens";
import { ChevronDown, ChevronRight, type LucideIcon } from "lucide-react";
import React, { useState } from "react";

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
  const [hasEverOpened] = useState(false);

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
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBlock: 10,
          paddingLeft: 32,
          paddingRight: 14,
          backgroundColor: colors.backgroundTertiary,
          borderBottom: !isLast || isOpen ? `1px solid ${colors.borderStrong}` : "none",
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate(item.route)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
          }}
        >
          <span
            style={{
              fontSize: fontSize.xs,
              fontFamily: fontFamily.sans,
              fontWeight: 400,
              color: colors.foregroundSecondary,
            }}
          >
            {item.label}
          </span>
        </button>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 6px",
              display: "flex",
            }}
          >
            <div
              style={{
                transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
                transition: "transform 0.2s ease",
              }}
            >
              <ChevronRight size={13} color={colors.foregroundMuted} strokeWidth={2} />
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
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingBlock: 9,
                paddingLeft: 46,
                paddingRight: 14,
                backgroundColor: colors.surfaceActive,
                borderBottom:
                  i < item.children!.length - 1
                    ? `1px solid ${colors.borderStrong}`
                    : "none",
                width: "100%",
                border: "none",
                cursor: "pointer",
                textAlign: "left",
              }}
            >
              <span
                style={{
                  flex: 1,
                  fontSize: fontSize.xs,
                  fontFamily: fontFamily.sans,
                  fontWeight: 400,
                  color: colors.foregroundTertiary,
                }}
              >
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
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBlock: 11,
          paddingLeft: 18,
          paddingRight: 14,
          backgroundColor: colors.backgroundSecondary,
          borderBottom: !isLast || isOpen ? `1px solid ${colors.borderStrong}` : "none",
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate(item.route)}
          style={{
            flex: 1,
            background: "none",
            border: "none",
            cursor: "pointer",
            textAlign: "left",
            padding: 0,
          }}
        >
          <span
            style={{
              fontSize: fontSize.sm,
              fontFamily: fontFamily.sans,
              fontWeight: 500,
              color: colors.foregroundSecondary,
            }}
          >
            {item.label}
          </span>
        </button>
        {hasChildren && (
          <button
            type="button"
            onClick={() => setIsOpen((v) => !v)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "10px 6px",
              display: "flex",
            }}
          >
            <div
              style={{
                transform: `rotate(${isOpen ? "90deg" : "0deg"})`,
                transition: "transform 0.2s ease",
              }}
            >
              <ChevronRight size={14} color={colors.foregroundTertiary} strokeWidth={2} />
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
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          paddingBlock: 13,
          paddingInline: 14,
          gap: 12,
          borderBottom: `1px solid ${colors.borderStrong}`,
        }}
      >
        <button
          type="button"
          onClick={() => onNavigate(section.baseRoute)}
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            gap: 12,
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: 0,
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: borderRadius.sm,
              backgroundColor: `${colors.primary}18`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <Icon size={18} strokeWidth={1.5} color={colors.primary} />
          </div>
          <span
            style={{
              fontSize: fontSize.sm,
              fontFamily: fontFamily.sans,
              fontWeight: 500,
              color: colors.foreground,
            }}
          >
            {section.label}
          </span>
        </button>
        <button
          type="button"
          onClick={() => setIsOpen((v) => !v)}
          style={{
            background: "none",
            border: "none",
            cursor: "pointer",
            padding: "10px 6px",
            display: "flex",
          }}
        >
          <div
            style={{
              transform: `rotate(${isOpen ? "180deg" : "0deg"})`,
              transition: "transform 0.2s ease",
            }}
          >
            <ChevronDown size={16} color={colors.foregroundTertiary} strokeWidth={2} />
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
