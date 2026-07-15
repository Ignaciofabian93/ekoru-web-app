import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { SubscriptionPlans } from "../ui/SubscriptionPlans";
import { ProfileHeader } from "../ui/ProfileHeader";

export async function SubscriptionScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ProfileHeader />}>
        <div className="mx-auto w-full max-w-6xl">
          <SubscriptionPlans />
        </div>
      </ScreenShell>
    </DictionaryProvider>
  );
}
