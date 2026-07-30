import { hasLocale } from "@/constants/settings";
import { DealsScreen } from "@/features/deals/ui/DealsScreen";
import { notFound } from "next/navigation";

export default async function DealsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  return <DealsScreen />;
}
