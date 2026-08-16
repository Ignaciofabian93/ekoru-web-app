/**
 *
 * Usage:  className={avatarClass[frame][size]}
 * ─────────────────────────────────────────────────────────────────
 */

import type { AvatarFrame, AvatarSize } from "@/components/Primitives/Avatar/types";
import { cross } from "@/design/variants";

const avatarBaseClass =
  "overflow-hidden rounded-full transition-colors duration-200 ease-in-out";

const avatarSizeClass: Record<AvatarSize, string> = {
  sm: "size-10",
  md: "size-14",
  lg: "size-16",
  // Sized to match the seller hero's avatar.
  xl: "size-28",
};

const avatarFrameClass: Record<AvatarFrame, string> = {
  overlay: "border-2 border-white/20 drop-shadow-lg",
  raised: "border-2 border-white/20 bg-white shadow-md",
};

/** Shell for every frame × size pair: `avatarClass[frame][size]`. */
export const avatarClass = cross(avatarBaseClass, avatarFrameClass, avatarSizeClass);

/** Added on top of the shell when the avatar is a button. */
export const avatarInteractiveClass = "cursor-pointer outline-none focus-visible:ring-2";

export const avatarInteractiveFrameClass: Record<AvatarFrame, string> = {
  overlay: "hover:border-white/70 focus-visible:border-white focus-visible:ring-white/80",
  raised: "hover:border-white focus-visible:ring-primary",
};

export const avatarImageClass = "size-full object-cover";

export const avatarImageInteractiveClass = "hover:brightness-110";

/**
 * Feeds next/image's intrinsic size so it serves a resolution matching how large
 * the avatar actually renders. `xl` is 2× its box — the one size rendered large
 * enough for retina softness to show.
 */
export const avatarPixelSize: Record<AvatarSize, number> = {
  sm: 40,
  md: 56,
  lg: 64,
  xl: 224,
};
