import { hasLocale } from "@/constants/settings";
import { ExchangesScreen } from "@/features/profile/screens/Exchanges";
import { notFound } from "next/navigation";

export default async function Exchanges({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <ExchangesScreen lang={lang} />;
}
