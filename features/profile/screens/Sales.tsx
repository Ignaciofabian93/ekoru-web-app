import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { SalesList } from "../ui/SalesList";
import { ProfileHeader } from "../ui/ProfileHeader";
import { PageLayout } from "@/components/Layout";

/** Orders the signed-in seller received, with shipping actions (WEB-1). */
export async function SalesScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <SalesList />
      </PageLayout>
    </DictionaryProvider>
  );
}
