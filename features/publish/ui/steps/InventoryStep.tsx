"use client";
import type { PublishForm } from "../../hooks/usePublishForm";

import { BarcodeField } from "../fields/BarcodeField";
import { HasOfferField } from "../fields/HasOfferField";
import { LowStockThresholdField } from "../fields/LowStockThresholdField";
import { OfferPriceField } from "../fields/OfferPriceField";
import { PriceField } from "../fields/PriceField";
import { SkuField } from "../fields/SkuField";
import { StockField } from "../fields/StockField";

interface InventoryStepProps {
  form: PublishForm;
  setField: <K extends keyof PublishForm>(key: K, value: PublishForm[K]) => void;
  invalid: {
    price: boolean;
    stock: boolean;
    offerPrice: boolean;
  };
}

export function InventoryStep({ form, setField, invalid }: InventoryStepProps) {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
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
      </div>
      <HasOfferField value={form.hasOffer} onChange={(v) => setField("hasOffer", v)} />
      {form.hasOffer && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <OfferPriceField
            value={form.offerPrice}
            onChange={(v) => setField("offerPrice", v)}
            invalid={invalid.offerPrice}
          />
        </div>
      )}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <LowStockThresholdField
          value={form.lowStockThreshold}
          onChange={(v) => setField("lowStockThreshold", v)}
        />
      </div>
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <SkuField value={form.sku} onChange={(v) => setField("sku", v)} />
        <BarcodeField value={form.barcode} onChange={(v) => setField("barcode", v)} />
      </div>
    </div>
  );
}
