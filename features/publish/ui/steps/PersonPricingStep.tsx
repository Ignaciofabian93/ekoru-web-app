"use client";
import type { PublishForm } from "../../hooks/usePublishForm";

import { ExchangeableField } from "../fields/ExchangeableField";
import { PriceField } from "../fields/PriceField";

interface PersonPricingStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  invalid: {
    price: boolean;
  };
}

/** Price and exchange preference for a marketplace listing. */
export function PersonPricingStep({ form, setField, invalid }: PersonPricingStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <PriceField
          value={form.price}
          onChange={(v) => setField("price", v)}
          invalid={invalid.price}
        />
      </div>

      <ExchangeableField
        value={form.isExchangeable}
        onChange={(v) => setField("isExchangeable", v)}
      />
    </div>
  );
}
