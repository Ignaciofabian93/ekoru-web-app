"use client";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";
import { PROFILE_DETAIL_SECTIONS } from "../constants/menuItems";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "@/components/Patterns/SectionCard";
import { Contact2, Pen } from "lucide-react";
import { LinkButton } from "@/components/Primitives";
import { useParams } from "next/navigation";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";

export function Details() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useSeller();
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  return (
    <>
      {PROFILE_DETAIL_SECTIONS.map((section) => (
        <SectionCard
          icon={Contact2}
          tone="default"
          key={section.key}
          title={t(section.label)}
          subtitle={t(section.description)}
          headerRight={
            <div className="hidden sm:inline-flex">
              <LinkButton
                href={`/${lang}/profile/edit-profile`}
                icon={Pen}
                variant="ghost"
                label={t("account.editProfile")}
                iconPosition="right"
                size="sm"
              />
            </div>
          }
        >
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.field} className="flex items-start p-1 gap-2">
                  <div className="flex mb-1 shrink-0 items-center justify-center text-foreground-secondary">
                    <Icon size={14} color="currentColor" strokeWidth={2} />
                  </div>
                  <div className="flex min-w-0 flex-col">
                    <Text
                      variant="span"
                      weight="bold"
                      size="xs"
                      color="tertiary"
                      className="uppercase"
                    >
                      {t(item.label)}
                    </Text>
                    <Text variant="span" weight="normal" size="sm" numberOfLines={1}>
                      {item.value(seller) || "—"}
                    </Text>
                  </div>
                </div>
              );
            })}
          </div>
        </SectionCard>
      ))}
    </>
  );
}
