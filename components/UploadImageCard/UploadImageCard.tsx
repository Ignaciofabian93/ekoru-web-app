"use client";

import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import { Text } from "../Text/Text";

export default function UploadImageCard({
  onPress,
  title,
  description,
  icon: Icon,
  iconColor,
  disabled = false,
}: {
  onPress: () => void;
  title: string;
  description: string;
  icon: LucideIcon;
  iconStyle?: object;
  iconColor: string;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      disabled={disabled}
      className="flex flex-1 cursor-pointer items-center justify-center p-0 disabled:cursor-not-allowed"
    >
      <div
        // borderColor is derived from the runtime `iconColor` prop, so it stays inline.
        style={{ borderColor: `${iconColor}33` }}
        className={clsx(
          "flex w-full flex-col items-center justify-center gap-1.5 rounded-xl border-[1.5px] border-solid bg-surface px-3 py-5",
          disabled ? "opacity-40 grayscale" : "shadow-[0_2px_8px_rgba(0,0,0,0.08)]",
        )}
      >
        <Icon size={40} color={iconColor} strokeWidth={1.75} />
        <Text size="sm" weight="semibold" align="center">
          {title}
        </Text>
        <Text size="xs" color="secondary" align="center">
          {description}
        </Text>
      </div>
    </button>
  );
}
