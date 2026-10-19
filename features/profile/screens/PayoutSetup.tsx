import { PageLayout } from "@/components/Layout";
import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";

import { getProfileDictionary, NAMESPACE } from "../i18n";
import { PayoutSetup } from "../ui/PayoutSetup";
import { ProfileHeader } from "../ui/ProfileHeader";

/** Where a business connects the Mercado Pago account it is paid into (WEB-2). */
export async function PayoutSetupScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <PayoutSetup />
      </PageLayout>
    </DictionaryProvider>
  );
}
