import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { ProfileHero } from "../ui/ProfileHero";
import { EnvironmentalImpactPanel } from "../ui/EnvironmentalImpactPanel";

export async function EnvironmentalImpactScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell
        lang={lang}
        nav={<Navigation lang={lang} />}
        hero={
          <ProfileHero
            icon="environmentalImpact"
            titleKey="environmentalImpact.screenTitle"
            subtitleKey="environmentalImpact.screenSubtitle"
          />
        }
      >
        <EnvironmentalImpactPanel />
      </ScreenShell>
    </DictionaryProvider>
  );
}
