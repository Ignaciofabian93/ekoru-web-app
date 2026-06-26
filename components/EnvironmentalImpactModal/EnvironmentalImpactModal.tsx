"use client";

import { Droplets, Info, Leaf, Sprout } from "lucide-react";

import { useTranslation } from "@/i18n/context";
import type { EnvironmentalImpact } from "@/types/product";
import {
  formatMaterialAmount,
  materialLabel,
  materialPercentage,
} from "@/utils/impact";

import Modal from "../Modal/Modal";

export interface EnvironmentalImpactModalProps {
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
      <div className="h-full rounded-full bg-primary" style={{ width: `${percentage}%` }} />
    </div>
  );
}

export default function EnvironmentalImpactModal({
  isOpen,
  onClose,
  environmentalImpact,
  productName,
}: EnvironmentalImpactModalProps) {
  const { t } = useTranslation();
  const { totalCo2SavingsKG, totalWaterSavingsLT, materialBreakdown } = environmentalImpact;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={t("impact.modal.title")} size="md">
      <div className="flex flex-col gap-5">
        {productName && (
          <p className="-mt-2 text-sm font-medium text-foreground-secondary">{productName}</p>
        )}

        {/* Summary cards */}
        <div className="flex flex-row gap-3">
          {/* CO₂ card */}
          <div className="flex flex-1 flex-col gap-1 rounded-md bg-success/10 p-3.5">
            <div className="mb-1 flex flex-row items-center gap-1.5">
              <Leaf size={18} strokeWidth={2} className="text-success" />
              <span className="min-w-0 flex-1 text-sm font-medium text-foreground-secondary">
                {t("impact.modal.co2Savings")}
              </span>
            </div>
            <span className="text-xl font-bold tracking-[-0.5px] text-success">
              {formatNumber(totalCo2SavingsKG)} kg
            </span>
            <span className="text-xs leading-3.75 text-foreground-secondary">
              {t("impact.modal.equivalentTo")} {formatNumber(totalCo2SavingsKG * 4.5)} km
              {t("impact.modal.carDistance")}
            </span>
          </div>

          {/* Water card */}
          <div className="flex flex-1 flex-col gap-1 rounded-md bg-info/10 p-3.5">
            <div className="mb-1 flex flex-row items-center gap-1.5">
              <Droplets size={18} strokeWidth={2} className="text-info" />
              <span className="min-w-0 flex-1 text-sm font-medium text-foreground-secondary">
                {t("impact.modal.waterSavings")}
              </span>
            </div>
            <span className="text-xl font-bold tracking-[-0.5px] text-info">
              {formatNumber(totalWaterSavingsLT)} L
            </span>
            <span className="text-xs leading-3.75 text-foreground-secondary">
              {t("impact.modal.equivalentTo")} {formatNumber(totalWaterSavingsLT / 8)}
              {t("impact.modal.showerCount")}
            </span>
          </div>
        </div>

        {/* Material breakdown */}
        {materialBreakdown.length > 0 && (
          <div className="flex flex-col gap-3">
            <div className="flex flex-row items-center gap-2">
              <Info size={18} strokeWidth={2} className="text-foreground" />
              <span className="text-base font-bold text-foreground">
                {t("impact.modal.materialBreakdown")}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {materialBreakdown.map((material, index) => {
                const percentage = materialPercentage(material, materialBreakdown);
                return (
                  <div
                    key={index}
                    className="flex flex-col gap-2.5 rounded-md border border-border-light p-3.5"
                  >
                    <div className="flex flex-row items-center justify-between">
                      <span className="flex-1 text-sm font-semibold text-foreground">
                        {materialLabel(material)}
                      </span>
                      <span className="text-base font-bold text-primary">
                        {percentage.toFixed(1)}%
                      </span>
                    </div>

                    <div className="flex flex-row gap-2">
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-xs text-foreground-secondary">
                          {t("impact.modal.amount")}
                        </span>
                        <span className="text-sm font-semibold text-foreground">
                          {formatMaterialAmount(material)}
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-xs text-foreground-secondary">
                          {t("impact.modal.co2Saved")}
                        </span>
                        <span className="text-sm font-semibold text-success">
                          {formatNumber(material.co2SavingsKG)} kg
                        </span>
                      </div>
                      <div className="flex flex-1 flex-col gap-0.5">
                        <span className="text-xs text-foreground-secondary">
                          {t("impact.modal.waterSaved")}
                        </span>
                        <span className="text-sm font-semibold text-info">
                          {formatNumber(material.waterSavingsLT)} L
                        </span>
                      </div>
                    </div>

                    <ProgressBar percentage={percentage} />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Why this matters */}
        <div className="flex flex-col gap-2.5 rounded-md bg-success/5 p-3.5">
          <div className="flex flex-row items-center gap-2">
            <Sprout size={18} strokeWidth={2} className="text-success" />
            <span className="text-base font-bold text-foreground">
              {t("impact.modal.benefitsTitle")}
            </span>
          </div>
          <ul className="flex flex-col gap-1.5">
            {["benefit1", "benefit2", "benefit3"].map((key) => (
              <li
                key={key}
                className="flex flex-row items-start gap-2 text-xs leading-4.5 text-foreground-secondary"
              >
                <Leaf size={13} strokeWidth={2} className="mt-px shrink-0 text-success" />
                <span className="flex-1">{t(`impact.modal.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Info footer */}
        <div className="flex flex-row items-start gap-2 rounded-md bg-primary/5 p-3.5">
          <div className="mt-px shrink-0 text-primary">
            <Info size={14} strokeWidth={2} />
          </div>
          <span className="flex-1 text-xs leading-4.5 text-foreground-secondary">
            {t("impact.modal.info")}
          </span>
        </div>
      </div>
    </Modal>
  );
}
