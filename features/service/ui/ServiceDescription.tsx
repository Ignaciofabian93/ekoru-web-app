"use client";
import { useTranslation } from "@/i18n/context";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";

import { NAMESPACE } from "../i18n";

export function ServiceDescription({ description }: { description?: string | null }) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="flex flex-col items-start justify-center gap-3 px-2">
      <Title level="h5" size="h5" weight="semibold">
        {t("description.title")}
      </Title>
      <Text variant="p" className="leading-relaxed">
        {description || t("description.empty")}
      </Text>
    </div>
  );
}
