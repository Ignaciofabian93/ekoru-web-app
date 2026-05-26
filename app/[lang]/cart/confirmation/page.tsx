import { type SupportedLanguage } from "@/constants/settings";
import { Confirmation } from "@/features/cart/screens/Confirmation";

export default async function ConfirmationPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <Confirmation lang={lang} />;
}
