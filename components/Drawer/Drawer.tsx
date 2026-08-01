"use client";

import {
  BookOpen,
  Handshake,
  House,
  Leaf,
  Mail,
  MessageSquare,
  Package,
  PackagePlus,
  ScanBarcode,
  Settings,
  Store,
  User,
  X,
} from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import clsx from "clsx";

import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useDrawer } from "@/context/DrawerContext";
import { useTranslation } from "@/i18n/context";
import useAuthStore, {
  useDisplayName,
  useInitials,
  useProfileImage,
} from "@/store/useAuthStore";
import { NAMESPACE } from "./i18n";
import { DRAWER_PANEL_ID } from "./constants/data";
import { useDrawerMarketplace } from "./hooks/useDrawerMarketplace";

import { Button } from "@/components/Primitives/Button";
import { Title } from "@/components/Primitives/Title";
import { Accordion, type AccordionSectionDef } from "./Accordion";
import MenuRow from "./MenuRow";
import { useDrawerBlogs } from "./hooks/useDrawerBlogs";
import { useDrawerCommunity } from "./hooks/useDrawerCommunity";
import { useDrawerServices } from "./hooks/useDrawerServices";
import { useDrawerStores } from "./hooks/useDrawerStores";
import { useDealsBadge } from "@/features/deals/hooks/useDealsBadge";
import Image from "next/image";

// Every one of these needs a signed-in seller, so the whole section is gated on
// auth rather than each row. Order mirrors the avatar dropdown, where Deals also
// sits directly under the profile entry.
const profileMenuItems = [
  { route: "/profile", tKey: "profile", icon: User },
  { route: "/deals", tKey: "deals", icon: Handshake },
  { route: "/profile/settings", tKey: "settings", icon: Settings },
  { route: "/profile/orders", tKey: "orders", icon: Package },
  { route: "/profile/environmental-impact", tKey: "environmentalImpact", icon: Leaf },
];

const supportMenuItems = [{ route: "/contact", tKey: "contact", icon: Mail }];

function SectionLabel({ label }: { label: string }) {
  return (
    <Title level="h6" weight="semibold" className="mt-2 ml-1">
      {label}
    </Title>
  );
}

export default function Drawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const params = useParams();
  const lang = typeof params?.lang === "string" ? params.lang : DEFAULT_LANGUAGE;
  const { t } = useTranslation(NAMESPACE);
  const profileImage = useProfileImage();
  const seller = useAuthStore((s) => s.seller);
  const logout = useAuthStore((s) => s.logout);
  const displayName = useDisplayName();
  const initials = useInitials();

  // Defer the catalog queries until the drawer is opened for the first time.
  // The Drawer is always mounted in the layout tree, so without this the
  // queries would fire on every page load. Latching during render (instead of
  // in an effect) is the React-recommended way to adjust state from props.
  const [hasOpened, setHasOpened] = useState(false);
  if (isOpen && !hasOpened) setHasOpened(true);

  const { items: marketplaceItems } = useDrawerMarketplace(hasOpened);
  const { items: storeItems } = useDrawerStores(hasOpened);
  const { items: serviceItems } = useDrawerServices(hasOpened);
  const { items: communityItems } = useDrawerCommunity(hasOpened);
  const { items: blogItems } = useDrawerBlogs(hasOpened);
  // Same deferral: this one polls, so starting it before the drawer is ever
  // opened would double the avatar dropdown's background traffic on every page.
  const dealsCount = useDealsBadge(hasOpened);

  const accordionSections = useMemo((): AccordionSectionDef[] => {
    // Empty rows carry no route, so handleNavigate ignores them. The copy comes
    // from the dictionary — it was hardcoded English, which showed through
    // untranslated in ES and FR whenever a catalog came back empty.
    const orEmpty = (items: AccordionSectionDef["items"]) =>
      items.length > 0 ? items : [{ label: t("sections.empty"), route: "" }];

    return [
      {
        key: "marketplace",
        label: t("marketplace"),
        icon: Package,
        baseRoute: "/marketplace",
        items: orEmpty(marketplaceItems),
      },
      {
        key: "stores",
        label: t("stores"),
        icon: Store,
        baseRoute: "/stores",
        items: orEmpty(storeItems),
      },
      {
        key: "services",
        label: t("services"),
        icon: ScanBarcode,
        baseRoute: "/services",
        items: orEmpty(serviceItems),
      },
      {
        key: "community",
        label: t("community"),
        icon: MessageSquare,
        baseRoute: "/community",
        items: orEmpty(communityItems),
      },
      {
        key: "blog",
        label: t("blog"),
        icon: BookOpen,
        baseRoute: "/blog",
        items: orEmpty(blogItems),
      },
    ];
  }, [marketplaceItems, storeItems, serviceItems, communityItems, blogItems, t]);

  const handleNavigate = (route: string) => {
    // Fallback "no items available" rows carry an empty route — ignore them.
    if (!route) return;
    closeDrawer();
    // Routes are declared without the locale segment; prefix the active locale
    // so they resolve under the `/[lang]` route group.
    router.push(route.startsWith("/") ? `/${lang}${route}` : route);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeDrawer();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  // Opening moves focus into the panel and closing hands it back to whatever
  // opened it (the navbar menu button), so keyboard users aren't stranded.
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const openerRef = useRef<HTMLElement | null>(null);
  useEffect(() => {
    if (isOpen) {
      openerRef.current = document.activeElement as HTMLElement | null;
      closeButtonRef.current?.focus();
    } else {
      openerRef.current?.focus();
      openerRef.current = null;
    }
  }, [isOpen]);

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden
        onClick={closeDrawer}
        className={clsx(
          "fixed inset-0 z-100 bg-black/40 transition-opacity duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />

      {/* Drawer panel — always mounted, so it has to be inert while closed or
          its links stay in the tab order and in the accessibility tree. */}
      <div
        id={DRAWER_PANEL_ID}
        role="dialog"
        aria-modal="true"
        aria-label={t("header")}
        inert={!isOpen}
        aria-hidden={!isOpen}
        className={clsx(
          "fixed inset-y-0 right-0 z-101 flex w-80 flex-col bg-surface shadow-lg transition-transform duration-300 ease-[cubic-bezier(0.25,0.1,0.25,1)]",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        {/* Header */}
        <div className="flex flex-row items-center justify-between border-b border-border-strong bg-surface px-5 pt-2.5 pb-4">
          <span className="font-sans text-xl font-bold tracking-[1px] text-primary">
            {t("header")}
          </span>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={closeDrawer}
            aria-label={t("a11y.close")}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-sm bg-background-tertiary text-foreground-secondary outline-none focus-visible:ring-2 focus-visible:ring-primary"
          >
            <X size={20} color="currentColor" strokeWidth={2} aria-hidden />
          </button>
        </div>

        {/* Scrollable content */}
        <div className="flex flex-1 flex-col gap-1 overflow-y-auto pb-8">
          {/* User identity */}
          {seller && (
            <div className="flex flex-col items-center gap-3 bg-secondary/10 p-3.5">
              {/* Both branches fill the same 52px slot — the photo used to
                  render at 130px from a 100px source, so it was both upscaled
                  and 2.5× the size of the initials fallback beside it. */}
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt=""
                  width={104}
                  height={104}
                  className="size-13 shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex size-13 shrink-0 items-center justify-center rounded-full bg-primary">
                  <span className="font-sans text-lg font-bold text-on-primary">
                    {initials || "?"}
                  </span>
                </div>
              )}
              <div className="flex w-full flex-1 flex-col items-center gap-0.5">
                <span className="max-w-full truncate font-sans text-base font-bold text-foreground">
                  {displayName}
                </span>
                <span className="max-w-full truncate font-sans text-xs font-normal text-foreground-secondary">
                  {seller.email}
                </span>
                <div className="flex items-center justify-center mt-2 self-center-safe rounded-2xl bg-primary/15 px-2 py-1">
                  <span className="font-sans text-xs font-semibold text-primary-dark">
                    {t(`sellerType.${seller.sellerType}`)}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Account section — signed-in only. Every row behind it (profile,
              deals, orders, settings, impact) requires a session, so showing
              them to a guest just walks them into an auth wall. */}
          {seller && (
            <div className="mb-1 flex flex-col gap-1.5 px-4">
              <SectionLabel label={t("sections.account")} />
              <div className="overflow-hidden rounded-lg bg-surface">
                {profileMenuItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <MenuRow
                      key={item.route}
                      icon={Icon}
                      label={t(item.tKey)}
                      onPress={() => handleNavigate(item.route)}
                      hasBorder={index < profileMenuItems.length - 1}
                      badgeCount={item.route === "/deals" ? dealsCount : undefined}
                    />
                  );
                })}
              </div>
            </div>
          )}

          {/* Explore section */}
          <div className="mb-1 flex flex-col gap-1.5 px-4">
            <SectionLabel label={t("sections.explore")} />
            <div className="overflow-hidden rounded-lg bg-surface">
              <MenuRow
                icon={House}
                label={t("home")}
                onPress={() => handleNavigate("/")}
                hasBorder
              />
              {accordionSections.map((section) => (
                <Accordion
                  key={section.key}
                  section={section}
                  onNavigate={handleNavigate}
                />
              ))}
              <MenuRow
                icon={PackagePlus}
                label={t("upload")}
                onPress={() => handleNavigate("/publish")}
                hasBorder={false}
              />
            </div>
          </div>

          {/* Support section */}
          <div className="mb-1 flex flex-col gap-1.5 px-4">
            <SectionLabel label={t("sections.support")} />
            <div className="overflow-hidden rounded-lg bg-surface">
              {supportMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <MenuRow
                    key={item.route}
                    icon={Icon}
                    label={t(item.tKey)}
                    onPress={() => handleNavigate(item.route)}
                    hasBorder={index < supportMenuItems.length - 1}
                  />
                );
              })}
            </div>
          </div>

          {/* Auth action */}
          <div className="w-full flex items-center mt-3">
            {seller ? (
              <Button
                variant="error"
                text={t("logOut")}
                className="mx-4 mt-3"
                fullWidth
                onPress={async () => {
                  logout();
                  closeDrawer();
                  router.push(`/${lang}/login`);
                }}
              />
            ) : (
              <Button
                text={t("logIn")}
                className="mx-4 mt-3"
                fullWidth
                onPress={() => handleNavigate("/login")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
