import { type SupportedLanguage } from "@/constants/settings";
import {
  getDealsDictionary,
  NAMESPACE as DEALS_NAMESPACE,
} from "@/features/deals/i18n";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ExchangeInbox } from "../ui/ExchangeInbox";
import { ProfileHeader } from "../ui/ProfileHeader";
import { PageLayout } from "@/components/Layout";

export async function ExchangesScreen({ lang }: { lang: SupportedLanguage }) {
  // The inbox renders the shared DealCard, so it needs the deals copy too.
  const [dict, dealsDict] = await Promise.all([
    getProfileDictionary(lang),
    getDealsDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: dict, [DEALS_NAMESPACE]: dealsDict }}
    >
      <PageLayout hero={<ProfileHeader />} width="default">
        <ExchangeInbox />
      </PageLayout>
    </DictionaryProvider>
  );
}
