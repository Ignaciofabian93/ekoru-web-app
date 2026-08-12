import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import { PageLayout } from "@/components/Layout";

import { getProfileDictionary, NAMESPACE } from "../i18n";
import { BookingsList } from "../ui/BookingsList";
import { ProfileHeader } from "../ui/ProfileHeader";

export async function BookingsScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <PageLayout hero={<ProfileHeader />} width="default">
        <BookingsList />
      </PageLayout>
    </DictionaryProvider>
  );
}
