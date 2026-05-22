import clsx from "clsx";
import type { LucideIcon } from "lucide-react";
import React from "react";

export default function MenuRow({
  icon: Icon,
  label,
  onPress,
  hasBorder,
}: {
  icon: LucideIcon;
  label: string;
  onPress: () => void;
  hasBorder: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onPress}
      className={clsx(
        "flex w-full cursor-pointer flex-row items-center gap-3 px-3.5 py-3.25 text-left",
        hasBorder && "border-b border-border-strong",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary/10 text-primary">
        <Icon size={18} strokeWidth={1.5} color="currentColor" />
      </div>
      <span className="font-sans text-sm font-medium text-foreground">{label}</span>
    </button>
  );
}
