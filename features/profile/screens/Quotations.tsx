import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";

import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { QuotationsInbox } from "../ui/QuotationsInbox";

export async function QuotationsScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <QuotationsInbox />
      </PageLayout>
    </DictionaryProvider>
  );
}
