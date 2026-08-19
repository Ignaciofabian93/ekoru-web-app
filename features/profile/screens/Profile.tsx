import { type SupportedLanguage } from "@/constants/settings";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import {
  getPublishDictionary,
  NAMESPACE as PUBLISH_NAMESPACE,
} from "@/features/publish/i18n";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ProfileHeader } from "../ui/ProfileHeader";
import { Details } from "../ui/Details";
import { Account } from "../ui/Account";
import { ImpactSnapshot } from "../ui/ImpactSnapshot";
import { MyListings } from "../ui/MyListings";
import { Logout } from "../ui/Logout";
import { Grid, PageLayout, Stack } from "@/components/Layout";

export async function ProfileScreen({ lang }: { lang: SupportedLanguage }) {
  // MyListings reuses MarketplaceCard, which translates from the marketplace
  // namespace, and its edit dialog reuses the publish wizard's field components
  // (category cascade, condition, exchange interests), which translate from the
  // publish namespace — load all three so every label resolves.
  const [dict, marketplaceDict, publishDict] = await Promise.all([
    getProfileDictionary(lang),
    getMarketplaceDictionary(lang),
    getPublishDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{
        [NAMESPACE]: dict,
        [MARKETPLACE_NAMESPACE]: marketplaceDict,
        [PUBLISH_NAMESPACE]: publishDict,
      }}
    >
      <PageLayout hero={<ProfileHeader />} width="default">
        <Grid cols={1} lg={5} gap={4}>
          <Stack gap={4} className="lg:col-span-3">
            <MyListings />
          </Stack>
          <Stack as="aside" gap={4} className="lg:col-span-2">
            <ImpactSnapshot />
            <Account />
            <Details />
            <Logout />
          </Stack>
        </Grid>
      </PageLayout>
    </DictionaryProvider>
  );
}
