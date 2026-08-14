"use client";
import { ComingSoonChip } from "@/components/Primitives";
import { Text } from "@/components/Primitives/Text";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { ChevronRight, UserRound } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { PROFILE_MENU_SECTIONS, type ProfileMenuItem } from "../constants/menuItems";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";

const ROW_CLASS = "flex items-center gap-3 rounded-lg p-2.5";

export function Account() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  return (
    <>
      {PROFILE_MENU_SECTIONS.map((section) => (
        <SectionCard
          icon={UserRound}
          tone="primary"
          key={section.key}
          title={t(section.label)}
          subtitle={t(section.description)}
        >
          {/* Single column inside the desktop sidebar, two columns when the card
              spans the full width on tablets. */}
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-1">
            {section.items.map((item) => (
              <AccountRow
                key={item.route}
                item={item}
                label={t(item.label)}
                href={`/${lang}${item.route}`}
                comingSoonLabel={t("account.comingSoon")}
              />
            ))}
          </div>
        </SectionCard>
      ))}
    </>
  );
}

/**
 * One link. Rows for pages that haven't shipped (`available: false`) still
 * show, but as plain text with a coming-soon chip rather than a link that
 * would walk the user into a 404.
 */
function AccountRow({
  item,
  label,
  href,
  comingSoonLabel,
}: {
  item: ProfileMenuItem;
  label: string;
  href: string;
  comingSoonLabel: string;
}) {
  const Icon = item.icon;

  const content = (
    <>
      <div className="flex mb-1 shrink-0 items-center justify-center text-foreground-secondary">
        <Icon size={20} color="currentColor" strokeWidth={2} />
      </div>
      <Text variant="span" weight="medium" size="base" className="flex-1">
        {label}
      </Text>
      {item.available ? (
        <ChevronRight size={16} strokeWidth={2} className="text-primary" />
      ) : (
        <ComingSoonChip label={comingSoonLabel} />
      )}
    </>
  );

  if (!item.available) {
    return <div className={clsx(ROW_CLASS, "opacity-60")}>{content}</div>;
  }

  return (
    <Link href={href} className={clsx(ROW_CLASS, "transition-colors hover:bg-white")}>
      {content}
    </Link>
  );
}
