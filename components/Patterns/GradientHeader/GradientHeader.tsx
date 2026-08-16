"use client";

import clsx from "clsx";
import { type LucideIcon, Settings } from "lucide-react";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  gradientHeaderClass,
  gradientHeaderDecorBottomClass,
  gradientHeaderDecorTopClass,
  gradientHeaderEyebrowClass,
  gradientHeaderIconChipClass,
  gradientHeaderIconSize,
} from "@/design/gradient-header";

export interface GradientHeaderProps {
  /** Eyebrow line rendered beside the icon. */
  title: string;
  /** The heading itself. */
  subtitle: string;
  icon?: LucideIcon;
  className?: string;
}

export function GradientHeader({
  title,
  subtitle,
  icon: Icon = Settings,
  className,
}: GradientHeaderProps) {
  return (
    <div className={clsx(gradientHeaderClass, className)}>
      <div aria-hidden className={gradientHeaderDecorTopClass} />
      <div aria-hidden className={gradientHeaderDecorBottomClass} />

      <div className={gradientHeaderEyebrowClass}>
        <div className={gradientHeaderIconChipClass}>
          <Icon
            size={gradientHeaderIconSize}
            color="#fff"
            strokeWidth={1.5}
            aria-hidden
          />
        </div>
        <Text variant="label" weight="semibold" size="base" color="white">
          {title}
        </Text>
      </div>

      <Title level="h3" size="h3" weight="bold" color="white">
        {subtitle}
      </Title>
    </div>
  );
}
