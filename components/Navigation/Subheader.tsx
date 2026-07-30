"use client";
import { Newspaper, Package, ScanBarcode, Store, UsersRound } from "lucide-react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "./i18n";
import type { SubHeaderLink } from "./types";

const SUBHEADER_LINKS: SubHeaderLink[] = [
  { key: "marketplace", path: "/marketplace", icon: Package },
  { key: "stores", path: "/stores", icon: Store },
  { key: "services", path: "/services", icon: ScanBarcode },
  { key: "community", path: "/community", icon: UsersRound },
  { key: "blog", path: "/blog", icon: Newspaper },
];

export default function SubHeader() {
  const pathname = usePathname();
  const [language] = useLanguage();
  const scrollRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { t } = useTranslation(NAMESPACE);

  // Routes live under `/[lang]`, so the locale prefix is what makes both the
  // link and the active-section check line up with the real pathname.
  const links = SUBHEADER_LINKS.map((item) => ({
    ...item,
    route: `/${language}${item.path}`,
    label: t(`sections.${item.key}`),
  }));

  const activeIndex = links.findIndex(
    (item) => pathname === item.route || pathname.startsWith(`${item.route}/`),
  );

  useEffect(() => {
    const activeEl = itemRefs.current[activeIndex];
    if (activeEl && scrollRef.current) {
      const container = scrollRef.current;
      const offset =
        activeEl.offsetLeft - (container.offsetWidth - activeEl.offsetWidth) / 2;
      container.scrollTo({ left: Math.max(0, offset), behavior: "smooth" });
    }
  }, [activeIndex]);

  return (
    <nav
      aria-label={t("a11y.sectionsNav")}
      className="w-full flex items-center justify-center bg-white shadow-md py-1"
    >
      <ul
        ref={scrollRef}
        className="flex flex-row items-center gap-3 px-3 overflow-x-auto scrollbar-none list-none"
      >
        {links.map((item, index) => {
          const isActive = index === activeIndex;
          const Icon = item.icon;
          const isLast = index === links.length - 1;

          return (
            <li key={item.key} className="shrink-0">
              <Link
                ref={(el) => {
                  itemRefs.current[index] = el;
                }}
                href={item.route}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  "flex flex-row items-center px-3 py-1.5 rounded-2xl border-0 cursor-pointer shrink-0",
                  "outline-none transition-opacity duration-100 ease-linear",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
                  isLast ? "mr-0" : "mr-1.5",
                  isActive ? "bg-primary" : "bg-white",
                )}
              >
                <span className="mr-1.25">
                  <Icon
                    size={16}
                    aria-hidden
                    className={
                      isActive ? "text-on-primary" : "text-foreground-secondary"
                    }
                    strokeWidth={2}
                  />
                </span>
                <span
                  className={clsx(
                    "text-sm font-sans whitespace-nowrap",
                    isActive
                      ? "font-semibold text-on-primary"
                      : "font-normal text-foreground-secondary",
                  )}
                >
                  {item.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
