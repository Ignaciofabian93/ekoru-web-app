"use client";
import type { ReactNode } from "react";
import { Title } from "@/components/Primitives/Title";

/**
 * One kind of thing near the visitor (marketplace items, stores…): a level-3
 * heading under the section's own, over its rail — a `ProductScroller` for
 * products, a `BusinessScroller` for stores and providers. With nothing nearby
 * the rail says so under its heading, so the rails keep their places as the
 * radius changes.
 */
export function NearbyRail({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-3">
      <Title level="h3" size="h5" weight="semibold">
        {title}
      </Title>
      {children}
    </div>
  );
}
