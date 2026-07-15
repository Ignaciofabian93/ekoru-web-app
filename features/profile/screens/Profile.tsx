import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { Details } from "../ui/Details";
import { Account } from "../ui/Account";
import { ScreenShell } from "@/components/Layout/ScreenShell";
// import { ActionCenter } from "../ui/ActionCenter";
import { ActivitySnapshot } from "../ui/ActivitySnapshot";
import { ImpactSnapshot } from "../ui/ImpactSnapshot";
import { MyListings } from "../ui/MyListings";
import { Logout } from "../ui/Logout";

export async function ProfileScreen({ lang }: { lang: SupportedLanguage }) {
  const dict = await getProfileDictionary(lang);

  return (
    <DictionaryProvider dictionary={{ [NAMESPACE]: dict }}>
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ProfileHeader />}>
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-5">
          {/* <ActionCenter /> */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
            <div className="flex flex-col gap-5 lg:col-span-2">
              <ActivitySnapshot />
              <MyListings />
            </div>
            <aside className="flex flex-col gap-5">
              <Account />
              <ImpactSnapshot />
              <Details />
            </aside>
          </div>
          <div className="w-full max-w-6xl mx-auto mt-12">
            <Logout />
          </div>
        </div>
      </ScreenShell>
    </DictionaryProvider>
  );
}
