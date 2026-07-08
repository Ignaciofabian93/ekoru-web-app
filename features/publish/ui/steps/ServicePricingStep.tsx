"use client";
import type { PublishForm } from "../../hooks/usePublishForm";

import { DurationField } from "../fields/DurationField";
import { PriceField } from "../fields/PriceField";
import { PriceRangeField } from "../fields/PriceRangeField";
import { ServicePricingField } from "../fields/ServicePricingField";

interface ServicePricingStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  invalid: {
    price: boolean;
    servicePricing: boolean;
  };
}

/** Pricing model, price and duration for a service listing. */
export function ServicePricingStep({ form, setField, invalid }: ServicePricingStepProps) {
  const isQuotation = form.servicePricing === "QUOTATION";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <ServicePricingField
          value={form.servicePricing}
          onChange={(v) => setField("servicePricing", v)}
          invalid={invalid.servicePricing}
        />
        {!isQuotation && (
          <PriceField
            value={form.price}
            onChange={(v) => setField("price", v)}
            invalid={invalid.price}
          />
        )}
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <PriceRangeField
          value={form.priceRange}
          onChange={(v) => setField("priceRange", v)}
        />
        <DurationField
          value={form.duration}
          onChange={(v) => setField("duration", v)}
        />
      </div>
    </div>
  );
}
