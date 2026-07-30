"use client";
import { EKORU_LOGO } from "@/constants/images";
import { useLanguage } from "@/hooks/useLanguage";
import Image from "next/image";
import Link from "next/link";

interface EkoruLogoProps {
  /**
   * Accessible name of the home link. Pass a translated string — the wordmark
   * image is decorative, so this is the only name screen readers announce.
   */
  label?: string;
  className?: string;
  enableRedirection?: boolean;
}

export function EkoruLogo({
  label = "EKORU",
  className,
  enableRedirection = true,
}: EkoruLogoProps) {
  const [language] = useLanguage();
  if (enableRedirection) {
    return (
      <Link
        href={`/${language}`}
        aria-label={label}
        className="rounded-sm outline-none focus-visible:ring-2 focus-visible:ring-white/80"
      >
        <Image
          src={EKORU_LOGO}
          alt="EKORU"
          width={4096}
          height={996}
          priority
          className={className ?? "min-w-18 w-full max-w-24"}
        />
      </Link>
    );
  }
  return (
    <Image
      src={EKORU_LOGO}
      alt="EKORU"
      width={4096}
      height={996}
      priority
      className={className ?? "min-w-18 w-full max-w-24"}
    />
  );
}
