"use client";
import { LocateFixed, MapPin } from "lucide-react";
import { useSyncExternalStore } from "react";
import {
  MarketplaceCard,
  ServiceProviderCard,
  StoreProductCard,
  StoresCard,
} from "@/components/Cards";
import { ProductScroller } from "@/components/Cards/ProductScroller";
import { Section } from "@/components/Layout";
import {
  locationStatusMessage,
  useComunaDetection,
} from "@/components/Navigation/hooks/useComunaDetection";
import { NAMESPACE as NAVIGATION_NAMESPACE } from "@/components/Navigation/i18n";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  EXPLORE_RADIUS_OPTIONS_KM,
  type ExploreRadiusKm,
  type SupportedLanguage,
} from "@/constants/settings";
import { useExploreLocation, useExploreRadius } from "@/hooks/useExploreLocation";
import { useToast } from "@/hooks/useToast";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import { useNearbyMarketplaceProducts } from "../hooks/useMarketplaceProducts";
import { useNearbyCounties } from "../hooks/useNearbyCounties";
import { useServicesHomeData } from "../hooks/useServices";
import { useStoreProductsHomeData } from "../hooks/useStoreProducts";
import { useStoresHomeData } from "../hooks/useStores";
import { NearbyBusinessScroller, NearbyRail } from "./NearbyRail";
import { RadiusPicker } from "./RadiusPicker";

const noopSubscribe = () => () => {};

/**
 * False on the server and the first client paint, true after hydration. The
 * location lives in a cookie only the client reads, so rendering either branch
 * before then would flash the "choose your comuna" prompt at visitors who
 * already chose one.
 */
function useHydrated() {
  return useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false,
  );
}

/**
 * "Near you": marketplace items, stores, store products and service providers
 * from the comunas within the visitor's chosen radius of where they explore.
 *
 * Without a location it asks for the visitor's position instead (the
 * browser's prompt). The header's pill is the page's background detector, so
 * this one only detects on request.
 */
export function NearbySection({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { t: tNav } = useTranslation(NAVIGATION_NAMESPACE);
  const notify = useToast();
  const hydrated = useHydrated();
  const [location] = useExploreLocation();
  const [radius, setRadius] = useExploreRadius();
  const { status, detect } = useComunaDetection(lang, { background: false });
  const nearby = useNearbyCounties({ location, radiusKm: radius, language: lang });

  const title = t("nearby.title");
  const locating = status === "locating";

  /** Re-detects from the results view, where there is no inline status line. */
  const refresh = async () => {
    if (locating) return;
    const result = await detect();
    if (result !== "detected") {
      notify.warning(locationStatusMessage(result, undefined, tNav), {
        toastId: "explore-location",
      });
    }
  };

  if (!hydrated) {
    return (
      <Section ariaLabel={title}>
        <div
          aria-hidden
          className="h-36 animate-pulse rounded-xl bg-background-secondary"
        />
      </Section>
    );
  }

  if (!location || !nearby.hasOrigin) {
    return (
      <Section ariaLabel={title}>
        <NearbyPrompt status={status} onDetect={() => void detect()} />
      </Section>
    );
  }

  const widerRadius = EXPLORE_RADIUS_OPTIONS_KM.find((km) => km > radius);

  return (
    <Section ariaLabel={title}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 flex-col gap-1">
          <Title level="h2" size="h4" weight="semibold">
            {title}
          </Title>
          <Text variant="p" size="base" color="secondary">
            {t("nearby.subtitle", { radius: String(radius), county: location.county })}{" "}
            <button
              type="button"
              onClick={() => void refresh()}
              aria-busy={locating}
              className="cursor-pointer rounded-sm font-semibold text-secondary-dark underline outline-none"
            >
              {locating ? tNav("location.locating") : t("nearby.refresh")}
            </button>
          </Text>
        </div>
        <RadiusPicker value={radius} onChange={setRadius} />
      </div>

      {nearby.error ? (
        <Text variant="p" size="sm" color="secondary">
          {t("nearby.error")}
        </Text>
      ) : (
        <NearbyResults
          lang={lang}
          countyIds={nearby.countyIds}
          radius={radius}
          county={location.county}
          onWiden={widerRadius ? () => setRadius(widerRadius) : undefined}
          widerRadius={widerRadius}
        />
      )}
    </Section>
  );
}

/** Asks for the visitor's position. */
function NearbyPrompt({
  status,
  onDetect,
}: {
  status: ReturnType<typeof useComunaDetection>["status"];
  onDetect: () => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const { t: tNav } = useTranslation(NAVIGATION_NAMESPACE);

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-border-light bg-primary-light-bg p-5 md:flex-row md:items-center md:gap-6 md:p-6">
      <span
        aria-hidden
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-primary-dark"
      >
        <MapPin size={24} strokeWidth={2} />
      </span>
      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Title level="h2" size="h5" weight="semibold">
          {t("nearby.prompt.title")}
        </Title>
        <Text variant="p" size="sm" color="secondary">
          {t("nearby.prompt.text")}
        </Text>
        {/* Says why the location didn't work (denied, unsupported…). */}
        <p role="status" className="font-sans text-sm font-semibold text-primary-dark">
          {status === "detected" ? "" : locationStatusMessage(status, undefined, tNav)}
        </p>
      </div>
      <div className="flex shrink-0">
        <Button
          text={t("nearby.prompt.useLocation")}
          leftIcon={LocateFixed}
          loading={status === "locating"}
          onPress={onDetect}
        />
      </div>
    </div>
  );
}

/**
 * The four rails. Their queries wait for the comuna ids (`countyIds`), and
 * when every rail comes back empty a single message offers a wider radius
 * instead of four "nothing here" lines.
 */
function NearbyResults({
  lang,
  countyIds,
  radius,
  county,
  onWiden,
  widerRadius,
}: {
  lang: SupportedLanguage;
  countyIds?: number[];
  radius: ExploreRadiusKm;
  county: string;
  onWiden?: () => void;
  widerRadius?: ExploreRadiusKm;
}) {
  const { t } = useTranslation(NAMESPACE);
  const skip = !countyIds;
  // The marketplace splits in two rails, the way the home page's own
  // highlights do: items only for sale, then items open to a swap.
  const forSale = useNearbyMarketplaceProducts({
    countyIds,
    isExchangeable: false,
    pageSize: 12,
  });
  const forExchange = useNearbyMarketplaceProducts({
    countyIds,
    isExchangeable: true,
    pageSize: 12,
  });
  const stores = useStoresHomeData({ language: lang, countyIds, skip });
  const storeProducts = useStoreProductsHomeData({ countyIds, skip });
  const services = useServicesHomeData({ language: lang, countyIds, skip });

  const waiting = skip;
  const rails = [
    forSale.products,
    forExchange.products,
    stores.sellers,
    storeProducts.storeProducts,
    services.sellers,
  ];
  const anyLoading =
    waiting ||
    forSale.loading ||
    forExchange.loading ||
    stores.loading ||
    storeProducts.loading ||
    services.loading;

  if (!anyLoading && rails.every((items) => items.length === 0)) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-xl border border-dashed border-border-light p-5">
        <Text variant="p" size="base" weight="semibold">
          {t("nearby.empty.title", { radius: String(radius), county })}
        </Text>
        <Text variant="p" size="sm" color="secondary">
          {t(onWiden ? "nearby.empty.text" : "nearby.empty.textAtMax")}
        </Text>
        {onWiden && widerRadius && (
          <Button
            text={t("nearby.empty.widen", { radius: String(widerRadius) })}
            variant="outline"
            size="sm"
            onPress={onWiden}
          />
        )}
      </div>
    );
  }

  const empty = (
    <Text variant="p" size="sm" color="secondary">
      {t("nearby.railEmpty", { radius: String(radius) })}
    </Text>
  );

  return (
    <div className="flex flex-col gap-8">
      <NearbyRail title={t("nearby.rails.marketplaceSale")}>
        <ProductScroller
          items={forSale.products}
          loading={waiting || forSale.loading}
          empty={empty}
          renderItem={(product, i) => (
            <MarketplaceCard priority={i < 4} product={product} lang={lang} />
          )}
        />
      </NearbyRail>
      <NearbyRail title={t("nearby.rails.marketplaceExchange")}>
        <ProductScroller
          items={forExchange.products}
          loading={waiting || forExchange.loading}
          empty={empty}
          renderItem={(product) => <MarketplaceCard product={product} lang={lang} />}
        />
      </NearbyRail>
      <NearbyRail title={t("nearby.rails.stores")}>
        <NearbyBusinessScroller
          items={stores.sellers}
          loading={waiting || stores.loading}
          empty={empty}
          renderItem={(seller) => (
            <StoresCard
              store={seller}
              lang={lang}
              productCount={stores.productCounts[seller.id]}
            />
          )}
        />
      </NearbyRail>
      <NearbyRail title={t("nearby.rails.storeProducts")}>
        <ProductScroller
          items={storeProducts.storeProducts}
          loading={waiting || storeProducts.loading}
          empty={empty}
          renderItem={(product, i) => (
            <StoreProductCard product={product} lang={lang} priority={i < 2} />
          )}
        />
      </NearbyRail>
      <NearbyRail title={t("nearby.rails.services")}>
        <NearbyBusinessScroller
          items={services.sellers}
          loading={waiting || services.loading}
          empty={empty}
          renderItem={(seller) => (
            <ServiceProviderCard
              provider={seller}
              lang={lang}
              serviceCount={services.serviceCounts[seller.id]}
            />
          )}
        />
      </NearbyRail>
    </div>
  );
}
