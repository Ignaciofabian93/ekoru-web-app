"use client";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { Title } from "@/components/Primitives/Title";
import { Text } from "@/components/Primitives/Text";

export function StoreProductDescription({
  description,
}: {
  description?: string | null;
}) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <div className="flex flex-col items-start justify-center gap-3 px-2">
      <Title level="h5" size="h5" weight="semibold">
        {t("description.title")}
      </Title>
      {description ? (
        <Text variant="p" className="leading-relaxed">
          {description}
        </Text>
      ) : (
        <Text variant="p" className="leading-relaxed">
          {t("description.empty")}
        </Text>
      )}
    </div>
  );
}
