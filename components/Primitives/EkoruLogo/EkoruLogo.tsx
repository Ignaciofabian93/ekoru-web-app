"use client";
import Image from "next/image";
import Link from "next/link";
import { EKORU_LOGO } from "@/constants/images";
import { useLanguage } from "@/hooks/useLanguage";
import { ekoruLogoClass, ekoruLogoLinkClass } from "./styles";

/** Rendered width of the default `ekoruLogoClass` (`w-26`). */
const DEFAULT_SIZES = "104px";

interface EkoruLogoProps {
  label?: string;
  className?: string;
  /**
   * The logo's rendered width, for the browser to pick the file by. Pass it
   * along with a `className` that resizes the logo, e.g. `w-50` → "200px".
   */
  sizes?: string;
  enableRedirection?: boolean;
}

export function EkoruLogo({
  label = "EKORU",
  className,
  sizes = DEFAULT_SIZES,
  enableRedirection = true,
}: EkoruLogoProps) {
  const [language] = useLanguage();
  // width/height are the file's own (they reserve its aspect ratio); `sizes`
  // is what keeps the browser from fetching it at that size. Without it the
  // only candidate is the 3840px rendition (~90 KB) for a ~100px logo. Eager
  // rather than preloaded: it sits at the top of the page, so it's found at
  // once, and a high-priority preload would compete with the page's LCP image.
  const image = (
    <Image
      src={EKORU_LOGO}
      alt="EKORU"
      width={4096}
      height={996}
      sizes={sizes}
      loading="eager"
      className={className ?? ekoruLogoClass}
    />
  );

  if (!enableRedirection) return image;
  return (
    <Link href={`/${language}`} aria-label={label} className={ekoruLogoLinkClass}>
      {image}
    </Link>
  );
}
