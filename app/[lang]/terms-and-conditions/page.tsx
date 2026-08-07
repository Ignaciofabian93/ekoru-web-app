import { type SupportedLanguage } from "@/constants/settings";
import { TermsAndConditions } from "@/features/terms-and-conditions/screens/TermsAndConditions";

export default async function TermsAndConditionsPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  return <TermsAndConditions lang={lang} />;
}
