import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { EnvironmentalImpactPanel } from "../ui/EnvironmentalImpactPanel";
import { ProfileHeader } from "../ui/ProfileHeader";
import { PageLayout } from "@/components/Layout";

export async function EnvironmentalImpactScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <EnvironmentalImpactPanel />
      </PageLayout>
    </DictionaryProvider>
  );
}
