"use client";
import type { PublishForm } from "../../hooks/usePublish";
import type { PublishTarget } from "../../constants/options";

import { ExchangeableField } from "../fields/ExchangeableField";
import { PriceField } from "../fields/PriceField";
import { ServicePricingField } from "../fields/ServicePricingField";

interface PricingStepProps {
  target: PublishTarget;
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  invalid: {
    price: boolean;
    servicePricing: boolean;
  };
}

export function PricingStep({ target, form, setField, invalid }: PricingStepProps) {
  const isServiceQuotation =
    target === "SERVICE" && form.servicePricing === "QUOTATION";

  return (
    <div className="flex flex-col gap-5">
      {target === "SERVICE" && (
        <ServicePricingField
          value={form.servicePricing}
          onChange={(v) => setField("servicePricing", v)}
          invalid={invalid.servicePricing}
        />
      )}

      {!isServiceQuotation && (
        <PriceField
          value={form.price}
          onChange={(v) => setField("price", v)}
          invalid={invalid.price}
        />
      )}

      {target === "MARKETPLACE" && (
        <ExchangeableField
          value={form.isExchangeable}
          onChange={(v) => setField("isExchangeable", v)}
        />
      )}
    </div>
  );
}
