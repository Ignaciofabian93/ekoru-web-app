import { hasLocale } from "@/constants/settings";
import { Marketplace } from "@/features/marketplace/screens/Marketplace";
import { notFound } from "next/navigation";

export default async function MarketplacePage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <Marketplace lang={lang} />;
}
