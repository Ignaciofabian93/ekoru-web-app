"use client";
import Link from "next/link";

export function CartClient({ lang }: { lang: string }) {
  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col gap-3 px-4 py-6 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
          <button className="text-xs text-danger hover:underline">Clear cart</button>
        </div>
      </div>

      {/* Footer summary */}
      <div className="sticky bottom-0 bg-surface border-t border-border px-4 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-foreground-secondary">Subtotal</span>
          </div>
          <Link
            href={`/${lang}/cart/checkout`}
            className="block w-full text-center bg-primary text-white font-semibold py-3.5 rounded-xl hover:opacity-90 transition-opacity"
          >
            Proceed to checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
