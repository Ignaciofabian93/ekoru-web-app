"use client";
import clsx from "clsx";
import { FlaskConical } from "lucide-react";
import { useTranslation } from "@/i18n/context";
import { MAIN_CONTENT_ID } from "../Layout/tokens";
import { EkoruLogo } from "../Primitives/EkoruLogo";
import SubHeader from "./Subheader";
import ProfileDropdown from "./ProfileDropdown";
import { ShoppingCartButton } from "../Patterns/ShoppingCart";
import { NotificationBanner } from "../Patterns/NotificationBanner";
import { SearchBar } from "./SearchBar";
import MenuButton from "./MenuButton";
import { LocationPicker } from "./LocationPicker";
import { PublishButton } from "./PublishButton";
import { FEATURES } from "@/constants/features";
import { NAMESPACE } from "./i18n";
import { useIsAuthenticated } from "@/store/useAuthStore";

export function NavBar() {
  const { t } = useTranslation(NAMESPACE);
  const isAuthenticated = useIsAuthenticated();

  return (
    <header
      id="header"
      aria-label={t("a11y.headerLabel")}
      className={clsx("w-full", "bg-white", "shadow-md shadow-gray-800/40")}
    >
      <NotificationBanner message={t("banner.beta")} icon={FlaskConical} variant="info" />

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
        className="w-full max-w-6xl flex flex-col mx-auto pt-4 pb-1 px-2 border-b border-border-strong md:border-0"
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3 px-2 pb-3 lg:flex-nowrap lg:gap-x-8">
          <EkoruLogo label={t("a11y.homeLink")} />
          <SearchBar className="order-last w-full lg:order-0 lg:w-[60%]" />
          <div className="relative ml-auto flex shrink-0 items-center justify-end gap-2 lg:gap-3">
            <PublishButton />
            {FEATURES.cart.available && isAuthenticated && (
              <ShoppingCartButton
                text={t("dropdown.cart")}
                label={t("a11y.cart")}
                labelWithOneItem={t("a11y.cartWithOneItem")}
                labelWithItems={t("a11y.cartWithItems")}
              />
            )}
            <div className="hidden md:flex">
              <ProfileDropdown />
            </div>
            <MenuButton className="md:hidden" />
          </div>
        </div>
      </nav>
      <SubHeader
        trailing={
          <LocationPicker className="ml-3 mt-3 self-start md:ml-0 md:mt-0 lg:self-auto" />
        }
      />
    </header>
  );
}
