"use client";

import {
  BookOpen,
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
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useDrawer } from "@/context/DrawerContext";
import { borderRadius, colors, fontFamily, fontSize, shadows } from "@/design/tokens";
import useAuthStore, { useDisplayName, useInitials, useProfileImage } from "@/store/useAuthStore";
import { useDrawerMarketplace } from "./hooks/useDrawerMarketplace";

import MainButton from "../Button/MainButton";
import { Title } from "../Title/Title";
import { Accordion, type AccordionSectionDef } from "./Accordion";
import MenuRow from "./MenuRow";
import { DRAWER_WIDTH } from "./constants/data";
import { useDrawerBlogs } from "./hooks/useDrawerBlogs";
import { useDrawerCommunity } from "./hooks/useDrawerCommunity";
import { useDrawerServices } from "./hooks/useDrawerServices";
import { useDrawerStores } from "./hooks/useDrawerStores";

const profileMenuItems = [
  { route: "/profile", label: "Profile", icon: User },
  { route: "/profile/settings", label: "Settings", icon: Settings },
  { route: "/profile/orders", label: "Orders", icon: Package },
  { route: "/profile/environmental-impact", label: "Environmental Impact", icon: Leaf },
];

const supportMenuItems = [{ route: "/contact", label: "Contact", icon: Mail }];

function SectionLabel({ label }: { label: string }) {
  return (
    <Title
      level="h6"
      weight="semibold"
      style={{ marginLeft: 4, marginTop: 8 }}
    >
      {label}
    </Title>
  );
}

export default function Drawer() {
  const { isOpen, closeDrawer } = useDrawer();
  const router = useRouter();
  const profileImage = useProfileImage();
  const seller = useAuthStore((s) => s.seller);
  const logout = useAuthStore((s) => s.logout);
  const displayName = useDisplayName();
  const initials = useInitials();

  const [hasOpened, setHasOpened] = useState(false);
  useEffect(() => {
    if (isOpen && !hasOpened) setHasOpened(true);
  }, [isOpen, hasOpened]);

  const { items: marketplaceItems } = useDrawerMarketplace(hasOpened);
  const { items: storeItems } = useDrawerStores(hasOpened);
  const { items: serviceItems } = useDrawerServices(hasOpened);
  const { items: communityItems } = useDrawerCommunity(hasOpened);
  const { items: blogItems } = useDrawerBlogs(hasOpened);

  const accordionSections = useMemo(
    (): AccordionSectionDef[] => [
      {
        key: "marketplace",
        label: "Marketplace",
        icon: Package,
        baseRoute: "/marketplace",
        items: marketplaceItems.length > 0 ? marketplaceItems : [{ label: "No marketplace categories available", route: "" }],
      },
      {
        key: "stores",
        label: "Stores",
        icon: Store,
        baseRoute: "/stores",
        items: storeItems.length > 0 ? storeItems : [{ label: "No store categories available", route: "" }],
      },
      {
        key: "services",
        label: "Services",
        icon: ScanBarcode,
        baseRoute: "/services",
        items: serviceItems.length > 0 ? serviceItems : [{ label: "No service categories available", route: "" }],
      },
      {
        key: "community",
        label: "Community",
        icon: MessageSquare,
        baseRoute: "/community",
        items: communityItems.length > 0 ? communityItems : [{ label: "No community sections available", route: "" }],
      },
      {
        key: "blog",
        label: "Blog",
        icon: BookOpen,
        baseRoute: "/blog",
        items: blogItems.length > 0 ? blogItems : [{ label: "No blog sections available", route: "" }],
      },
    ],
    [marketplaceItems, storeItems, serviceItems, communityItems, blogItems],
  );

  const handleNavigate = (route: string) => {
    closeDrawer();
    router.push(route);
  };

  // Close on Escape
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeDrawer(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeDrawer]);

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.4)",
          zIndex: 100,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
          transition: "opacity 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: "fixed",
          top: 0,
          right: 0,
          bottom: 0,
          width: DRAWER_WIDTH,
          zIndex: 101,
          backgroundColor: colors.surface,
          boxShadow: shadows.lg,
          display: "flex",
          flexDirection: "column",
          transform: isOpen ? "translateX(0)" : `translateX(${DRAWER_WIDTH}px)`,
          transition: "transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 20,
            paddingTop: 10,
            paddingBottom: 16,
            backgroundColor: colors.surface,
            borderBottom: `1px solid ${colors.borderStrong}`,
          }}
        >
          <span
            style={{
              fontSize: fontSize.xl,
              fontFamily: fontFamily.sans,
              fontWeight: 700,
              color: colors.primary,
              letterSpacing: 1,
            }}
          >
            Menu
          </span>
          <button
            type="button"
            onClick={closeDrawer}
            style={{
              width: 32,
              height: 32,
              borderRadius: borderRadius.sm,
              backgroundColor: colors.backgroundTertiary,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: "none",
              cursor: "pointer",
            }}
          >
            <X size={20} color={colors.foregroundSecondary} strokeWidth={2} />
          </button>
        </div>

        {/* Scrollable content */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 4,
            paddingBottom: 32,
          }}
        >
          {/* User identity */}
          {seller && (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                backgroundColor: `${colors.secondary}10`,
                borderRadius: borderRadius.lg,
                padding: 14,
                marginBottom: 8,
                margin: 12,
              }}
            >
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  style={{ width: 130, height: 130, borderRadius: borderRadius.full, objectFit: "cover", flexShrink: 0 }}
                />
              ) : (
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: borderRadius.full,
                    backgroundColor: colors.primary,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <span style={{ fontSize: fontSize.lg, fontFamily: fontFamily.sans, fontWeight: 700, color: colors.onPrimary }}>
                    {initials || "?"}
                  </span>
                </div>
              )}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, width: "100%", alignItems: "center" }}>
                <span
                  style={{
                    fontSize: fontSize.base,
                    fontFamily: fontFamily.sans,
                    fontWeight: 700,
                    color: colors.foreground,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}
                >
                  {displayName}
                </span>
                <span
                  style={{
                    fontSize: fontSize.xs,
                    fontFamily: fontFamily.sans,
                    fontWeight: 400,
                    color: colors.foregroundSecondary,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    maxWidth: "100%",
                  }}
                >
                  {seller.email}
                </span>
                <div
                  style={{
                    alignSelf: "flex-start",
                    marginTop: 4,
                    backgroundColor: `${colors.primary}22`,
                    paddingInline: 8,
                    paddingBlock: 2,
                    borderRadius: borderRadius["2xl"],
                  }}
                >
                  <span style={{ fontSize: fontSize.xs, fontFamily: fontFamily.sans, fontWeight: 600, color: colors.primaryDark }}>
                    {seller.sellerType}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Account section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4, paddingInline: 16 }}>
            <SectionLabel label="Account" />
            <div style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: "hidden" }}>
              {profileMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <MenuRow
                    key={item.route}
                    icon={Icon}
                    label={item.label}
                    onPress={() => handleNavigate(item.route)}
                    hasBorder={index < profileMenuItems.length - 1}
                  />
                );
              })}
            </div>
          </div>

          {/* Explore section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4, paddingInline: 16 }}>
            <SectionLabel label="Explore" />
            <div style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: "hidden" }}>
              <MenuRow icon={House} label="Home" onPress={() => handleNavigate("/")} hasBorder />
              {accordionSections.map((section) => (
                <Accordion key={section.key} section={section} onNavigate={handleNavigate} />
              ))}
              <MenuRow
                icon={PackagePlus}
                label="Publish"
                onPress={() => handleNavigate("/publish")}
                hasBorder={false}
              />
            </div>
          </div>

          {/* Support section */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 4, paddingInline: 16 }}>
            <SectionLabel label="Support" />
            <div style={{ backgroundColor: colors.surface, borderRadius: borderRadius.lg, overflow: "hidden" }}>
              {supportMenuItems.map((item, index) => {
                const Icon = item.icon;
                return (
                  <MenuRow
                    key={item.route}
                    icon={Icon}
                    label={item.label}
                    onPress={() => handleNavigate(item.route)}
                    hasBorder={index < supportMenuItems.length - 1}
                  />
                );
              })}
            </div>
          </div>

          {/* Auth action */}
          <div style={{ marginTop: 12 }}>
            {seller ? (
              <MainButton
                variant="error"
                text="Log Out"
                style={{ marginInline: 16, marginTop: 12 }}
                onPress={async () => {
                  await logout();
                  closeDrawer();
                  router.push("/auth");
                }}
              />
            ) : (
              <MainButton
                text="Log In"
                style={{ marginInline: 16, marginTop: 12 }}
                onPress={() => handleNavigate("/auth")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
