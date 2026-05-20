"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Bell, Leaf, LogIn, PackagePlus, Recycle, UserPlus, User } from "lucide-react";
import Image from "next/image";
import clsx from "clsx";

import { useTranslation } from "@/i18n/context";
import {
  useDisplayName,
  useInitials,
  useIsAuthenticated,
  useProfileImage,
  useSellerEmail,
} from "@/store/useAuthStore";
import { NAMESPACE } from "@/features/navigation/i18n";

const AUTH_MENU_ITEMS = [
  { key: "dropdown.myProfile", route: "/profile", icon: User },
  { key: "dropdown.recycle", route: "/recycle", icon: Recycle },
  { key: "dropdown.publish", route: "/publish", icon: PackagePlus },
  { key: "dropdown.notifications", route: "/notifications", icon: Bell },
] as const;

const GUEST_MENU_ITEMS = [
  { key: "dropdown.signIn", route: "/login", icon: LogIn },
  { key: "dropdown.signUp", route: "/register", icon: UserPlus },
] as const;

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { t } = useTranslation(NAMESPACE);

  const isAuthenticated = useIsAuthenticated();
  const profileImage = useProfileImage();
  const displayName = useDisplayName();
  const email = useSellerEmail();
  const initials = useInitials();

  const close = () => setIsOpen(false);

  useEffect(() => {
    const onMouseDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        close();
      }
    };
    document.addEventListener("mousedown", onMouseDown);
    return () => document.removeEventListener("mousedown", onMouseDown);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const handleNavigate = (route: string) => {
    close();
    router.push(route);
  };

  const menuItems = isAuthenticated ? AUTH_MENU_ITEMS : GUEST_MENU_ITEMS;

  return (
    <div ref={containerRef} className="relative">
      {/* Avatar trigger */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Open profile menu"
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className={clsx(
          "flex size-9 cursor-pointer items-center justify-center overflow-hidden rounded-full border-2 p-0 outline-none transition-all duration-150",
          isAuthenticated && !profileImage ? "bg-primary-dark" : "bg-transparent",
          isOpen
            ? "border-secondary ring-[3px] ring-secondary/25"
            : "border-navbar-hover",
        )}
      >
        {isAuthenticated ? (
          profileImage ? (
            <Image
              src={profileImage}
              alt={displayName}
              width={36}
              height={36}
              className="size-full object-cover"
            />
          ) : (
            <span className="select-none text-sm font-bold text-on-primary">
              {initials || "?"}
            </span>
          )
        ) : (
          <Image
            src="/brand/icon.webp"
            alt="Ekoru"
            width={36}
            height={36}
            className="size-full object-cover"
          />
        )}
      </button>

      {/* Dropdown panel */}
      <div
        role="menu"
        className={clsx(
          "absolute right-0 top-[calc(100%+10px)] z-49 min-w-62 overflow-hidden rounded-xl bg-surface shadow-xl ring-1 ring-border-light",
          "origin-top-right transition-all duration-200",
          isOpen
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none -translate-y-2 scale-95 opacity-0",
        )}
      >
        {/* Header card */}
        <div className="flex items-center gap-3 border-b border-border-light bg-linear-to-br from-primary-light-bg to-surface px-4 pb-3 pt-3.5">
          {isAuthenticated ? (
            <>
              <div
                className={clsx(
                  "flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary",
                  profileImage ? "bg-transparent" : "bg-primary",
                )}
              >
                {profileImage ? (
                  <Image
                    src={profileImage}
                    alt={displayName}
                    width={44}
                    height={44}
                    className="size-full object-cover"
                  />
                ) : (
                  <span className="text-base font-bold text-on-primary">
                    {initials || "?"}
                  </span>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-foreground">
                  {displayName}
                </p>
                {email && (
                  <p className="mt-px truncate text-xs text-foreground-secondary">
                    {email}
                  </p>
                )}
              </div>

              <div className="flex shrink-0 items-center justify-center rounded-sm bg-primary/10 p-1.5">
                <Leaf size={16} strokeWidth={2} className="text-primary" />
              </div>
            </>
          ) : (
            <>
              <div className="flex size-11 shrink-0 items-center justify-center overflow-hidden rounded-full border-2 border-primary bg-primary-light-bg">
                <Image
                  src="/brand/icon.webp"
                  alt="Ekoru"
                  width={44}
                  height={44}
                  className="size-full object-cover"
                />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-base font-bold text-foreground">EKORU</p>
              </div>
            </>
          )}
        </div>

        {/* Menu items */}
        <div className="py-1.5">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isLast = index === menuItems.length - 1;
            return (
              <MenuItem
                key={item.key}
                icon={Icon}
                label={t(item.key)}
                hasBorder={!isLast}
                onPress={() => handleNavigate(item.route)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface MenuItemProps {
  icon: React.ElementType;
  label: string;
  hasBorder: boolean;
  onPress: () => void;
}

function MenuItem({ icon: Icon, label, hasBorder, onPress }: MenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onPress}
      className={clsx(
        "group flex w-full cursor-pointer items-center gap-3 border-none bg-transparent px-4 py-2.5 text-left transition-colors duration-150 hover:bg-surface-hover",
        hasBorder && "border-b border-border-light",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-sm bg-primary/[0.07] text-primary transition-colors duration-150 group-hover:bg-primary/13 group-hover:text-primary-active">
        <Icon size={16} strokeWidth={1.5} />
      </div>
      <span className="text-base font-medium text-foreground-secondary transition-colors duration-150 group-hover:text-foreground">
        {label}
      </span>
    </button>
  );
}
