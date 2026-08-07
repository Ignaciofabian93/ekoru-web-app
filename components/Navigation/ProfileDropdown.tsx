"use client";
import { useId } from "react";
import { useRouter } from "next/navigation";
import { LogOutIcon } from "lucide-react";
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
import {
  DROPDOWN_ACCOUNT_SECTION,
  DROPDOWN_GUEST_SECTION,
  DROPDOWN_SUPPORT_SECTION,
  type DropdownMenuSection,
} from "./constants/menuItems";

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

  const sections: DropdownMenuSection[] = [
    isAuthenticated ? DROPDOWN_ACCOUNT_SECTION : DROPDOWN_GUEST_SECTION,
    DROPDOWN_SUPPORT_SECTION,
  ];

  // Roving focus indexes one flat list, so each section continues the previous
  // one's numbering and sign-out sits last. `offsets[i]` is where section `i`
  // starts.
  const offsets = sections.reduce<number[]>(
    (acc, section, i) => [
      ...acc,
      (acc[i - 1] ?? 0) + (sections[i - 1]?.items.length ?? 0),
    ],
    [],
  );
  const itemCount =
    sections.reduce((n, s) => n + s.items.length, 0) + (isAuthenticated ? 1 : 0);

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

        <div role="menu" aria-label={t("a11y.accountMenu")} className="py-1.5 px-2">
          {sections.map((section, sectionIndex) => (
            // The heading is decorative — the group's `aria-label` already
            // names this run of items, so announcing it twice would be noise.
            <div key={section.key} role="group" aria-label={t(section.label)}>
              <p
                aria-hidden
                className="px-3 pt-2.5 pb-1 font-sans text-xs font-semibold tracking-wide text-foreground-tertiary uppercase"
              >
                {t(section.label)}
              </p>
              {section.items.map((item, i) => {
                const index = offsets[sectionIndex] + i;
                return (
                  <DropdownItem
                    key={item.route}
                    ref={itemRef(index)}
                    icon={item.icon}
                    label={t(item.label)}
                    disabled={!item.available}
                    description={item.available ? undefined : t("dropdown.comingSoon")}
                    badgeCount={item.route === "/deals" ? dealsCount : undefined}
                    hasBorder={i !== section.items.length - 1}
                    onSelect={() => handleNavigate(item.route)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                  />
                );
              })}
            </div>
          ))}

          {/* The only item carrying a standing highlight: everything above it
              navigates, this one ends the session, so it reads as its own block
              rather than one more row in the list. */}
          {isAuthenticated && (
            <DropdownItem
              ref={itemRef(itemCount - 1)}
              icon={LogOutIcon}
              label={t("dropdown.signOut")}
              tone="danger"
              highlighted
              className="mt-2 rounded-lg"
              onSelect={handleLogout}
              onKeyDown={(e) => handleKeyDown(e, itemCount - 1)}
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
