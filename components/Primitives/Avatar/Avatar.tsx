import clsx from "clsx";
import Image from "next/image";
import { EKORU_ICON } from "@/constants/images";
import { resolveImageUrl } from "@/utils/resolveImage";
import type { AvatarFrame, AvatarProps, AvatarSize } from "./types";

// `px` feeds next/image's intrinsic size so it serves a resolution that matches
// how large the avatar actually renders.
const SIZE: Record<AvatarSize, { box: string; px: number }> = {
  sm: { box: "size-10", px: 40 },
  md: { box: "size-14", px: 56 },
  lg: { box: "size-16", px: 64 },
  xl: { box: "size-36", px: 144 },
};

const FRAME: Record<AvatarFrame, string> = {
  overlay: "border-2 border-white/20 drop-shadow-lg",
  raised: "border-4 border-white bg-white shadow-md",
};

const INTERACTIVE_FRAME: Record<AvatarFrame, string> = {
  overlay: "hover:border-white/70 focus-visible:border-white focus-visible:ring-white/80",
  raised: "hover:border-white focus-visible:ring-primary",
};

export function Avatar({
  ref,
  image,
  alt,
  size = "sm",
  frame = "overlay",
  onClick,
  ariaLabel,
  ariaControls,
  ariaExpanded,
  ariaHasPopup,
  className,
}: AvatarProps) {
  const { box, px } = SIZE[size];
  const src = resolveImageUrl(image) ?? EKORU_ICON;

  const shell = clsx(
    "overflow-hidden rounded-full transition-colors duration-200 ease-in-out",
    FRAME[frame],
    box,
    className,
  );

  const picture = (
    <Image
      src={src}
      alt={alt}
      width={px}
      height={px}
      className={clsx("size-full object-cover", onClick && "hover:brightness-110")}
    />
  );

  // Without `onClick` there is nothing to activate, so it renders as plain
  // content rather than an empty button in the tab order.
  if (!onClick) {
    return <div className={shell}>{picture}</div>;
  }

  return (
    <button
      ref={ref}
      type="button"
      aria-label={ariaLabel}
      aria-controls={ariaControls}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHasPopup}
      onClick={onClick}
      className={clsx(
        shell,
        "cursor-pointer outline-none focus-visible:ring-2",
        INTERACTIVE_FRAME[frame],
      )}
    >
      {picture}
    </button>
  );
}
