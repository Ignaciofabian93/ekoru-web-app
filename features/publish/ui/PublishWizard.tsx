"use client";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";
import { Title } from "@/components/Primitives/Title";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { AlertCircle, ArrowLeft, ArrowRight } from "lucide-react";
import { useState, type ReactNode } from "react";

export interface WizardStep {
  key: string;
  title: string;
  subtitle: string;
  /** Whether the step's fields currently pass validation. */
  valid: boolean;
  /** Step content; `submitted` turns true after a blocked Continue so fields
   *  can highlight their own errors. */
  render: (submitted: boolean) => ReactNode;
}

/** Shared chrome for the publish wizards: progress bar, step header, forward /
 *  back animation, step-level error and navigation. The parent form owns the
 *  field state and declares its steps. */
export function PublishWizard({
  steps,
  loading,
  onPublish,
}: {
  steps: WizardStep[];
  loading: boolean;
  onPublish: () => Promise<boolean>;
}) {
  const { t } = useTranslation("publish");

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState<"forward" | "back">("forward");
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = steps.length;
  // Clamp in case the step list shrinks (e.g. the seller profile hydrates
  // after mount and a step disappears).
  const index = Math.min(step, totalSteps - 1);
  const current = steps[index];

  const goTo = (next: number, dir: "forward" | "back") => {
    setDirection(dir);
    setSubmitted(false);
    setStep(next);
  };

  const handleBack = () => goTo(index - 1, "back");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!current.valid) {
      setSubmitted(true);
      return;
    }

    if (index < totalSteps - 1) {
      goTo(index + 1, "forward");
      return;
    }

    setSubmitted(false);
    await onPublish();
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <span
              key={i}
              className={clsx(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                i <= index ? "bg-primary" : "bg-border-light",
              )}
            />
          ))}
        </div>
        <Text variant="small" color="tertiary">
          {t("step", { current: String(index + 1), total: String(totalSteps) })}
        </Text>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        <div
          key={current.key}
          className={clsx(
            "sm:min-h-79",
            direction === "forward" ? "animate-step-forward" : "animate-step-back",
          )}
        >
          <div className="mb-5 flex flex-col gap-1">
            <Title level="h2" size="h4" weight="semibold" color="primary">
              {current.title}
            </Title>
            <Text variant="span" color="secondary">
              {current.subtitle}
            </Text>
          </div>

          {current.render(submitted)}
        </div>

        {/* Step-level error — surfaces any silent validation failure so the
            Continue button never appears to "do nothing" when blocked. */}
        {submitted && !current.valid && (
          <div className="flex items-center gap-2 rounded-md border border-danger/30 bg-danger/5 px-3 py-2">
            <AlertCircle size={16} color="currentColor" className="text-danger" />
            <Text variant="small" color="error">
              {t("feedback.fixHighlighted")}
            </Text>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center gap-3">
          {index > 0 && (
            <Button
              text={t("actions.back")}
              variant="outline"
              leftIcon={ArrowLeft}
              type="button"
              onClick={handleBack}
              size="md"
            />
          )}
          <div className="flex-1">
            {index < totalSteps - 1 ? (
              <Button
                text={t("actions.continue")}
                rightIcon={ArrowRight}
                type="submit"
                fullWidth
                size="md"
              />
            ) : (
              <Button
                text={t("actions.publish")}
                rightIcon={ArrowRight}
                type="submit"
                loading={loading}
                fullWidth
                size="md"
              />
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
