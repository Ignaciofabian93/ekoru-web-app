"use client";
import { Text } from "@/components/Text/Text";
import { Title } from "@/components/Title/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import type { SellerStorefrontProduct } from "@/features/seller/types";
import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";
import clsx from "clsx";
import { ChevronRight, Layers, Package, Plus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useMyListings, type ListingStatus } from "../hooks/useMyListings";
import {
  useProductActions,
  type UpdateProductPatch,
} from "../hooks/useProductActions";
import { NAMESPACE } from "../i18n";
import { DeleteProductDialog } from "./DeleteProductDialog";
import { EditProductDialog } from "./EditProductDialog";
import { EmptyState } from "./EmptyState";
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

const STATUSES: ListingStatus[] = ["active", "sold", "drafts"];

function formatPrice(value: number, lang: string) {
  try {
    return new Intl.NumberFormat(lang, {
      maximumFractionDigits: 0,
    }).format(value);
  } catch {
    return String(value);
  }
}

export function MyListings() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const router = useRouter();
  const lang = params.lang ?? DEFAULT_LANGUAGE;

  const [status, setStatus] = useState<ListingStatus>("active");
  const { categories, counts, loading } = useMyListings({ status });

  const { remove, toggleActive, update, deleting, updating } = useProductActions();

  // Editing / deleting target products. Kept here (not per-card) so only one
  // dialog ever mounts, and the menu can stay lightweight.
  const [editTarget, setEditTarget] = useState<SellerStorefrontProduct | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SellerStorefrontProduct | null>(null);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    const ok = await remove(deleteTarget.id);
    if (ok) setDeleteTarget(null);
  };

  const handleEditSave = async (patch: UpdateProductPatch) => {
    if (!editTarget) return;
    const ok = await update(editTarget.id, patch);
    if (ok) setEditTarget(null);
  };

  const buildActions = (product: SellerStorefrontProduct): ProductMenuAction[] => [
    {
      key: "view",
      label: t("dashboard.listings.actions.view"),
      icon: Eye,
      onSelect: () => router.push(`/${lang}/product/${product.id}`),
    },
    {
      key: "edit",
      label: t("dashboard.listings.actions.edit"),
      icon: Pencil,
      onSelect: () => setEditTarget(product),
    },
    {
      key: "toggle",
      label: product.isActive
        ? t("dashboard.listings.actions.deactivate")
        : t("dashboard.listings.actions.activate"),
      icon: product.isActive ? PowerOff : Power,
      onSelect: () => toggleActive(product.id, !product.isActive),
    },
    {
      key: "delete",
      label: t("dashboard.listings.actions.delete"),
      icon: Trash2,
      tone: "danger",
      onSelect: () => setDeleteTarget(product),
    },
  ];

  return (
    <SectionCard
      icon={Layers}
      title={t("dashboard.listings.title")}
      subtitle={t("dashboard.listings.subtitle")}
      headerRight={
        <Link
          href={`/${lang}/publish`}
          className="hidden sm:inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dark"
        >
          <Plus size={14} color="currentColor" strokeWidth={2.5} />
          {t("dashboard.listings.publish")}
        </Link>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Status tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {STATUSES.map((s) => {
            const active = status === s;
            const count = counts[s];
            return (
              <button
                key={s}
                type="button"
                onClick={() => setStatus(s)}
                className={clsx(
                  "flex items-center gap-2 whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition-colors",
                  active
                    ? "bg-primary text-on-primary"
                    : "border border-border-light bg-surface text-foreground-secondary hover:border-primary/40",
                )}
              >
                {t(`dashboard.listings.status.${s}`)}
                <span
                  className={clsx(
                    "rounded-full px-1.5 text-xs font-bold",
                    active
                      ? "bg-on-primary/15 text-on-primary"
                      : "bg-background-secondary text-foreground-tertiary",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Mobile publish button */}
        <Link
          href={`/${lang}/publish`}
          className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-3 py-2 text-sm font-bold text-on-primary transition-colors hover:bg-primary-dark sm:hidden"
        >
          <Plus size={14} color="currentColor" strokeWidth={2.5} />
          {t("dashboard.listings.publish")}
        </Link>

        {/* Content */}
        {loading && categories.length === 0 ? (
          <div className="flex flex-col gap-4">
            {[0, 1].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="mb-3 h-4 w-32 rounded bg-background-secondary" />
                <div className="flex gap-3 overflow-hidden">
                  {[0, 1, 2, 3].map((j) => (
                    <div
                      key={j}
                      className="h-40 w-32 shrink-0 rounded-xl bg-background-secondary"
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : categories.length === 0 ? (
          <EmptyState
            icon={Package}
            title={t("dashboard.listings.empty.title")}
            description={t("dashboard.listings.empty.description")}
            actionLabel={t("dashboard.listings.publish")}
          />
        ) : (
          <div className="flex flex-col gap-6">
            {categories.map((cat) => (
              <div key={cat.id} className="flex flex-col gap-3">
                <header className="flex items-center justify-between gap-3">
                  <div className="flex items-baseline gap-2">
                    <Title level="h3" size="h6" weight="semibold">
                      {cat.name}
                    </Title>
                    <Text variant="span" size="sm" color="tertiary">
                      {t("dashboard.listings.countLabel", {
                        count: String(cat.products.length),
                      })}
                    </Text>
                  </div>
                  {cat.href && (
                    <Link
                      href={`/${lang}${cat.href.startsWith("/") ? cat.href : `/${cat.href}`}`}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm font-semibold text-primary hover:bg-primary/5"
                    >
                      {t("dashboard.listings.viewAll")}
                      <ChevronRight size={14} color="currentColor" strokeWidth={2} />
                    </Link>
                  )}
                </header>

                <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2">
                  {cat.products.slice(0, 8).map((product) => {
                    const cover = resolveImageUrl(product.images?.[0]);
                    return (
                      <div
                        key={product.id}
                        className="relative w-36 shrink-0"
                      >
                        <Link
                          href={`/${lang}/product/${product.id}`}
                          className="group flex flex-col overflow-hidden rounded-xl border border-border-light bg-surface shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-all hover:border-primary/40 hover:shadow-md"
                        >
                          <div className="relative aspect-square w-full bg-background-secondary">
                            {cover ? (
                              <Image
                                src={cover}
                                alt={product.name}
                                fill
                                sizes="144px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-primary/30">
                                <Package size={32} color="currentColor" strokeWidth={1.5} />
                              </div>
                            )}
                            {!product.isActive && (
                              <span className="absolute left-2 top-2 rounded-full bg-foreground/85 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                                {t("dashboard.listings.status.drafts")}
                              </span>
                            )}
                          </div>
                          <div className="flex flex-col gap-0.5 p-2.5">
                            <Text variant="span" weight="semibold" size="sm" numberOfLines={1}>
                              {product.name}
                            </Text>
                            <Text variant="span" weight="bold" size="sm" color="primary">
                              ${formatPrice(product.price, lang)}
                            </Text>
                          </div>
                        </Link>

                        {/* Actions menu sits over the card top-right corner; the
                            menu itself stops propagation so it never triggers
                            the wrapping link's navigation. */}
                        <div className="absolute right-2 top-2">
                          <ProductActionsMenu
                            actions={buildActions(product)}
                            ariaLabel={t("dashboard.listings.actions.menu")}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {editTarget && (
        <EditProductDialog
          key={editTarget.id}
          isOpen
          product={editTarget}
          loading={updating}
          onClose={() => setEditTarget(null)}
          onSave={handleEditSave}
        />
      )}
      {deleteTarget && (
        <DeleteProductDialog
          isOpen
          productName={deleteTarget.name}
          loading={deleting}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
        />
      )}
    </SectionCard>
  );
}
