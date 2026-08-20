"use client";
import { Droplets, Info, Leaf, Sprout, type LucideIcon } from "lucide-react";
import type { TotalImpactType } from "@/components/Patterns/TotalImpact/TotalImpact";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import {
  impactIconSize,
  impactIconStroke,
  impactTileClass,
  impactToneClass,
} from "@/design/total-impact";
import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import { formatMaterialAmount, materialLabel, materialPercentage } from "@/utils/impact";
import { Modal } from "../Overlays/Modal";
import clsx from "clsx";

export interface ImpactModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  environmentalImpact: EnvironmentalImpact;
  /** Product name, shown under the modal title for context. */
  productName?: string;
}

function formatNumber(num: number): string {
  return num.toLocaleString("es-CL", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function ProgressBar({ percentage }: { percentage: number }) {
  return (
    <div className="h-1.5 overflow-hidden rounded-full bg-primary/10">
      {/* width is data-driven, so it stays inline */}
      <div
        className="h-full rounded-full bg-primary"
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

/**
 * One headline saving. Same surface and hue as the standalone `TotalImpact`
 * tile, at the density a modal can afford — which buys room for the everyday
 * equivalence under the figure.
 */
function SummaryCard({
  type,
  icon: Icon,
  label,
  value,
  caption,
}: {
  type: TotalImpactType;
  icon: LucideIcon;
  label: string;
  value: string;
  caption: string;
}) {
  const tone = impactToneClass[type];
  return (
    <div className={clsx(impactTileClass[type].md, "flex-1")}>
      <div className="mb-1 flex flex-row items-center gap-1.5">
        <Icon
          size={impactIconSize.md}
          className={tone}
          strokeWidth={impactIconStroke}
          aria-hidden
        />
        <Text
          variant="span"
          size="sm"
          weight="medium"
          color="secondary"
          className="min-w-0 flex-1"
        >
          {label}
        </Text>
      </div>
      <Text
        variant="span"
        size="xl"
        weight="bold"
        className={clsx(tone, "tracking-[-0.5px]")}
      >
        {value}
      </Text>
      <Text variant="span" size="xs" color="secondary" leading="normal">
        {caption}
      </Text>
    </div>
  );
}

/** Icon + heading pair that opens each block below the summary. */
function SectionTitle({ icon: Icon, children }: { icon: LucideIcon; children: string }) {
  return (
    <div className="flex flex-row items-center gap-2">
      <Icon
        size={impactIconSize.md}
        className="text-foreground"
        strokeWidth={2}
        aria-hidden
      />
      <Title level="h3" size="h6" weight="bold">
        {children}
      </Title>
    </div>
  );
}

/** One figure in a material's row: caption over value. */
function MaterialFigure({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: string;
}) {
  return (
    <div className="flex flex-1 flex-col gap-0.5">
      <Text variant="span" size="xs" color="secondary">
        {label}
      </Text>
      <Text variant="span" size="sm" weight="semibold" className={tone}>
        {value}
      </Text>
    </div>
  );
}

// The detailed impact view shown from a card's back-side "view full impact"
// control. Reads the shared `impact.modal.*` keys from the global dictionary
// (not the card-scoped `cards` namespace), so it needs no extra provider.
export default function ImpactModal({
  isOpen,
  onClose,
  environmentalImpact,
  productName,
}: ImpactModalProps) {
  const { t } = useTranslation();
  const { totalCo2SavingsKG, totalWaterSavingsLT, materialBreakdown } =
    environmentalImpact;

  // Composed here rather than across JSX lines: the trailing halves of these
  // sentences carry their own leading space in the dictionary (" by car",
  // " showers"), which JSX whitespace collapsing would otherwise obscure.
  const co2Caption = `${t("impact.modal.equivalentTo")} ${formatNumber(
    totalCo2SavingsKG * 4.5,
  )} km${t("impact.modal.carDistance")}`;
  const waterCaption = `${t("impact.modal.equivalentTo")} ${formatNumber(
    totalWaterSavingsLT / 8,
  )}${t("impact.modal.showerCount")}`;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("impact.modal.title")} size="md">
      <div className="flex flex-col gap-5">
        {productName && (
          <Text variant="p" size="sm" weight="medium" color="secondary" className="-mt-2">
            {productName}
          </Text>
        )}

        {/* Headline savings */}
        <div className="flex flex-row gap-3">
          <SummaryCard
            type="co2"
            icon={Leaf}
            label={t("impact.modal.co2Savings")}
            value={`${formatNumber(totalCo2SavingsKG)} kg`}
            caption={co2Caption}
          />
          <SummaryCard
            type="water"
            icon={Droplets}
            label={t("impact.modal.waterSavings")}
            value={`${formatNumber(totalWaterSavingsLT)} L`}
            caption={waterCaption}
          />
        </div>

        {/* Material breakdown */}
        {materialBreakdown.length > 0 && (
          <div className="flex flex-col gap-3">
            <SectionTitle icon={Info}>{t("impact.modal.materialBreakdown")}</SectionTitle>

            <div className="flex flex-col gap-2.5">
              {materialBreakdown.map((material, index) => {
                const percentage = materialPercentage(material, materialBreakdown);
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2.5 rounded-lg border border-border-light p-3.5"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <Text variant="span" size="sm" weight="semibold" className="flex-1">
                        {materialLabel(material)}
                      </Text>
                      <Text variant="span" size="base" weight="bold" color="primary">
                        {percentage.toFixed(1)}%
                      </Text>
                    </div>

                    <div className="flex flex-row gap-2">
                      <MaterialFigure
                        label={t("impact.modal.amount")}
                        value={formatMaterialAmount(material)}
                      />
                      <MaterialFigure
                        label={t("impact.modal.co2Saved")}
                        value={`${formatNumber(material.co2SavingsKG)} kg`}
                        tone={impactToneClass.co2}
                      />
                      <MaterialFigure
                        label={t("impact.modal.waterSaved")}
                        value={`${formatNumber(material.waterSavingsLT)} L`}
                        tone={impactToneClass.water}
                      />
                    </div>

                    <ProgressBar percentage={percentage} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Why this matters */}
        <div className="flex flex-col gap-2.5 rounded-lg bg-primary/5 p-3.5">
          <SectionTitle icon={Sprout}>{t("impact.modal.benefitsTitle")}</SectionTitle>
          <ul className="flex flex-col gap-1.5">
            {["benefit1", "benefit2", "benefit3"].map((key) => (
              <li key={key} className="flex flex-row items-start gap-2">
                <Leaf
                  size={13}
                  strokeWidth={2}
                  aria-hidden
                  className="mt-1 shrink-0 text-primary"
                />
                <Text variant="span" size="xs" color="secondary" leading="loose">
                  {t(`impact.modal.${key}`)}
                </Text>
              </li>
            ))}
          </ul>
        </div>

        {/* Info footer */}
        <div className="flex flex-row items-start gap-2 rounded-lg bg-primary/5 p-3.5">
          <Info
            size={14}
            strokeWidth={2}
            aria-hidden
            className="mt-1 shrink-0 text-primary"
          />
          <Text variant="span" size="xs" color="secondary" leading="loose">
            {t("impact.modal.info")}
          </Text>
        </div>
      </div>
    </Modal>
  );
}
