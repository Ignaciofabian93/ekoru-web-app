import { type SupportedLanguage } from "@/constants/settings";
import { getCurrentTerms } from "@/features/terms-and-conditions/api/getCurrentTerms";
import { TermsAndConditions } from "@/features/terms-and-conditions/screens/TermsAndConditions";

// The text is edited in the panel (LEG-1), so it is read on each visit rather
// than frozen into the build.
export const dynamic = "force-dynamic";

export default async function TermsAndConditionsPage({
  params,
}: {
  params: Promise<{ lang: SupportedLanguage }>;
}) {
  const { lang } = await params;
  const terms = await getCurrentTerms(lang);
  return <TermsAndConditions lang={lang} terms={terms} />;
}
