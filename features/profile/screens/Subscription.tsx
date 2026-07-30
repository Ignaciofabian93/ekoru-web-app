import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { SubscriptionPlans } from "../ui/SubscriptionPlans";
import { ProfileHeader } from "../ui/ProfileHeader";
import { PageLayout } from "@/components/Layout";

export async function SubscriptionScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <SubscriptionPlans />
      </PageLayout>
    </DictionaryProvider>
  );
}
