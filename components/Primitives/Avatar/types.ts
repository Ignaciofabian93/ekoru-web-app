import type { Ref } from "react";

export type AvatarSize = "sm" | "md" | "lg" | "xl";

/**
 * `overlay` sits on a dark or photographic surface (the nav bar); `raised`
 * sits on content and reads as a card (the profile header).
 */
export type AvatarFrame = "overlay" | "raised";

export interface AvatarProps {
  image?: string | null;
  /**
   * Ref to the underlying button — used to restore focus after a menu closes.
   * Only applies when `onClick` is given; without it there is no button.
   */
  ref?: Ref<HTMLButtonElement>;
  /**
   * Image alt text. Leave empty when `ariaLabel` already names the control, so
   * screen readers don't announce the same thing twice.
   */
  alt: string;
  size?: AvatarSize;
  frame?: AvatarFrame;
  /** Omit to render a plain, non-interactive avatar instead of a button. */
  onClick?: () => void;
  /** Accessible name of the button — required whenever `alt` is empty. */
  ariaLabel?: string;
  /** Id of the element the button controls (e.g. the dropdown it opens). */
  ariaControls?: string;
  /** Open/closed state when the button toggles a menu or dialog. */
  ariaExpanded?: boolean;
  /** Kind of popup the button opens, mirroring `aria-haspopup`. */
  ariaHasPopup?: "menu" | "listbox" | "dialog" | "true";
  className?: string;
}
