import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { ProfileHero } from "../ui/ProfileHero";
import { OrdersList } from "../ui/OrdersList";

export async function OrdersScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell
        nav={<Navigation lang={lang} />}
        hero={
          <ProfileHero
            icon="orders"
            titleKey="orders.screenTitle"
            subtitleKey="orders.screenSubtitle"
          />
        }
      >
        <OrdersList />
      </ScreenShell>
    </DictionaryProvider>
  );
}
