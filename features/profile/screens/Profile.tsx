import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { Details } from "../ui/Details";
import { Account } from "../ui/Account";
import { ScreenShell } from "@/components/Layout/ScreenShell";
// import { ActionCenter } from "../ui/ActionCenter";
// import { ActivitySnapshot } from "../ui/ActivitySnapshot";
import { ImpactSnapshot } from "../ui/ImpactSnapshot";
import { MyListings } from "../ui/MyListings";
import { Logout } from "../ui/Logout";
import { ContentLayout } from "@/components/Layout/ContentLayout";

export async function ProfileScreen({ lang }: { lang: SupportedLanguage }) {
  // MyListings reuses MarketplaceCard, which translates from the marketplace
  // namespace — load both dictionaries so its badges and labels resolve.
  const [dict, marketplaceDict] = await Promise.all([
    getProfileDictionary(lang),
    getMarketplaceDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: dict, [MARKETPLACE_NAMESPACE]: marketplaceDict }}
    >
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ProfileHeader />}>
        <ContentLayout>
          {/* <ActionCenter /> */}
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-4 mt-6">
            <div className="flex flex-col gap-5 lg:col-span-2">
              {/* <ActivitySnapshot /> */}
              <Details />
              <Account />
              <ImpactSnapshot />
            </div>
            <aside className="flex flex-col gap-5 lg:col-span-2">
              <MyListings />
            </aside>
          </div>
          <div className="w-full max-w-6xl mx-auto mt-12">
            <Logout />
          </div>
        </ContentLayout>
      </ScreenShell>
    </DictionaryProvider>
  );
}
