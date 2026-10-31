import { hasLocale } from "@/constants/settings";
import { QuotationsScreen } from "@/features/profile/screens/Quotations";
import { notFound } from "next/navigation";

export default async function Quotes({
  params,
  searchParams,
}: {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { lang } = await params;
  // The profile menu links each side straight to its tab (?tab=…).
  const { tab } = await searchParams;
  if (!hasLocale(lang)) notFound();

  return <QuotationsScreen lang={lang} tab={tab} />;
}
