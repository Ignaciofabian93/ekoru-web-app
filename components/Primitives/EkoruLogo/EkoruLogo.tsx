"use client";
import Image from "next/image";
import Link from "next/link";
import { EKORU_LOGO } from "@/constants/images";
import { useLanguage } from "@/hooks/useLanguage";
import { ekoruLogoClass, ekoruLogoLinkClass } from "./styles";

interface EkoruLogoProps {
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
          className={className ?? ekoruLogoClass}
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
      className={className ?? ekoruLogoClass}
    />
  );
}
