import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { ProfileHero } from "../ui/ProfileHero";
import { SubscriptionPlans } from "../ui/SubscriptionPlans";

export async function SubscriptionScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell
        lang={lang}
        nav={<Navigation lang={lang} />}
        hero={
          <ProfileHero
            icon="subscription"
            titleKey="subscription.screenTitle"
            subtitleKey="subscription.screenSubtitle"
          />
        }
      >
        <SubscriptionPlans />
      </ScreenShell>
    </DictionaryProvider>
  );
}
