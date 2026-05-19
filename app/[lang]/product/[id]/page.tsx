import { getProductById } from "@/data/products";
import { ProductDetail } from "@/features/marketplace/ui/ProductDetail";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  const product = getProductById(id);

  if (!product) notFound();

  return (
    <div className="flex flex-col flex-1">
      {/* Back nav */}
      <div className="px-4 py-3 border-b border-border bg-surface">
        <Link href={`/${lang}/marketplace`} className="text-sm text-primary font-medium hover:underline">
          ← Back to Marketplace
        </Link>
      </div>
      <ProductDetail product={product} lang={lang} />
    </div>
  );
}
