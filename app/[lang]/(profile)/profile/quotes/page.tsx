import { hasLocale } from "@/constants/settings";
import { QuotationsScreen } from "@/features/profile/screens/Quotations";
import { notFound } from "next/navigation";

export default async function Quotes({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <QuotationsScreen lang={lang} />;
}
