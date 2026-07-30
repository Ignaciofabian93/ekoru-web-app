import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { Details } from "../ui/Details";
import { Account } from "../ui/Account";
// import { ActionCenter } from "../ui/ActionCenter";
// import { ActivitySnapshot } from "../ui/ActivitySnapshot";
import { ImpactSnapshot } from "../ui/ImpactSnapshot";
import { MyListings } from "../ui/MyListings";
import { Logout } from "../ui/Logout";
import { Grid, PageLayout, Stack } from "@/components/Layout";

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
      <PageLayout hero={<ProfileHeader />} width="default">
        {/* <ActionCenter /> */}
        <Grid cols={1} lg={4} gap={5}>
          <Stack gap={5} className="lg:col-span-2">
            {/* <ActivitySnapshot /> */}
            <Details />
            <Account />
            <ImpactSnapshot />
          </Stack>
          <Stack as="aside" gap={5} className="lg:col-span-2">
            <MyListings />
          </Stack>
        </Grid>
        <Logout />
      </PageLayout>
    </DictionaryProvider>
  );
}
