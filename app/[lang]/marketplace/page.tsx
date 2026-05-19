import { MarketplaceClient } from "@/features/marketplace/ui/MarketplaceClient";

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  return (
    <main className="flex-1 bg-background">
      {/* Hero */}
      <div className="bg-linear-to-br from-primary-dark to-primary px-4 py-10">
        <div className="max-w-3xl mx-auto text-white">
          <h1 className="text-3xl font-bold">Marketplace</h1>
          <p className="mt-2 text-white/80">Buy & sell pre-loved sustainable items</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        <MarketplaceClient lang={lang} />
      </div>
    </main>
  );
}
