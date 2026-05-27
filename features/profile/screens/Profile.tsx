import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { Details } from "../ui/Details";
import { Account } from "../ui/Account";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { ActionCenter } from "../ui/ActionCenter";
import { ActivitySnapshot } from "../ui/ActivitySnapshot";
import { ImpactSnapshot } from "../ui/ImpactSnapshot";
import { MyListings } from "../ui/MyListings";

export async function ProfileScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell nav={<Navigation lang={lang} />} hero={<ProfileHeader />}>
        <div className="flex flex-col gap-5">
          <ActionCenter />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <ActivitySnapshot />
            <ImpactSnapshot />
          </div>
          <MyListings />
          <Details />
          <Account />
        </div>
      </ScreenShell>
    </DictionaryProvider>
  );
}
