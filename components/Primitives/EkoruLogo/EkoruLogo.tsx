"use client";
import Image from "next/image";
import Link from "next/link";
import { EKORU_LOGO } from "@/constants/images";
import { ekoruLogoImageClass, ekoruLogoLinkClass } from "@/design/ekoruLogo";
import { useLanguage } from "@/hooks/useLanguage";

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
      <Link href={`/${language}`} aria-label={label} className={ekoruLogoLinkClass}>
        <Image
          src={EKORU_LOGO}
          alt="EKORU"
          width={4096}
          height={996}
          priority
          className={className ?? ekoruLogoImageClass}
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
      className={className ?? ekoruLogoImageClass}
    />
  );
}
