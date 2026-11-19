import { FEATURES } from "@/constants/features";
import { type SupportedLanguage } from "@/constants/settings";
import { ExploreLocationSeedProvider } from "@/context/ExploreLocationContext";
import { DictionaryProvider } from "@/i18n/context";
import {
  getMarketplaceDictionary,
  NAMESPACE as MARKETPLACE_NAMESPACE,
} from "@/features/marketplace/i18n";
import { getExploreLocationSeed } from "../api/getExploreLocationSeed";
import { getHomeDictionary, NAMESPACE } from "../i18n";
import { HomeHero } from "../ui/HomeHero";
import { StoresHighlight } from "../ui/StoresHighlight";
import { MarketplaceHighlight } from "../ui/MarketplaceHighlight";
import { ServicesHighlight } from "../ui/ServicesHighlight";
import { AdBannerSection } from "../ui/AdBannerSection";
import { StoreProductsHighlight } from "../ui/StoreProductsHighlight";
import { BlogHighlight } from "../ui/BlogHighlight";
import { NearbySection } from "../ui/NearbySection";
import { PageLayout } from "@/components/Layout";

export async function MainScreen({ lang }: { lang: SupportedLanguage }) {
  const [dict, marketplaceDict, exploreSeed] = await Promise.all([
    getHomeDictionary(lang),
    getMarketplaceDictionary(lang),
    getExploreLocationSeed(),
  ]);

  return (
    <DictionaryProvider
      dictionary={{ [NAMESPACE]: dict, [MARKETPLACE_NAMESPACE]: marketplaceDict }}
    >
      {/* Wraps the navbar too: its "Exploring in" pill reads the same cookie. */}
      <ExploreLocationSeedProvider seed={exploreSeed}>
        <PageLayout hero={<HomeHero lang={lang} />} width="wide">
          <NearbySection lang={lang} />
          <AdBannerSection lang={lang} variant="green" domain="marketplace" />
          <MarketplaceHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="sky" domain="stores" />
          <StoresHighlight lang={lang} />
          <StoreProductsHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="charcoal" domain="services" />
          <ServicesHighlight lang={lang} />
          <AdBannerSection lang={lang} variant="emerald" domain="recycle" />
          {FEATURES.blog.available && (
            <>
              <AdBannerSection lang={lang} variant="teal" domain="blog" />
              <BlogHighlight lang={lang} />
            </>
          )}
        </PageLayout>
      </ExploreLocationSeedProvider>
    </DictionaryProvider>
  );
}
