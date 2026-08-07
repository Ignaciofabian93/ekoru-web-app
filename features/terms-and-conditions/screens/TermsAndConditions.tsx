import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getTermsAndConditionsDictionary, NAMESPACE } from "../i18n";
import { TermsContent } from "../ui/TermsContent";
import { TermsHero } from "../ui/TermsHero";
import { PageLayout } from "@/components/Layout";

export async function TermsAndConditions({ lang }: { lang: SupportedLanguage }) {
  const dict = await getTermsAndConditionsDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<TermsHero />} width="narrow">
        <TermsContent />
      </PageLayout>
    </DictionaryProvider>
  );
}
