import { type SupportedLanguage } from "@/constants/settings";
import { Checkout } from "@/features/cart/screens/Checkout";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Checkout lang={lang} />;
}
