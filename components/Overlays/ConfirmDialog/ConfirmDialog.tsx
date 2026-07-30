"use client";

import clsx from "clsx";
import { AlertTriangle, type LucideIcon } from "lucide-react";
import { Modal } from "@/components/Overlays/Modal";
import { Button } from "@/components/Primitives/Button";
import { Text } from "@/components/Primitives/Text";

export type ConfirmTone = "danger" | "primary";

export interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  /** Already-translated copy — shared components take text as props. */
  title: string;
  description: string;
  confirmLabel: string;
  cancelLabel: string;
  /** Shown on the confirm button while `loading`. */
  loadingLabel?: string;
  loading?: boolean;
  tone?: ConfirmTone;
  icon?: LucideIcon;
  /** Icon on the confirm button, e.g. a trash can for a delete. */
  confirmIcon?: LucideIcon;
}

const TONE_BADGE: Record<ConfirmTone, string> = {
  danger: "bg-danger/10 text-danger",
  primary: "bg-primary/10 text-primary",
};

/**
 * Destructive-or-not confirmation prompt: icon, title, description and a
 * cancel / confirm pair. The confirm button carries the loading state so the
 * dialog can't be dismissed mid-request.
 */
export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel,
  cancelLabel,
  loadingLabel,
  loading = false,
  tone = "danger",
  icon: Icon = AlertTriangle,
  confirmIcon,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" showCloseButton={!loading}>
      <div className="flex flex-col items-center gap-4 text-center">
        <div
          className={clsx(
            "flex h-14 w-14 items-center justify-center rounded-full",
            TONE_BADGE[tone],
          )}
        >
          <Icon size={26} color="currentColor" strokeWidth={2} aria-hidden />
        </div>

        <div className="flex flex-col gap-1.5">
          <Text variant="span" weight="bold" size="lg">
            {title}
          </Text>
          <Text variant="p" size="sm" color="secondary" align="center">
            {description}
          </Text>
        </div>

        <div className="mt-2 flex w-full flex-col-reverse gap-2 sm:flex-row sm:justify-end">
          <Button
            text={cancelLabel}
            variant="outline"
            size="md"
            onPress={onClose}
            disabled={loading}
          />
          <Button
            text={confirmLabel}
            loadingText={loadingLabel}
            variant={tone === "danger" ? "error" : "primary"}
            size="md"
            leftIcon={confirmIcon}
            onPress={onConfirm}
            loading={loading}
          />
        </div>
      </div>
    </Modal>
  );
}
