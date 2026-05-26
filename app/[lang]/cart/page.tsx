import { type SupportedLanguage } from "@/constants/settings";
import { Cart } from "@/features/cart/screens/Cart";

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Cart lang={lang} />;
}
