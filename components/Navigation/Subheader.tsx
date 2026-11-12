"use client";
import {
  ChevronDown,
  Newspaper,
  Package,
  ScanBarcode,
  Store,
  UsersRound,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import { useDropdown } from "@/components/Overlays/Dropdown";
import { useLanguage } from "@/hooks/useLanguage";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE, type NavigationSection } from "./i18n";
import { MegaMenuPanel } from "./MegaMenu";
import { useMegaMenuCatalog } from "./hooks/useMegaMenuCatalog";
import type { SubHeaderLink } from "./types";

const SUBHEADER_LINKS: SubHeaderLink[] = [
  { key: "marketplace", path: "/marketplace", icon: Package },
  { key: "stores", path: "/stores", icon: Store },
  { key: "services", path: "/services", icon: ScanBarcode },
  { key: "community", path: "/community", icon: UsersRound },
  { key: "blog", path: "/blog", icon: Newspaper },
];

const pillClass = (isActive: boolean, isExpanded: boolean, isLast: boolean) =>
  clsx(
    "flex-row items-center px-3 py-1.5 rounded-2xl border-0 cursor-pointer shrink-0",
    "outline-none transition-colors duration-100 ease-linear",
    "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-1",
    isLast ? "mr-0" : "mr-1.5",
    isActive
      ? "bg-secondary/10 hover:bg-secondary/20"
      : isExpanded
        ? "bg-secondary/10 hover:bg-secondary/20"
        : "bg-white hover:bg-background-tertiary",
  );

const pillTextClass = (isActive: boolean, isExpanded: boolean) =>
  isActive
    ? "text-secondary-dark"
    : isExpanded
      ? "text-secondary-dark"
      : "text-foreground-secondary";

function PillContent({
  icon: Icon,
  label,
  isActive,
  isExpanded = false,
}: {
  icon: LucideIcon;
  label: string;
  isActive: boolean;
  isExpanded?: boolean;
}) {
  const tone = pillTextClass(isActive, isExpanded);
  return (
    <>
      <span className="mr-1.25">
        <Icon size={16} aria-hidden className={tone} strokeWidth={2} />
      </span>
      <span
        className={clsx(
          "text-sm font-sans whitespace-nowrap",
          isActive || isExpanded ? "font-semibold" : "font-normal",
          tone,
        )}
      >
        {label}
      </span>
    </>
  );
}

/**
 * The row of site sections under the navbar.
 *
 * Below `md` each pill is a plain link — the drawer's accordions carry the
 * catalog trees there. From `md` up each pill is a disclosure button instead:
 * clicking it opens that section's megamenu, and the panel's "See all" link
 * takes over the pill's old job of reaching the section's landing page.
 *
 * `trailing` sits at the row's far end (below the pills under `lg`). It
 * is kept outside the `<nav>`, so the megamenu treats it as outside the menu:
 * clicking or tabbing into it closes an open panel.
 */
export default function SubHeader({ trailing }: { trailing?: React.ReactNode }) {
  const pathname = usePathname();
  const [language] = useLanguage();
  const scrollRef = useRef<HTMLUListElement>(null);
  const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
  const { t } = useTranslation(NAMESPACE);
  const menuId = useId();

  // Outside click, Escape (focus back to the pill) and focus leaving the row
  // all close the megamenu; `openKey` only says which section is showing.
  const { isOpen, setIsOpen, close, containerRef, triggerRef } =
    useDropdown<HTMLButtonElement>();
  const [openKey, setOpenKey] = useState<NavigationSection | null>(null);
  const expandedKey = isOpen ? openKey : null;

  // Sections whose catalog may be fetched. A section joins on first hover or
  // focus of its pill, so the tree is usually loaded by the time it's clicked.
  const [requested, setRequested] = useState<ReadonlySet<NavigationSection>>(
    () => new Set(),
  );
  const catalogs = useMegaMenuCatalog(requested);

  const request = (key: NavigationSection) => {
    if (requested.has(key)) return;
    setRequested((prev) => new Set(prev).add(key));
  };

  const toggleSection = (key: NavigationSection, trigger: HTMLButtonElement) => {
    triggerRef.current = trigger;
    request(key);
    if (expandedKey === key) {
      close();
      return;
    }
    setOpenKey(key);
    setIsOpen(true);
  };

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
    <div className="w-full bg-white py-2">
      <div className="mx-auto flex w-full max-w-6xl flex-col md:px-1 lg:flex-row lg:items-center lg:justify-between lg:gap-6">
        <nav
          ref={containerRef}
          aria-label={t("a11y.sectionsNav")}
          className="min-w-0 lg:shrink-0 mb-0 md:mb-2 lg:mb-0"
        >
          {/* Scrolls sideways on small screens; from `md` it must not clip, or the
          dropdown hanging off each pill gets cut off. */}
          <ul
            ref={scrollRef}
            className="flex flex-row items-center gap-3 px-3 md:px-0 overflow-x-auto md:overflow-visible scrollbar-none list-none"
          >
            {links.map((item, index) => {
              const isActive = index === activeIndex;
              const isExpanded = expandedKey === item.key;
              const isLast = index === links.length - 1;
              const panelId = `${menuId}-${item.key}`;

              return (
                <li key={item.key} className="shrink-0 md:relative">
                  <Link
                    ref={(el) => {
                      itemRefs.current[index] = el;
                    }}
                    href={item.route}
                    aria-current={isActive ? "page" : undefined}
                    className={clsx(pillClass(isActive, false, isLast), "flex md:hidden")}
                  >
                    <PillContent
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive}
                    />
                  </Link>

                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    aria-controls={isExpanded ? panelId : undefined}
                    aria-current={isActive ? "page" : undefined}
                    onClick={(e) => toggleSection(item.key, e.currentTarget)}
                    onPointerEnter={() => request(item.key)}
                    onFocus={() => request(item.key)}
                    className={clsx(
                      pillClass(isActive, isExpanded, isLast),
                      "hidden md:flex",
                    )}
                  >
                    <PillContent
                      icon={item.icon}
                      label={item.label}
                      isActive={isActive}
                      isExpanded={isExpanded}
                    />
                    <ChevronDown
                      size={14}
                      aria-hidden
                      strokeWidth={2}
                      className={clsx(
                        "ml-1 transition-transform duration-200",
                        isExpanded && "rotate-180",
                        pillTextClass(isActive, isExpanded),
                      )}
                    />
                  </button>

                  {/* Right after its trigger, so Tab moves from the pill into the
                  panel (disclosure navigation pattern). */}
                  {isExpanded && (
                    <MegaMenuPanel
                      id={panelId}
                      label={item.label}
                      href={item.route}
                      lang={language}
                      tree={catalogs[item.key]}
                      onNavigate={close}
                    />
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        {trailing}
      </div>
    </div>
  );
}
