import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ImpactDashboard } from "../ui/ImpactDashboard";
import { ProfileHeader } from "../ui/ProfileHeader";

export async function EnvironmentalImpactScreen({
  lang,
}: {
  lang: SupportedLanguage;
}) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <ImpactDashboard />
      </PageLayout>
    </DictionaryProvider>
  );
}
