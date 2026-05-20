import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { Settings } from "../ui/Settings";
import ScreenHeader from "@/components/ScreenHeader/ScreenHeader";

export async function SettingsScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <main className="flex-1">
        <Navigation lang={lang} />
        <ScreenHeader
          title="Configuración"
          subtitle="Personaliza tu experiencia y gestiona tus preferencias."
        />
        <Settings />
      </main>
    </DictionaryProvider>
  );
}
