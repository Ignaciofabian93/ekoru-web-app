import { notFound } from "next/navigation";

import { hasLocale } from "@/constants/settings";
import { Seller } from "@/features/seller/screens/Seller";

export default async function SellerPage({
  params,
}: {
  params: Promise<{ lang: string; id: string }>;
}) {
  const { lang, id } = await params;
  if (!hasLocale(lang)) notFound();
  if (!id) notFound();

  return <Seller id={id} lang={lang} />;
}
