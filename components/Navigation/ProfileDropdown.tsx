"use client";
import { useId } from "react";
import { useRouter } from "next/navigation";
import {
  Bell,
  Handshake,
  LogIn,
  PackagePlus,
  Recycle,
  LogOutIcon,
  UserRound,
  UserRoundPlus,
} from "lucide-react";
import Image from "next/image";
import clsx from "clsx";
import { useTranslation } from "@/i18n/context";
import { useLanguage } from "@/hooks/useLanguage";
import {
  useDisplayName,
  useInitials,
  useIsAuthenticated,
  useProfileImage,
  useSellerEmail,
} from "@/store/useAuthStore";
import { NAMESPACE } from "./i18n";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useDealsBadge } from "@/features/deals/hooks/useDealsBadge";
import { Avatar } from "../Primitives/Avatar";
import { Text } from "@/components/Primitives/Text";
import {
  DropdownItem,
  DropdownPanel,
  useDropdown,
  useRovingFocus,
} from "@/components/Overlays/Dropdown";
import type { ProfileMenuItem } from "./types";

const AUTH_MENU_ITEMS: ProfileMenuItem[] = [
  { labelKey: "dropdown.myProfile", path: "/profile", icon: UserRound },
  { labelKey: "dropdown.deals", path: "/deals", icon: Handshake },
  { labelKey: "dropdown.recycle", path: "/recycle", icon: Recycle },
  { labelKey: "dropdown.publish", path: "/publish", icon: PackagePlus },
  { labelKey: "dropdown.notifications", path: "/notifications", icon: Bell },
];

const GUEST_MENU_ITEMS: ProfileMenuItem[] = [
  { labelKey: "dropdown.signIn", path: "/login", icon: LogIn },
  { labelKey: "dropdown.signUp", path: "/register", icon: UserRoundPlus },
];

export default function ProfileDropdown() {
  const menuId = useId();
  const router = useRouter();
  const [language] = useLanguage();
  const { t } = useTranslation(NAMESPACE);
  const { handleLogout } = useLogout();

  const isAuthenticated = useIsAuthenticated();
  const dealsCount = useDealsBadge();
  const profileImage = useProfileImage();
  const displayName = useDisplayName();
  const email = useSellerEmail();
  const initials = useInitials();

  const menuItems = isAuthenticated ? AUTH_MENU_ITEMS : GUEST_MENU_ITEMS;
  const itemCount = menuItems.length + (isAuthenticated ? 1 : 0);

  const { isOpen, close, toggle, containerRef, triggerRef } =
    useDropdown<HTMLButtonElement>();
  const { itemRef, handleKeyDown } = useRovingFocus(isOpen, itemCount, close);

  const handleNavigate = (path: string) => {
    close();
    router.push(`/${language}${path}`);
  };

  return (
    <div ref={containerRef} className="relative flex items-center justify-center">
      <Avatar
        ref={triggerRef}
        image={profileImage}
        alt=""
        size="sm"
        ariaLabel={isOpen ? t("a11y.closeAccountMenu") : t("a11y.openAccountMenu")}
        ariaControls={menuId}
        ariaExpanded={isOpen}
        ariaHasPopup="menu"
        onClick={toggle}
      />

      {/* keepMounted so the panel animates, staying inert (and out of the
          screen reader's reach) while collapsed. */}
      <DropdownPanel
        id={menuId}
        isOpen={isOpen}
        keepMounted
        width="min-w-62"
        className="top-[calc(100%+10px)]"
      >
        <DropdownHeader
          isAuthenticated={isAuthenticated}
          displayName={displayName}
          initials={initials}
          profileImage={profileImage}
          email={email}
        />

        <div role="menu" aria-label={t("a11y.accountMenu")} className="py-1.5">
          {menuItems.map((item, index) => (
            <DropdownItem
              key={item.labelKey}
              ref={itemRef(index)}
              icon={item.icon}
              label={t(item.labelKey)}
              iconBadge
              badgeCount={item.path === "/deals" ? dealsCount : undefined}
              hasBorder={index !== menuItems.length - 1}
              onSelect={() => handleNavigate(item.path)}
              onKeyDown={(e) => handleKeyDown(e, index)}
            />
          ))}
          {isAuthenticated && (
            <DropdownItem
              ref={itemRef(menuItems.length)}
              icon={LogOutIcon}
              label={t("dropdown.signOut")}
              iconBadge
              tone="danger"
              hasBorder
              onSelect={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, menuItems.length)}
            />
          )}
        </div>
      </DropdownPanel>
    </div>
  );
}

interface DropdownHeaderProps {
  isAuthenticated: boolean;
  profileImage?: string;
  displayName: string;
  initials: string;
  email: string;
}

function DropdownHeader({
  isAuthenticated,
  profileImage,
  displayName,
  initials,
  email,
}: DropdownHeaderProps) {
  return (
    <div
      className={clsx(
        "flex items-center gap-3 border-b border-border-strong",
        "px-4 pb-3 pt-3.5",
      )}
    >
      {isAuthenticated ? (
        <>
          {/* Decorative: the name and email sit right next to it. */}
          <div
            aria-hidden
            className={clsx(
              "overflow-hidden rounded-full border-2 border-white/20",
              "w-10 h-10",
              "transition-colors duration-200 ease-in-out",
            )}
          >
            {profileImage ? (
              <Image
                src={profileImage}
                alt=""
                width={44}
                height={44}
                className="size-full object-cover"
              />
            ) : (
              <Text variant="span" size="base" weight="bold" className="text-on-primary">
                {initials}
              </Text>
            )}
          </div>

          <div className="min-w-0 flex-1">
            <Text variant="p" size="base" weight="bold" className="line-clamp-1">
              {displayName}
            </Text>
            {email && (
              <Text variant="p" size="xs" weight="semibold" className="line-clamp-1">
                {email}
              </Text>
            )}
          </div>
        </>
      ) : (
        <>
          <div
            className={clsx(
              "flex w-10 h-10 shrink-0 items-center justify-center overflow-hidden",
              "rounded-full border-2 border-white/20",
            )}
          >
            <Image
              src="/brand/icon.webp"
              alt=""
              width={44}
              height={44}
              className="size-full object-cover"
            />
          </div>

          <div className="min-w-0 flex-1">
            <Text variant="p" weight="bold" size="base" className="truncate">
              EKORU
            </Text>
          </div>
        </>
      )}
    </div>
  );
}
