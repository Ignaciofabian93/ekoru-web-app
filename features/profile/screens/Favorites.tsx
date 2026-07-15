import { type SupportedLanguage } from "@/constants/settings";
import { Navigation } from "@/features/navigation/Navigation";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import {
  getStoresDictionary,
  NAMESPACE as STORE_NAMESPACE,
} from "@/features/stores/i18n";
import { DictionaryProvider } from "@/i18n/context";
import { getProfileDictionary, NAMESPACE } from "../i18n";
import { ScreenShell } from "@/components/Layout/ScreenShell";
import { FavoritesGrid } from "../ui/FavoritesGrid";
import { ProfileHeader } from "../ui/ProfileHeader";

export async function FavoritesScreen({ lang }: { lang: SupportedLanguage }) {
  // Favorites render the real marketplace/store cards, which translate from
  // their own namespaces — load those dictionaries alongside the profile one.
  const [dict, marketplaceDict, storeDict] = await Promise.all([
    getProfileDictionary(lang),
    getMarketplaceDictionary(lang),
    getStoresDictionary(lang),
  ]);

  return (
    <DictionaryProvider
      dictionary={{
        [NAMESPACE]: dict,
        [MARKETPLACE_NAMESPACE]: marketplaceDict,
        [STORE_NAMESPACE]: storeDict,
      }}
    >
      <ScreenShell lang={lang} nav={<Navigation lang={lang} />} hero={<ProfileHeader />}>
        <div className="mx-auto w-full max-w-6xl">
          <FavoritesGrid />
        </div>
      </ScreenShell>
    </DictionaryProvider>
  );
}
