import { CartClient } from "@/features/cart/ui/CartClient";

export default async function CartPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  return <CartClient lang={lang} />;
}
