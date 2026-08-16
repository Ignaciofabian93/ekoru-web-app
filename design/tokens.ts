/**
 * EKORU Design Tokens
 * ─────────────────────────────────────────────────────────────────
 * Single source of truth for all design values used in:
 *   • CSS / Tailwind v4   →  globals.css reads these via @theme
 *   • TypeScript          →  import { tokens } from "@/design/tokens"
 *
 * ─────────────────────────────────────────────────────────────────
 */

// ─── Color primitives ─────────────────────────────────────────────
const raw = {
  lime50: "#f7fee7",
  lime200: "#d9f99d",
  lime300: "#bef264",
  lime400: "#a3e635",
  lime500: "#84cc16",
  lime600: "#65a30d",
  lime700: "#4d7c0f",
  lime800: "#365314",

  cyan300: "#67e8f9",
  cyan400: "#22d3ee",
  cyan700: "#0e7490",

  amber400: "#fbbf24",
  amber500: "#f59e0b",

  red400: "#f87171",
  red500: "#ef4444",
  red600: "#dc2626",
  green500: "#22c55e",
  yellow500: "#eab308",
  blue500: "#3b82f6",

  gray50: "#f9fafb",
  gray100: "#f3f4f6",
  gray200: "#e5e7eb",
  gray300: "#d1d5db",
  gray400: "#9ca3af",
  gray600: "#4b5563",
  gray800: "#1f2937",

  violet200: "#ddd6fe",
  violet700: "#6d28d9",

  teal200: "#99f6e4",
  teal600: "#0d9488",

  emerald200: "#bbf7d0",
  emerald700: "#15803d",

  orange200: "#fed7aa",
  orange700: "#c2410c",

  blue200: "#bfdbfe",
  blue700: "#1d4ed8",

  rose200: "#fecdd3",
  rose700: "#be123c",

  white: "#fff",
} as const;

// ─── Color tokens (semantic) ──────────────────────────────────────
export const colors = {
  // Brand — primary (Lime)
  primary: raw.lime600,
  primaryHover: raw.lime400,
  primaryActive: raw.lime700,
  primaryDark: raw.lime800,
  primaryLight: raw.lime500,
  primaryLightBg: raw.lime50,
  navbar: raw.lime200,
  navbarHover: raw.lime300,
  navbarDark: raw.lime800,

  // Brand — secondary (Cyan)
  secondary: raw.cyan400,
  secondaryDark: raw.cyan700,
  secondaryHover: raw.cyan300,

  // Brand — accent (Amber)
  accent: raw.amber500,
  accentHover: raw.amber400,

  // Feedback
  danger: raw.red500,
  dangerHover: raw.red400,
  dangerDark: raw.red600,
  success: raw.green500,
  warning: raw.yellow500,
  info: raw.blue500,

  // Backgrounds
  background: "#fdfffc",
  backgroundSecondary: raw.gray50,
  backgroundTertiary: raw.gray100,

  // Surfaces
  surface: "#ffffff",
  surfaceHover: raw.gray50,
  surfaceActive: raw.gray100,

  // Foreground / Text
  foreground: raw.gray800,
  foregroundSecondary: raw.gray600,
  foregroundTertiary: raw.gray400,
  foregroundMuted: raw.gray300,
  onPrimary: "#ffffff",

  // Borders
  border: "#a8a8a8",
  borderLight: raw.gray100,
  borderStrong: raw.gray300,
  borderFocus: raw.lime500,

  // Nature — header gradient pairs
  naturePurpleLight: raw.violet200,
  naturePurpleDark: raw.violet700,
  natureTealLight: raw.teal200,
  natureTealDark: raw.teal600,
  natureSageLight: raw.emerald200,
  natureSageDark: raw.emerald700,
  natureCoralLight: raw.orange200,
  natureCoralDark: raw.orange700,
  natureOceanLight: raw.blue200,
  natureOceanDark: raw.blue700,
  natureRoseLight: raw.rose200,
  natureRoseDark: raw.rose700,

  // Inputs
  inputBg: "#ffffff",
  inputBorder: raw.gray300,
  inputBorderHover: raw.gray400,
  inputBorderFocus: raw.lime500,
  inputText: raw.gray800,
  inputPlaceholder: raw.gray400,
  inputDisabled: raw.gray100,

  white: raw.white,
} as const;

// ─── Gradients (nature palette, dark → light stops) ──────────────
// Used for hero/carousel slide backgrounds. White text goes on top,
// so every triple starts dark enough to keep contrast.
export type GradientStops = readonly [string, string, string];

export const gradients = {
  // Greens
  forest: [raw.lime800, "#2d6a0f", raw.lime600], // olive → lime
  pine: ["#052e16", "#166534", "#16a34a"], // darkest green → grass
  moss: ["#1a2e05", "#3f6212", raw.lime700], // near-black olive → moss
  meadow: ["#14532d", "#3f6212", raw.lime500], // pine → fresh lime
  // Teals / cyans
  ocean: [raw.cyan700, "#0c7b95", "#14b8a6"], // cyan → teal
  jungle: ["#134e4a", "#065f46", "#059669"], // dark teal → emerald
  lagoon: ["#042f2e", "#0f766e", "#2dd4bf"], // deep teal → aqua
  river: ["#164e63", "#155e75", "#0891b2"], // deep water cyans
} as const satisfies Record<string, GradientStops>;

// ─── Typography ───────────────────────────────────────────────────
export const fontFamily = {
  sans: "var(--font-cabin), sans-serif",
} as const;

export const fontSize = {
  xs: 11, // eyebrow labels, captions
  sm: 13, // secondary labels, tags
  base: 15, // body copy (default)
  lg: 17, // large body, list items
  xl: 20, // h4, card section heads
  "2xl": 24, // h3
  "3xl": 30, // hero titles
  "4xl": 36, // display
} as const;

export const lineHeight = {
  tight: 1.1,
  snug: 1.15,
  normal: 1.3,
  relaxed: 1.45,
  loose: 1.6,
} as const;

export const letterSpacing = {
  tight: -0.5, // display headings
  snug: -0.3,
  normal: 0,
  wide: 0.3, // label pills
  wider: 0.5, // type badges
  widest: 0.9, // EYEBROW LABELS (uppercase)
} as const;

// ─── Spacing (8-pt grid, values in px) ───────────────────────────
export const spacing = {
  0: 0,
  px: 1,
  0.5: 2,
  1: 4,
  1.5: 6,
  2: 8,
  2.5: 10,
  3: 12,
  3.5: 14,
  4: 16,
  5: 20,
  6: 24,
  7: 28,
  8: 32,
  9: 36,
  10: 40,
  11: 44,
  12: 48,
  14: 56,
  16: 64,
  20: 80,
  24: 96,
  28: 112,
  32: 128,
} as const;

// ─── Border radius (values in px) ────────────────────────────────
export const borderRadius = {
  none: 0,
  sm: 8, // sm buttons
  md: 10, // inputs, md/lg buttons
  lg: 12, // product cards
  xl: 14, // store cards, lg buttons
  "2xl": 18, // category cards, hero cards
  full: 9999,
} as const;

// ─── Shadows (CSS box-shadow) ─────────────────────────────────────
export const shadows = {
  none: "none",
  sm: "0 1px 4px rgba(0,0,0,0.08)",
  md: "0 2px 4px rgba(0,0,0,0.30)",
  lg: "0 4px 10px rgba(0,0,0,0.18)",
  xl: "0 8px 24px rgba(0,0,0,0.12)",
} as const;

// ─── Icon sizes (values in px) ────────────────────────────────────
export const iconSize = {
  xs: 14,
  sm: 16,
  md: 18,
  lg: 20,
  xl: 24,
  "2xl": 28,
  "3xl": 32,
} as const;

export const iconStroke = {
  default: 1.5,
  emphasis: 2.0,
  strong: 2.5,
} as const;

// ─── Animation ────────────────────────────────────────────────────
export const animation = {
  pressScale: 0.96,
  durationFast: 180,
  durationMed: 250,
  durationSlow: 350,
  easing: {
    standard: "cubic-bezier(0.4, 0, 0.2, 1)",
    decelerate: "cubic-bezier(0, 0, 0.2, 1)",
    accelerate: "cubic-bezier(0.4, 0, 1, 1)",
  },
} as const;

// ─── Z-index ─────────────────────────────────────────────────────
export const zIndex = {
  base: 0,
  raised: 1,
  dropdown: 10,
  sticky: 20,
  overlay: 30,
  modal: 40,
  toast: 50,
} as const;

// ─── Barrel export ────────────────────────────────────────────────
const tokens = {
  colors,
  gradients,
  fontFamily,
  fontSize,
  lineHeight,
  letterSpacing,
  spacing,
  borderRadius,
  shadows,
  iconSize,
  iconStroke,
  animation,
  zIndex,
} as const;

export default tokens;
