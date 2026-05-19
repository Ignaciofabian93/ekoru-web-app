import { DUMMY_PRODUCTS, formatPrice } from "@/data/products";
import { ImageOff, Star } from "lucide-react";
import Link from "next/link";

export function ProductsHighlight({ lang }: { lang: string }) {
  const products = DUMMY_PRODUCTS.slice(0, 4);

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">Featured Products</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">Handpicked sustainable finds</p>
        </div>
        <Link href={`/${lang}/marketplace`} className="text-sm font-semibold text-primary hover:underline">
          See all
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/${lang}/product/${product.id}`}
            className="group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-background-secondary flex items-center justify-center">
              <ImageOff size={32} className="text-foreground-tertiary" strokeWidth={1.5} />
            </div>
            <div className="p-3">
              {product.brand && (
                <p className="text-xs text-foreground-tertiary uppercase tracking-wide truncate">{product.brand}</p>
              )}
              <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2 leading-snug">{product.name}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-sm font-bold text-primary">{formatPrice(product.price)}</span>
                {product.rating && (
                  <span className="flex items-center gap-0.5 text-xs text-foreground-secondary">
                    <Star size={11} className="text-amber-400" fill="currentColor" strokeWidth={0} />
                    {product.rating}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
