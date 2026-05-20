import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { Logout } from "../ui/Logout";
import { Details } from "../ui/Details";
import { Account } from "../ui/Account";

export async function ProfileScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <main className="flex-1">
        <Navigation lang={lang} />
        <ProfileHeader />
        <Details />
        <Account />
        <Logout />
      </main>
    </DictionaryProvider>
  );
}
