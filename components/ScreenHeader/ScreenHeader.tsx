"use client";
import { Text } from "@/components/Text/Text";
import clsx from "clsx";
import { Settings, type LucideIcon } from "lucide-react";

interface ScreenHeaderProps {
  title: string;
  subtitle: string;
  icon?: LucideIcon;
  className?: string;
}

export default function ScreenHeader({
  title,
  subtitle,
  icon: Icon = Settings,
  className,
}: ScreenHeaderProps) {
  return (
    <div
      className={clsx(
        "w-full max-w-5xl mx-auto",
        "relative overflow-hidden flex flex-col gap-2",
        "pt-6 pb-11 px-5",
        "bg-linear-to-br from-nature-teal-dark via-nature-teal-dark to-nature-teal-light",
        className,
      )}
    >
      <div className="absolute rounded-full bg-white/7 w-55 h-55 -top-15 -right-12.5" />
      <div className="absolute rounded-full bg-white/7 w-30 h-30 -bottom-7.5 -left-7.5" />

      <div className="flex items-center gap-2 mb-1">
        <div className="w-9 h-9 rounded-md bg-white/18 flex items-center justify-center shrink-0">
          <Icon size={18} color="#fff" strokeWidth={1.5} />
        </div>
        <Text
          variant="label"
          weight="semibold"
          size="base"
          style={{ color: "rgba(255,255,255,0.75)" }}
        >
          {title}
        </Text>
      </div>

      <Text
        weight="bold"
        size="lg"
        style={{ color: "#fff", letterSpacing: -0.5, lineHeight: "32px" }}
      >
        {subtitle}
      </Text>
    </div>
  );
}
