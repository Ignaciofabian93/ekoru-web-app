"use client";
import type { PublishForm } from "../../hooks/usePublish";

import { PriceField } from "../fields/PriceField";
import { SkuField } from "../fields/SkuField";
import { StockField } from "../fields/StockField";

interface InventoryStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  invalid: {
    price: boolean;
    stock: boolean;
  };
}

export function InventoryStep({ form, setField, invalid }: InventoryStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <PriceField
        value={form.price}
        onChange={(v) => setField("price", v)}
        invalid={invalid.price}
      />
      <StockField
        value={form.stock}
        onChange={(v) => setField("stock", v)}
        invalid={invalid.stock}
      />
      <SkuField value={form.sku} onChange={(v) => setField("sku", v)} />
    </div>
  );
}
