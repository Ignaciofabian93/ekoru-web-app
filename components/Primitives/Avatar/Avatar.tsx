import clsx from "clsx";
import Image from "next/image";
import { EKORU_ICON } from "@/constants/images";
import {
  avatarClass,
  avatarImageClass,
  avatarImageInteractiveClass,
  avatarInteractiveClass,
  avatarInteractiveFrameClass,
  avatarPixelSize,
} from "@/design/avatar";
import { resolveImageUrl } from "@/utils/resolveImage";
import type { AvatarProps } from "./types";

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
  const src = resolveImageUrl(image) ?? EKORU_ICON;
  const shell = clsx(avatarClass[frame][size], className);

  const picture = (
    <Image
      src={src}
      alt={alt}
      width={avatarPixelSize[size]}
      height={avatarPixelSize[size]}
      className={clsx(avatarImageClass, onClick && avatarImageInteractiveClass)}
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
      className={clsx(shell, avatarInteractiveClass, avatarInteractiveFrameClass[frame])}
    >
      {picture}
    </button>
  );
}
