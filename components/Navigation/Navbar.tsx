"use client";
import clsx from "clsx";
import { FlaskConical } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { MAIN_CONTENT_ID } from "../Layout/tokens";
import { EkoruLogo } from "../Primitives/EkoruLogo";
import SubHeader from "./Subheader";
import ProfileDropdown from "./ProfileDropdown";
import LanguageSwitcher from "./LanguageSwitcher";
import { ShoppingCartButton } from "../Patterns/ShoppingCart";
import { NotificationBanner } from "../Patterns/NotificationBanner";
import { SearchBar } from "./SearchBar";
import MenuButton from "./MenuButton";
import { NotificationBell } from "@/features/notifications/ui/NotificationBell";
import { NAMESPACE } from "./i18n";

export function NavBar() {
  const { t } = useTranslation(NAMESPACE);

  return (
    <header
      id="header"
      aria-label={t("a11y.headerLabel")}
      className="w-screen bg-linear-to-r from-primary via-secondary-dark to-primary"
    >
      {/* Above everything, including the skip link — it carries no focusable
          controls, so it can't get between a keyboard user and that link. */}
      <NotificationBanner message={t("banner.beta")} icon={FlaskConical} />

      {/* Visible only once focused; the target is the <main> that PageLayout
          renders. Must be the first focusable thing on the page. */}
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className={clsx(
          "sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-100",
          "focus:rounded-md focus:bg-surface focus:px-4 focus:py-2",
          "focus:text-sm focus:font-semibold focus:text-foreground",
          "focus:outline-none focus:ring-2 focus:ring-white",
        )}
      >
        {t("a11y.skipToContent")}
      </a>
      <nav
        aria-label={t("a11y.primaryNav")}
        className="w-full max-w-4xl flex flex-col mx-auto pt-3 px-2"
      >
        <div className="flex items-center justify-between px-2 mb-2">
          <EkoruLogo label={t("a11y.homeLink")} />
          <div className="flex items-center justify-end gap-3">
            <LanguageSwitcher />
            {/* Renders nothing for guests, so the row collapses cleanly. */}
            <NotificationBell />
            <ShoppingCartButton
              label={t("a11y.cart")}
              labelWithOneItem={t("a11y.cartWithOneItem")}
              labelWithItems={t("a11y.cartWithItems")}
            />
            {/* Below md the drawer carries the account links, so the dropdown
                gives way to the menu button that opens it. */}
            <div className="hidden md:flex">
              <ProfileDropdown />
            </div>
            <MenuButton className="md:hidden" />
          </div>
        </div>
        <SearchBar />
      </nav>
      <SubHeader />
    </header>
  );
}
