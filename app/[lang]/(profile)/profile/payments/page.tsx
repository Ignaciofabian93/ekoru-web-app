import { notFound } from "next/navigation";

import { hasLocale } from "@/constants/settings";
import { PayoutSetupScreen } from "@/features/profile/screens/PayoutSetup";

// Also Mercado Pago's OAuth redirect target: it lands on /profile/payments?code=…&state=…
// and the proxy adds the language prefix, keeping the query.
export default async function Payments({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();

  return <PayoutSetupScreen lang={lang} />;
}
