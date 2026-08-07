"use client";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import type { LucideIcon } from "lucide-react";
import Link from "next/link";

interface AboutFeatureCardProps {
  href: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

/**
 * A card describing one capability, linking to where it lives. Every card is a
 * link on purpose — this page is reached from the drawer, so its job is to
 * explain the platform *and* hand the reader a way into it.
 */
export function AboutFeatureCard({
  href,
  icon: Icon,
  title,
  description,
}: AboutFeatureCardProps) {
  return (
    <Link
      href={href}
      className="flex flex-col gap-3 rounded-xl border border-border-light bg-surface p-5 transition-colors hover:border-primary focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-none"
    >
      <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon size={20} color="currentColor" strokeWidth={2} aria-hidden />
      </div>
      <Title level="h3" size="h6" weight="semibold">
        {title}
      </Title>
      <Text variant="p" size="sm" color="secondary">
        {description}
      </Text>
    </Link>
  );
}
