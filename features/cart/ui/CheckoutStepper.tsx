"use client";
import clsx from "clsx";
import { Check } from "lucide-react";

import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import type { CheckoutStep } from "../hooks/useCheckout";

const STEPS: CheckoutStep[] = ["shipping", "payment", "review"];

export function CheckoutStepper({ current }: { current: CheckoutStep }) {
  const { t } = useTranslation("cart");
  const currentIdx = STEPS.indexOf(current);

  return (
    <ol className="flex items-center gap-2">
      {STEPS.map((stepId, i) => {
        const isCurrent = i === currentIdx;
        const isCompleted = i < currentIdx;
        return (
          <li key={stepId} className="flex flex-1 items-center gap-2">
            <div
              className={clsx(
                "flex size-7 shrink-0 items-center justify-center rounded-full text-sm font-semibold transition-colors",
                isCompleted
                  ? "bg-primary text-on-primary"
                  : isCurrent
                    ? "bg-primary text-on-primary"
                    : "bg-background-secondary text-foreground-secondary",
              )}
            >
              {isCompleted ? <Check size={14} strokeWidth={3} /> : i + 1}
            </div>
            <Text
              variant="span"
              size="sm"
              weight={isCurrent ? "semibold" : "medium"}
              color={isCurrent ? "primary" : isCompleted ? "default" : "secondary"}
            >
              {t(`checkout.steps.${stepId}`)}
            </Text>
            {i < STEPS.length - 1 ? (
              <span
                className={clsx(
                  "h-px flex-1",
                  i < currentIdx ? "bg-primary" : "bg-border-light",
                )}
              />
            ) : null}
          </li>
        );
      })}
    </ol>
  );
}
