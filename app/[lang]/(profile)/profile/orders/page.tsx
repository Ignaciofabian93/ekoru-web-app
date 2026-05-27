import { hasLocale } from "@/constants/settings";
import { OrdersScreen } from "@/features/profile/screens/Orders";
import { notFound } from "next/navigation";

export default async function Orders({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <OrdersScreen lang={lang} />;
}
