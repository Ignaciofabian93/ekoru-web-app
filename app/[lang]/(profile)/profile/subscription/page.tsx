import { hasLocale } from "@/constants/settings";
import { SubscriptionScreen } from "@/features/profile/screens/Subscription";
import { notFound } from "next/navigation";

export default async function Subscription({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <SubscriptionScreen lang={lang} />;
}
