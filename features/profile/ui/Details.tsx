"use client";
import { Title } from "@/components/Title/Title";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useSeller } from "@/store/useAuthStore";
import { Flag, Globe, MapPin, Phone, Pin, PinIcon } from "lucide-react";
import { Text } from "@/components/Text/Text";

export function Details() {
  const { t } = useTranslation(NAMESPACE);
  const seller = useSeller();

  const ITEMS = [
    { key: "phone", label: t("details.phone"), icon: Phone, value: seller?.phone },
    { key: "address", label: t("details.address"), icon: MapPin, value: seller?.address },
    {
      key: "county",
      label: t("details.county"),
      icon: Pin,
      value: seller?.county?.county,
    },
    { key: "city", label: t("details.city"), icon: PinIcon, value: seller?.city?.city },
    {
      key: "region",
      label: t("details.region"),
      icon: Flag,
      value: seller?.region?.region,
    },
    {
      key: "country",
      label: t("details.country"),
      icon: Globe,
      value: seller?.country?.country,
    },
  ];

  return (
    <section className="w-full max-w-3xl mx-auto my-8 px-8">
      <div className="mb-4">
        <Title level="h5" size="h5">
          {t("details.title")}
        </Title>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {ITEMS.map((item) => (
          <div key={item.key} className="flex items-center">
            <div className="bg-primary-light/20 p-3 rounded-lg text-primary">
              <item.icon size={18} />
            </div>
            <div className="flex flex-col ml-4">
              <Text variant="span" weight="semibold" size="base" color="tertiary">
                {item.label}
              </Text>
              <Text variant="span" weight="normal" size="base">
                {item.value}
              </Text>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
