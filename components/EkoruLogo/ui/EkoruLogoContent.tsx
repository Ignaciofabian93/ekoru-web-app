"use client";

import { EKORU_LOGO } from "@/constants/images";
import { useTranslation } from "@/i18n/context";
import Image from "next/image";

interface EkoruLogoProps {
  className?: string;
  width: number;
  height: number;
  onClick?: () => void;
}

export function EkoruLogoContent({ width, height, className, onClick }: EkoruLogoProps) {
  const { t } = useTranslation("ekoru_logo");

  return (
    <Image
      src={EKORU_LOGO}
      alt={t("alt")}
      aria-label={t("ariaLabel")}
      width={width}
      height={height}
      className={className}
      onClick={onClick}
      loading="eager"
    />
  );
}
