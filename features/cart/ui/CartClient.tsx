"use client";

import { formatPrice } from "@/data/products";
import useCartStore from "@/store/useCartStore";
import type { CartItem } from "@/store/useCartStore";
import {
  ImageOff,
  Minus,
  Plus,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import Link from "next/link";

function EmptyCart({ lang }: { lang: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-24 gap-4 text-center px-4">
      <ShoppingCart size={60} className="text-foreground-muted" strokeWidth={1.5} />
      <p className="text-lg font-semibold text-foreground">Your cart is empty</p>
      <p className="text-sm text-foreground-secondary max-w-xs">
        Add products from the marketplace to get started.
      </p>
      <Link
        href={`/${lang}/marketplace`}
        className="mt-2 bg-primary text-white font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-opacity"
      >
        Go to Marketplace
      </Link>
    </div>
  );
}

function CartItemCard({ item }: { item: CartItem }) {
  const { removeItem, updateQuantity } = useCartStore();

  return (
    <div className="flex bg-surface border border-border rounded-xl overflow-hidden">
      <div className="w-24 h-24 bg-background-secondary flex items-center justify-center shrink-0">
        <ImageOff size={24} className="text-foreground-muted" strokeWidth={1.5} />
      </div>

      <div className="flex-1 p-3 flex flex-col gap-1">
        {item.product.brand && (
          <p className="text-xs text-foreground-tertiary uppercase tracking-wide">{item.product.brand}</p>
        )}
        <p className="text-sm font-semibold text-foreground line-clamp-2 leading-snug">{item.product.name}</p>
        <p className="text-sm font-semibold text-primary mt-0.5">{formatPrice(item.product.price)}</p>

        <div className="flex items-center gap-2 mt-1.5">
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
            className="w-6 h-6 rounded-md border border-border-strong flex items-center justify-center hover:bg-background-secondary transition-colors"
          >
            <Minus size={12} strokeWidth={2} />
          </button>
          <span className="text-sm font-semibold min-w-[20px] text-center">{item.quantity}</span>
          <button
            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
            className="w-6 h-6 rounded-md border border-border-strong flex items-center justify-center hover:bg-background-secondary transition-colors"
          >
            <Plus size={12} strokeWidth={2} />
          </button>

          <div className="flex-1" />

          <button
            onClick={() => removeItem(item.product.id)}
            className="p-1 text-danger hover:bg-red-50 rounded transition-colors"
          >
            <Trash2 size={16} strokeWidth={1.8} />
          </button>
        </div>
      </div>
    </div>
  );
}

export function CartClient({ lang }: { lang: string }) {
  const { items, subtotal, clearCart } = useCartStore();

  if (items.length === 0) return <EmptyCart lang={lang} />;

  return (
    <div className="flex flex-col flex-1">
      <div className="flex-1 flex flex-col gap-3 px-4 py-6 max-w-xl mx-auto w-full">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-xl font-bold text-foreground">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-xs text-danger hover:underline"
          >
            Clear cart
          </button>
        </div>

        {items.map((item) => (
          <CartItemCard key={item.product.id} item={item} />
        ))}
      </div>

      {/* Footer summary */}
      <div className="sticky bottom-0 bg-surface border-t border-border px-4 py-4">
        <div className="max-w-xl mx-auto">
          <div className="flex justify-between items-center mb-3">
            <span className="text-foreground-secondary">Subtotal</span>
            <span className="text-xl font-bold text-foreground">{formatPrice(subtotal())}</span>
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
