"use client";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import type { SellerStorefrontProduct } from "@/features/seller/types";
import type { StoreListProduct } from "@/features/stores/types";
import type { ServiceNode } from "@/features/services/types";
import type { ServiceCardData } from "@/components/Card/ServiceCard/types";
import { useTranslation } from "@/i18n/context";
import { FileText, Layers, Package, Plus, Wrench } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import MarketplaceCard from "@/components/Card/MarketplaceCard/MarketplaceCard";
import ServiceCard from "@/components/Card/ServiceCard/ServiceCard";
import { StoreProductCard } from "@/features/stores/ui/StoreProductCard";
import { LinkButton } from "@/components/Links/LinkButton";
import { useBusinessProfile, useSellerType } from "@/store/useAuthStore";

import { useMyListings, type ListingStatus } from "../hooks/useMyListings";
import { useMyStoreListings } from "../hooks/useMyStoreListings";
import { useMyServiceListings } from "../hooks/useMyServiceListings";
import { useProductActions } from "../hooks/useProductActions";
import { useStoreProductActions } from "../hooks/useStoreProductActions";
import { useServiceActions } from "../hooks/useServiceActions";
import { NAMESPACE } from "../i18n";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { EditStoreProductDialog } from "./EditStoreProductDialog";
import { EditServiceDialog } from "./EditServiceDialog";
import { ListingsPanel, type EmptyCopy } from "./ListingsPanel";
import {
  Eye,
  Pencil,
  Power,
  PowerOff,
  ProductActionsMenu,
  Trash2,
  type ProductMenuAction,
} from "./ProductActionsMenu";
import { SectionCard } from "./SectionCard";
import { UnderlineTabs } from "@/components/UnderlineTabs/UnderlineTabs";

/** Which catalog a listing row belongs to. A seller sees one or more of these
 *  depending on their account: PERSON → marketplace; business → store and/or
 *  service per its BusinessType (RETAIL / SERVICES / MIXED). */
type ListingKind = "marketplace" | "store" | "service";

type EditTarget =
  | { kind: "marketplace"; item: SellerStorefrontProduct }
  | { kind: "store"; item: StoreListProduct }
  | { kind: "service"; item: ServiceNode };

type DeleteTarget = { kind: ListingKind; id: string | number; name: string };

function serviceToCardData(service: ServiceNode): ServiceCardData {
  return {
    id: service.id,
    name: service.name,
    description: service.description ?? undefined,
    image: service.images?.[0],
    providerName: service.seller?.profile?.businessName ?? undefined,
    providerLogo: service.seller?.profile?.logo ?? undefined,
    category: service.serviceCategory?.subCategory,
    priceFrom: service.basePrice ?? undefined,
    durationMinutes: service.duration ?? undefined,
    rating: service.averageRating ?? undefined,
    reviewsCount: service.reviewCount ?? undefined,
    isVerified: service.seller?.isVerified,
    isLiked: service.isLiked,
  };
}

export function MyListings() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const sellerType = useSellerType();
  const businessProfile = useBusinessProfile();

  // The seller's account decides which catalogs they manage here.
  const kinds = useMemo<ListingKind[]>(() => {
    if (sellerType === "STARTUP" || sellerType === "COMPANY") {
      switch (businessProfile?.businessType) {
        case "RETAIL":
          return ["store"];
        case "SERVICES":
          return ["service"];
        case "MIXED":
          return ["store", "service"];
        default:
          // businessType still hydrating — allow both, mirroring the publish flow.
          return ["store", "service"];
      }
    }
    return ["marketplace"];
  }, [sellerType, businessProfile?.businessType]);

  // Derive the effective kind during render (rather than syncing via an effect)
  // so a seller whose account hydrates after mount always lands on a valid kind.
  const [selectedKind, setSelectedKind] = useState<ListingKind | null>(null);
  const activeKind =
    selectedKind && kinds.includes(selectedKind) ? selectedKind : kinds[0];

  // Each kind remembers its own active/drafts filter.
  const [statusByKind, setStatusByKind] = useState<Record<ListingKind, ListingStatus>>({
    marketplace: "active",
    store: "active",
    service: "active",
  });
  const setStatusFor = (kind: ListingKind, status: ListingStatus) =>
    setStatusByKind((prev) => ({ ...prev, [kind]: status }));

  // Data — one hook per kind, each skipped unless the kind applies to the seller.
  const marketplace = useMyListings({
    status: statusByKind.marketplace,
    enabled: kinds.includes("marketplace"),
  });
  const store = useMyStoreListings({
    status: statusByKind.store,
    enabled: kinds.includes("store"),
  });
  const service = useMyServiceListings({
    status: statusByKind.service,
    enabled: kinds.includes("service"),
  });

  // Mutations — one hook per subgraph; all mounted, dispatched by target kind.
  const productActions = useProductActions();
  const storeActions = useStoreProductActions();
  const serviceActions = useServiceActions();

  const [editTarget, setEditTarget] = useState<EditTarget | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<DeleteTarget | null>(null);

  const menuLabel = t("dashboard.listings.actions.menu");

  function buildActions(opts: {
    isActive: boolean;
    onView?: () => void;
    onEdit: () => void;
    onToggle: () => void;
    onDelete: () => void;
  }): ProductMenuAction[] {
    const { isActive, onView, onEdit, onToggle, onDelete } = opts;
    return [
      ...(onView
        ? [
            {
              key: "view",
              label: t("dashboard.listings.actions.view"),
              icon: Eye,
              onSelect: onView,
            },
          ]
        : []),
      {
        key: "edit",
        label: t("dashboard.listings.actions.edit"),
        icon: Pencil,
        onSelect: onEdit,
      },
      {
        key: "toggle",
        label: isActive
          ? t("dashboard.listings.actions.deactivate")
          : t("dashboard.listings.actions.activate"),
        icon: isActive ? PowerOff : Power,
        onSelect: onToggle,
      },
      {
        key: "delete",
        label: t("dashboard.listings.actions.delete"),
        icon: Trash2,
        tone: "danger" as const,
        onSelect: onDelete,
      },
    ];
  }

  const statusLabel = (s: ListingStatus) => t(`dashboard.listings.status.${s}`);
  const publishAction = {
    actionLabel: t("dashboard.listings.publish"),
    onAction: () => router.push(`/${lang}/publish`),
  };

  const editingLoading =
    editTarget?.kind === "marketplace"
      ? productActions.updating
      : editTarget?.kind === "store"
        ? storeActions.updating
        : serviceActions.updating;

  const deletingLoading =
    deleteTarget?.kind === "marketplace"
      ? productActions.deleting
      : deleteTarget?.kind === "store"
        ? storeActions.deleting
        : serviceActions.deleting;

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const actions =
      deleteTarget.kind === "marketplace"
        ? productActions
        : deleteTarget.kind === "store"
          ? storeActions
          : serviceActions;
    const ok = await actions.remove(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  };

  const editing = editTarget;

  return (
    <SectionCard
      icon={Layers}
      tone="primary"
      title={t("dashboard.listings.title")}
      subtitle={t("dashboard.listings.subtitle")}
      headerRight={
        <div className="hidden sm:inline-flex">
          <LinkButton
            href={`/${lang}/publish`}
            icon={Plus}
            label={t("dashboard.listings.publish")}
            variant="primary"
          />
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Kind switch — only when the seller manages more than one catalog (MIXED). */}
        {kinds.length > 1 && (
          <UnderlineTabs
            tabs={kinds.map((k) => ({
              key: k,
              label:
                k === "service"
                  ? t("dashboard.listings.kinds.services")
                  : t("dashboard.listings.kinds.products"),
            }))}
            activeKey={activeKind}
            onSelect={(k) => setSelectedKind(k as ListingKind)}
            ariaLabel={t("dashboard.listings.title")}
            remeasureKey={lang}
          />
        )}

        {/* Mobile publish button */}
        <div className="sm:hidden">
          <LinkButton
            href={`/${lang}/publish`}
            icon={Plus}
            label={t("dashboard.listings.publish")}
          />
        </div>

        {activeKind === "marketplace" && (
          <ListingsPanel
            status={statusByKind.marketplace}
            counts={marketplace.counts}
            onStatusChange={(s) => setStatusFor("marketplace", s)}
            statusLabel={statusLabel}
            items={marketplace.products}
            loading={marketplace.loading}
            remeasureKey={lang}
            renderItem={(p) => (
              <MarketplaceCard
                key={p.id}
                product={p}
                lang={lang}
                actions={
                  <ProductActionsMenu
                    ariaLabel={menuLabel}
                    actions={buildActions({
                      isActive: Boolean(p.isActive),
                      onView: () => router.push(`/${lang}/product/${p.id}`),
                      onEdit: () => setEditTarget({ kind: "marketplace", item: p }),
                      onToggle: () => productActions.toggleActive(p.id, !p.isActive),
                      onDelete: () =>
                        setDeleteTarget({ kind: "marketplace", id: p.id, name: p.name }),
                    })}
                  />
                }
              />
            )}
            emptyActive={{
              icon: Package,
              title: t("dashboard.listings.empty.title"),
              description: t("dashboard.listings.empty.description"),
              ...publishAction,
            }}
            emptyDrafts={{
              icon: FileText,
              title: t("dashboard.listings.emptyDrafts.title"),
              description: t("dashboard.listings.emptyDrafts.description"),
            }}
          />
        )}

        {activeKind === "store" && (
          <ListingsPanel
            status={statusByKind.store}
            counts={store.counts}
            onStatusChange={(s) => setStatusFor("store", s)}
            statusLabel={statusLabel}
            items={store.products}
            loading={store.loading}
            remeasureKey={lang}
            renderItem={(p) => {
              const isActive = p.isActive !== false;
              return (
                <StoreProductCard
                  key={p.id}
                  product={p}
                  lang={lang}
                  actions={
                    <ProductActionsMenu
                      ariaLabel={menuLabel}
                      actions={buildActions({
                        isActive,
                        onView: () => router.push(`/${lang}/store-product/${p.id}`),
                        onEdit: () => setEditTarget({ kind: "store", item: p }),
                        onToggle: () => storeActions.toggleActive(p.id, !isActive),
                        onDelete: () =>
                          setDeleteTarget({ kind: "store", id: p.id, name: p.name }),
                      })}
                    />
                  }
                />
              );
            }}
            emptyActive={{
              icon: Package,
              title: t("dashboard.listings.empty.title"),
              description: t("dashboard.listings.empty.description"),
              ...publishAction,
            }}
            emptyDrafts={{
              icon: FileText,
              title: t("dashboard.listings.emptyDrafts.title"),
              description: t("dashboard.listings.emptyDrafts.description"),
            }}
          />
        )}

        {activeKind === "service" && (
          <ListingsPanel
            status={statusByKind.service}
            counts={service.counts}
            onStatusChange={(s) => setStatusFor("service", s)}
            statusLabel={statusLabel}
            items={service.services}
            loading={service.loading}
            remeasureKey={lang}
            renderItem={(s) => {
              const isActive = s.isActive !== false;
              return (
                <ServiceCard
                  key={s.id}
                  service={serviceToCardData(s)}
                  labels={{
                    verified: t("favorites.serviceCard.verified"),
                    priceFromPrefix: t("favorites.serviceCard.priceFrom"),
                  }}
                  actions={
                    <ProductActionsMenu
                      ariaLabel={menuLabel}
                      actions={buildActions({
                        isActive,
                        onEdit: () => setEditTarget({ kind: "service", item: s }),
                        onToggle: () => serviceActions.toggleActive(s.id, !isActive),
                        onDelete: () =>
                          setDeleteTarget({ kind: "service", id: s.id, name: s.name }),
                      })}
                    />
                  }
                />
              );
            }}
            emptyActive={
              {
                icon: Wrench,
                title: t("dashboard.listings.emptyService.title"),
                description: t("dashboard.listings.emptyService.description"),
                ...publishAction,
              } satisfies EmptyCopy
            }
            emptyDrafts={{
              icon: FileText,
              title: t("dashboard.listings.emptyServiceDrafts.title"),
              description: t("dashboard.listings.emptyServiceDrafts.description"),
            }}
          />
        )}
      </div>

      {editing?.kind === "marketplace" && (
        <EditProductDialog
          key={editing.item.id}
          isOpen
          product={editing.item}
          loading={editingLoading}
          onClose={() => setEditTarget(null)}
          onSave={async (patch) => {
            const ok = await productActions.update(editing.item.id, patch);
            if (ok) setEditTarget(null);
          }}
        />
      )}
      {editing?.kind === "store" && (
        <EditStoreProductDialog
          key={editing.item.id}
          isOpen
          product={editing.item}
          loading={editingLoading}
          onClose={() => setEditTarget(null)}
          onSave={async (patch) => {
            const ok = await storeActions.update(editing.item.id, patch);
            if (ok) setEditTarget(null);
          }}
        />
      )}
      {editing?.kind === "service" && (
        <EditServiceDialog
          key={editing.item.id}
          isOpen
          service={editing.item}
          loading={editingLoading}
          onClose={() => setEditTarget(null)}
          onSave={async (patch) => {
            const ok = await serviceActions.update(editing.item.id, patch);
            if (ok) setEditTarget(null);
          }}
        />
      )}
      {deleteTarget && (
        <DeleteProductDialog
          isOpen
          productName={deleteTarget.name}
          loading={deletingLoading}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </SectionCard>
  );
}
