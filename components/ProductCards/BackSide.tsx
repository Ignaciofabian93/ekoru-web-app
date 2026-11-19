"use client";
import clsx from "clsx";
import { ArrowRight, Droplets, Leaf, MapPin, type LucideIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { impactIconStroke, impactToneClass } from "@/design/total-impact";
import { useDisplayName, useInitials, useProfileImage, useSellerRegion } from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact, StoreProductMaterialComposition } from "@/types/product";
import type { Seller } from "@/types/user";
import { formatInitials } from "@/utils/formatters";
import { materialLabel, materialPercentage } from "@/utils/impact";
import { resolveImageUrl } from "@/utils/resolveImage";
import { FlipButton } from "./CardButtons";
import type { CardType } from "./FrontSide";
import { NAMESPACE } from "./i18n";
import ImpactModal from "./ImpactModal";
import { backStyles } from "./styles";

interface SellerOverrides {
  sellerName?: string | null;
  sellerImage?: string | null;
  sellerLocation?: string | null;
}

export interface BackSideProps extends SellerOverrides {
  cardId: string;
  cardType: CardType;
  name: string;
  impact?: EnvironmentalImpact | null;
  materials?: StoreProductMaterialComposition[] | null;
  description?: string | null;
  seller?: Seller | null;
}

interface MaterialRow {
  key: string;
  label: string;
  percentage: number;
}

function MaterialList({ rows, compactAfter }: { rows: MaterialRow[]; compactAfter?: number }) {
  return (
    <ul className={backStyles.materialList}>
      {rows.map((row, index) => (
        <li
          key={row.key}
          className={clsx(
            backStyles.material,
            compactAfter !== undefined && index >= compactAfter && backStyles.materialNarrowHidden,
          )}
        >
          <span className={backStyles.materialLabel}>{row.label}</span>
          <span aria-hidden className={backStyles.materialLeader} />
          <span className={backStyles.materialValue}>{`${row.percentage}%`}</span>
        </li>
      ))}
    </ul>
  );
}

function SavingRow({
  icon: Icon,
  tone,
  label,
  shortLabel,
  value,
  unit,
}: {
  icon: LucideIcon;
  tone: string;
  label: string;
  shortLabel: string;
  value: number;
  unit: string;
}) {
  return (
    <div className={backStyles.saving}>
      <span className={backStyles.savingLabel}>
        <Icon size={12} strokeWidth={impactIconStroke} aria-hidden className={clsx("shrink-0", tone)} />
        <span className={backStyles.savingShort}>{shortLabel}</span>
        <span className={backStyles.savingFull}>{label}</span>
      </span>
      <span className={clsx(backStyles.savingValue, tone)}>
        <span className={backStyles.savingNumber}>{value}</span>
        <span className={backStyles.savingUnit}>{unit}</span>
      </span>
    </div>
  );
}

function Impact({ impact, name }: { impact?: EnvironmentalImpact | null; name: string }) {
  const { t } = useTranslation(NAMESPACE);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const breakdown = impact?.materialBreakdown ?? [];
  const materials = breakdown
    .map((material) => ({
      key: material.materialType,
      label: materialLabel(material),
      percentage: Math.round(materialPercentage(material, breakdown)),
    }))
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 3);

  return (
    <div className={backStyles.section}>
      <span className={backStyles.eyebrow}>{t("impact.saved")}</span>
      <div className={backStyles.savings}>
        <SavingRow
          icon={Leaf}
          tone={impactToneClass.co2}
          label={t("impact.co2")}
          shortLabel={t("impact.co2Short")}
          value={impact?.totalCo2SavingsKG ?? 0}
          unit={t("impact.co2Unit")}
        />
        <SavingRow
          icon={Droplets}
          tone={impactToneClass.water}
          label={t("impact.water")}
          shortLabel={t("impact.waterShort")}
          value={impact?.totalWaterSavingsLT ?? 0}
          unit={t("impact.waterUnit")}
        />
      </div>

      {materials.length > 0 && (
        <div className={backStyles.materials}>
          <span className={backStyles.eyebrow}>{t("impact.composition")}</span>
          <MaterialList rows={materials} compactAfter={2} />
        </div>
      )}

      {impact && (
        <>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className={backStyles.impactLink}
          >
            {t("impact.viewImpact")}
            <ArrowRight size={14} strokeWidth={2.5} aria-hidden />
          </button>
          <ImpactModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            environmentalImpact={impact}
            productName={name}
          />
        </>
      )}
    </div>
  );
}

function Materials({ materials }: { materials?: StoreProductMaterialComposition[] | null }) {
  const { t } = useTranslation(NAMESPACE);
  const rows = [...(materials ?? [])]
    .sort((a, b) => b.percentage - a.percentage)
    .map((material) => ({
      key: material.materialType,
      label: material.label,
      percentage: Math.round(material.percentage),
    }));

  return (
    <div className={backStyles.section}>
      <span className={backStyles.eyebrow}>{t("impact.composition")}</span>
      {rows.length === 0 ? (
        <span className={backStyles.empty}>{t("impact.noMaterials")}</span>
      ) : (
        <MaterialList rows={rows} />
      )}
    </div>
  );
}

function Description({ description }: { description?: string | null }) {
  const { t } = useTranslation(NAMESPACE);
  return (
    <div className={backStyles.description}>
      <p className={backStyles.descriptionText}>
        {description?.trim() || t("meta.noDescription")}
      </p>
    </div>
  );
}

function SellerByline({
  seller,
  sellerName,
  sellerImage,
  sellerLocation,
}: SellerOverrides & { seller?: Seller | null }) {
  const displayName = useDisplayName(seller);
  const sellerRegion = useSellerRegion(seller);
  const profileImage = useProfileImage(seller);
  const sellerInitials = useInitials(seller);

  const name = sellerName ?? displayName;
  const region = sellerLocation ?? sellerRegion;
  const image = resolveImageUrl(sellerImage) ?? profileImage;
  const initials = sellerName ? formatInitials(sellerName) : sellerInitials;

  if (!name && !region) return null;

  return (
    <div className={backStyles.footer}>
      <div className={backStyles.seller}>
        <span aria-hidden className={backStyles.avatar}>
          {image ? (
            <Image src={image} alt="" width={52} height={52} className={backStyles.avatarImage} />
          ) : (
            <span className={backStyles.initials}>{initials}</span>
          )}
        </span>
        <span className={backStyles.sellerText}>
          {name && <span className={backStyles.sellerName}>{name}</span>}
          {region && (
            <span className={backStyles.sellerRegion}>
              <MapPin size={10} strokeWidth={2} aria-hidden className={backStyles.sellerRegionIcon} />
              <span className={backStyles.sellerRegionText}>{region}</span>
            </span>
          )}
        </span>
      </div>
    </div>
  );
}

export default function BackSide({
  cardId,
  cardType,
  name,
  impact,
  materials,
  description,
  seller,
  ...sellerOverrides
}: BackSideProps) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <>
      <div className={backStyles.flip}>
        <FlipButton cardId={cardId} label={t("actions.flipBack")} />
      </div>
      <div className={backStyles.header}>
        <p className={backStyles.title}>{name}</p>
      </div>

      {cardType === "marketplace" && <Impact impact={impact} name={name} />}
      {cardType === "store" && <Materials materials={materials} />}
      {cardType === "service" && <Description description={description} />}

      <SellerByline seller={seller} {...sellerOverrides} />
    </>
  );
}
