"use client";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";
import { PROFILE_DETAIL_SECTIONS } from "../constants/menuItems";
import { NAMESPACE } from "../i18n";
import { SectionCard } from "./SectionCard";
import { Contact2 } from "lucide-react";

export function Details() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useSeller();

  return (
    <>
      {PROFILE_DETAIL_SECTIONS.map((section) => (
        <SectionCard
          icon={Contact2}
          tone="default"
          key={section.key}
          title={t(section.label)}
          subtitle={t(section.description)}
        >
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.field} className="flex items-center px-3">
                  <div className="flex mb-1 shrink-0 items-center justify-center text-foreground-secondary">
                    <Icon size={20} color="currentColor" strokeWidth={2} />
                  </div>
                  <div className="ml-4 flex min-w-0 flex-col">
                    <Text variant="span" weight="semibold" size="sm" color="secondary">
                      {t(item.label)}
                    </Text>
                    <Text variant="span" weight="normal" size="base" numberOfLines={1}>
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
