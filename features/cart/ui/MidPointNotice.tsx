"use client";
import { Info } from "lucide-react";

import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import { useCart } from "../hooks/useCart";

export function MidPointNotice({
  onContactSeller,
}: {
  onContactSeller: (sellerId?: string) => void;
}) {
  const { t } = useTranslation("cart");
  const { items } = useCart();
  const sellerId = items[0]?.sellerId;

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-warning/30 bg-warning/5 p-4">
      <div className="flex items-start gap-2">
        <Info size={18} className="mt-px text-warning" strokeWidth={2} />
        <Text variant="span" weight="semibold" color="warning">
          {t("checkout.shipping.methods.IN_MID_POINT_PICKUP")}
        </Text>
      </div>
      <Text variant="small" color="secondary">
        {t("checkout.shipping.midPoint.note")}
      </Text>
      <Button
        variant="secondary_outline"
        size="sm"
        text={t("checkout.shipping.midPoint.cta")}
        onPress={() => onContactSeller(sellerId)}
      />
    </div>
  );
}
