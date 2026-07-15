import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { Settings } from "../ui/Settings";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { ProfileHeader } from "../ui/ProfileHeader";

export async function SettingsScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ProfileHeader />}>
        <div className="mx-auto w-full max-w-6xl">
          <Settings />
        </div>
      </ScreenShell>
    </DictionaryProvider>
  );
}
