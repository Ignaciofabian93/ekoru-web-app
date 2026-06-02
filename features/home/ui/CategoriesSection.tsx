"use client";

import { ArrowUpRight, Package2, ScanBarcode, Star, Store } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";

type CategoryId = "marketplace" | "stores" | "services";

interface TopItem {
  name: string;
  value: string;
}
interface Category {
  id: CategoryId;
  Icon: React.ElementType;
  href: string;
  gradient: string;
  tagKeys: string[];
  topItems: TopItem[];
}

// Structural config only — all copy lives in i18n (`categories.*`). The sample
// top-item names/values are representative placeholders shown until real
// featured data is wired in.
const CATEGORIES: Record<CategoryId, Category> = {
  marketplace: {
    id: "marketplace",
    Icon: Package2,
    href: "/marketplace",
    gradient: "from-green-800 via-green-700 to-primary",
    tagKeys: ["clothing", "bikes", "plants", "electronics"],
    topItems: [
      { name: "Recycled Wool Jacket", value: "$45" },
      { name: "Vintage City Bike", value: "$129" },
      { name: "Handmade Ceramic Set", value: "$18" },
    ],
  },
  stores: {
    id: "stores",
    Icon: Store,
    href: "/stores",
    gradient: "from-sky-700 to-sky-500",
    tagKeys: ["organic", "zeroWaste", "fairTrade"],
    topItems: [
      { name: "Verde Market", value: "⭐ 4.9" },
      { name: "EcoWear Boutique", value: "⭐ 4.8" },
      { name: "Green Roots", value: "⭐ 4.7" },
    ],
  },
  services: {
    id: "services",
    Icon: ScanBarcode,
    href: "/services",
    gradient: "from-amber-800 to-amber-500",
    tagKeys: ["repair", "rental", "swap", "upcycle"],
    topItems: [
      { name: "Bike Repair Workshop", value: "⭐ 4.9" },
      { name: "Clothing Alterations", value: "⭐ 4.8" },
      { name: "Tool Rental Hub", value: "⭐ 4.7" },
    ],
  },
};

const ORDER: CategoryId[] = ["marketplace", "stores", "services"];

export function CategoriesSection({ lang }: { lang: string }) {
  const { t } = useTranslation(NAMESPACE);
  const [active, setActive] = useState<CategoryId>("marketplace");
  const featured = CATEGORIES[active];
  const small = ORDER.filter((id) => id !== active).map((id) => CATEGORIES[id]);

  return (
    <div className="mt-4 mb-10">
      <h2 className="text-xl font-bold text-foreground text-center">
        {t("categories.title")}
      </h2>
      <p className="text-sm text-foreground-secondary text-center mt-1 mb-5">
        {t("categories.subtitle")}
      </p>

      <div className="flex flex-col gap-3">
        {/* Featured card */}
        <div
          className={`relative bg-linear-to-br ${featured.gradient} rounded-2xl overflow-hidden p-4 shadow-md`}
        >
          <div className="absolute w-55 h-55 rounded-full bg-white/10 -top-17.5 -right-17.5" />
          <div className="absolute w-32.5 h-32.5 rounded-full bg-white/10 -bottom-10 -left-10" />

          <div className="flex items-center justify-between mb-4">
            <div className="w-11 h-11 rounded-[13px] bg-white/20 flex items-center justify-center">
              <featured.Icon size={22} color="#fff" strokeWidth={1.5} />
            </div>
            <Link
              href={`/${lang}${featured.href}`}
              className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
            >
              <ArrowUpRight size={19} color="#fff" strokeWidth={2.5} />
            </Link>
          </div>

          <p className="text-[21px] font-bold text-white mb-1">
            {t(`categories.items.${featured.id}.title`)}
          </p>
          <p className="text-[13px] text-white/78 leading-4.75 mb-4">
            {t(`categories.items.${featured.id}.description`)}
          </p>

          <div className="flex flex-wrap gap-1.5 mb-4">
            {featured.tagKeys.map((tagKey) => (
              <span
                key={tagKey}
                className="bg-white/20 text-white text-xs font-medium px-3 py-1 rounded-full"
              >
                {t(`categories.tags.${tagKey}`)}
              </span>
            ))}
          </div>

          <div className="h-px bg-white/25 mb-4" />

          <div className="flex items-center gap-1 mb-2">
            <Star
              size={12}
              fill="rgba(255,255,255,0.7)"
              className="text-white/70"
              strokeWidth={0}
            />
            <span className="text-[11px] font-semibold text-white/65 uppercase tracking-wide">
              {t("categories.topPicks")}
            </span>
          </div>
          {featured.topItems.map((item, i) => (
            <div
              key={item.name}
              className={`flex justify-between items-center py-2 ${i < featured.topItems.length - 1 ? "border-b border-white/20" : ""}`}
            >
              <span className="text-sm font-medium text-white flex-1 mr-2 truncate">
                {item.name}
              </span>
              <span className="text-sm font-bold text-white/90">{item.value}</span>
            </div>
          ))}
        </div>

        {/* Small cards */}
        <div className="grid grid-cols-2 gap-3">
          {small.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActive(cat.id)}
              className={`relative bg-linear-to-br ${cat.gradient} rounded-2xl overflow-hidden p-4 shadow-md text-left min-h-37 flex flex-col justify-between hover:opacity-90 transition-opacity`}
            >
              <div className="absolute w-35 h-35 rounded-full bg-white/10 -top-12 -right-9.5" />
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-[11px] bg-white/20 flex items-center justify-center">
                  <cat.Icon size={18} color="#fff" strokeWidth={1.5} />
                </div>
                <Link
                  href={`/${lang}${cat.href}`}
                  onClick={(e) => e.stopPropagation()}
                  className="w-8 h-8 rounded-md bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                >
                  <ArrowUpRight size={15} color="#fff" strokeWidth={2.5} />
                </Link>
              </div>
              <div>
                <p className="text-[17px] font-bold text-white mb-0.5">
                  {t(`categories.items.${cat.id}.title`)}
                </p>
                <p className="text-[13px] font-medium text-white/72">
                  {t(`categories.items.${cat.id}.meta`)}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
