"use client";

import { Package2, ScanBarcode, Store, TrendingUp, UsersRound } from "lucide-react";

const STATS = [
  { label: "Active Users", value: "1,234", Icon: UsersRound },
  { label: "Products Listed", value: "567", Icon: Package2 },
  { label: "Eco Stores", value: "89", Icon: Store },
  { label: "Eco Services", value: "45", Icon: ScanBarcode },
  { label: "Active Initiatives", value: "12", Icon: TrendingUp },
];

function StatItem({ label, value, Icon }: { label: string; value: string; Icon: React.ElementType }) {
  return (
    <div className="flex items-center gap-2 px-5 shrink-0">
      <Icon size={14} className="text-primary" strokeWidth={2} />
      <span className="text-base font-bold text-foreground">{value}</span>
      <span className="text-sm text-foreground-secondary">{label}</span>
      <span className="w-1.5 h-1.5 rounded-full bg-primary opacity-60 ml-2" />
    </div>
  );
}

export function StatsSection() {
  return (
    <div className="my-8">
      <h2 className="text-xl font-bold text-foreground text-center">This is already happening</h2>
      <p className="text-sm text-foreground-secondary text-center mt-1.5">
        An active community changing the way we consume.
      </p>

      <div className="relative mt-5 mb-3 overflow-hidden py-3.5">
        <div className="flex animate-marquee">
          {[...STATS, ...STATS].map((stat, i) => (
            <StatItem key={i} label={stat.label} value={stat.value} Icon={stat.Icon} />
          ))}
        </div>
        {/* Fade edges */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-12 bg-linear-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-12 bg-linear-to-l from-background to-transparent" />
      </div>

      <p className="text-xs text-foreground-tertiary text-center">
        Products, stores, and services already part of the circular economy.
      </p>
    </div>
  );
}
