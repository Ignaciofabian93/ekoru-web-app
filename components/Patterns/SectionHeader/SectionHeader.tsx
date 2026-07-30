import type { ReactNode } from "react";
import { RHYTHM, Stack } from "@/components/Layout";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";

export interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  /**
   * Trailing node pushed to the far edge — a "see all" link, usually. Only
   * meaningful with `align="start"`.
   */
  action?: ReactNode;
  /** `center` for full-width bands, `start` for card rails with an action. */
  align?: "start" | "center";
}

/**
 * The heading block a content section opens with. Replaces the old
 * `SectionTitleWrapper`, whose `align` / `justify` / `direction` props built
 * class names by interpolation (`items-${align}`) — Tailwind never generated
 * those, so every header silently rendered as a plain left-aligned row with the
 * subtitle beside the title instead of under it.
 */
export function SectionHeader({
  title,
  subtitle,
  action,
  align = "center",
}: SectionHeaderProps) {
  const isCentered = align === "center";

  const heading = (
    <Stack gap={RHYTHM.TEXT} align={isCentered ? "center" : "start"}>
      <Title level="h2" size="h4" weight="semibold" align={isCentered ? "center" : "left"}>
        {title}
      </Title>
      {subtitle && (
        <Text
          variant="p"
          size="base"
          color="secondary"
          align={isCentered ? "center" : "left"}
        >
          {subtitle}
        </Text>
      )}
    </Stack>
  );

  if (!action) return heading;

  return (
    <Stack direction="row" justify="between" align="start" gap={4}>
      {heading}
      {action}
    </Stack>
  );
}
