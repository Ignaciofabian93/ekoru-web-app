import { spacing } from "@/design/tokens";

/**
 * Shared vocabulary for the layout system. Every gap, width and alignment the
 * layout components accept is declared here, so `Page`, `Container`, `Section`,
 * `Stack` and `Grid` can never drift apart on spacing.
 *
 * Gaps are applied as inline styles from the 8pt scale in `design/tokens.ts` —
 * never as `gap-${n}` template literals, which Tailwind cannot compile.
 */
export type Gap = Exclude<keyof typeof spacing, "px">;

/**
 * Skip-link target. Lives here rather than in `Page` so the navbar can point at
 * it without importing the shell that renders the navbar.
 */
export const MAIN_CONTENT_ID = "main-content";

export type Breakpoint = "sm" | "md" | "lg" | "xl";

export type Align = "start" | "center" | "end" | "baseline" | "stretch";

export type Justify = "start" | "center" | "end" | "between" | "around" | "evenly";

/**
 * The three page widths every screen re-pins to (plus `full` for full-bleed
 * bodies that manage their own width).
 */
export type Width = "narrow" | "default" | "wide" | "full";

export const MAX_WIDTH: Record<Width, string> = {
  narrow: "max-w-4xl", // forms, auth, profile
  default: "max-w-6xl", // catalogs, listings, home
  wide: "max-w-7xl", // seller storefront
  full: "max-w-none",
};

export const ALIGN_CLASS: Record<Align, string> = {
  start: "items-start",
  center: "items-center",
  end: "items-end",
  baseline: "items-baseline",
  stretch: "items-stretch",
};

export const JUSTIFY_CLASS: Record<Justify, string> = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
  around: "justify-around",
  evenly: "justify-evenly",
};

/** Column below the breakpoint, row at and above it. */
export const STACK_BELOW_CLASS: Record<Breakpoint, string> = {
  sm: "flex-col sm:flex-row",
  md: "flex-col md:flex-row",
  lg: "flex-col lg:flex-row",
  xl: "flex-col xl:flex-row",
};

/**
 * The vertical rhythm, in one place:
 * between sections (`SECTION`) › inside a section (`CONTENT`) › between a
 * heading and its subtitle (`TEXT`).
 */
export const RHYTHM = {
  /** Gap between sections of a page body. */
  SECTION: 12,
  /** Gap between a section header and its content. */
  CONTENT: 6,
  /** Gap between tightly related lines of text. */
  TEXT: 2,
} as const satisfies Record<string, Gap>;

export { spacing };
