"use client";
import { CalendarCheck, CalendarPlus } from "lucide-react";

import { Modal } from "@/components/Overlays";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { useTranslation } from "@/i18n/context";

import { useBookService } from "../hooks/useBookService";
import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

interface Props {
  service: ServiceDetail;
  isOpen: boolean;
  onClose: () => void;
}

/** Earliest date the provider accepts, honouring their advance-booking window. */
function minDate(advanceBookingDays: number | null | undefined): string {
  const days = advanceBookingDays ?? 0;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date.toISOString().slice(0, 10);
}

export function BookServiceDialog({ service, isOpen, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { draft, update, isValid, loading, done, submit, reset } =
    useBookService(service);

  const close = () => {
    onClose();
    // Let the exit animation finish before the content swaps back.
    setTimeout(reset, 250);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size="md" title={t("booking.title")}>
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <CalendarCheck className="size-10 text-primary" aria-hidden="true" />
          <Text variant="p" weight="bold">
            {t("booking.sentTitle")}
          </Text>
          <Text variant="p" color="tertiary">
            {t("booking.sentBody")}
          </Text>
          <Button text={t("booking.close")} variant="outline" onClick={close} />
        </div>
      ) : (
        <form
          className="flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit();
          }}
        >
          <Text variant="p" color="tertiary">
            {t("booking.intro", { service: service.name })}
          </Text>

          <Input
            name="scheduledDate"
            type="date"
            label={t("booking.date")}
            value={draft.date}
            onChangeText={(value) => update("date", value)}
            min={minDate(service.advanceBookingDays)}
            required
          />

          <Input
            name="scheduledTimeSlot"
            label={t("booking.timeSlot")}
            placeholder={t("booking.timeSlotPlaceholder")}
            value={draft.timeSlot}
            onChangeText={(value) => update("timeSlot", value)}
          />

          <TextArea
            name="clientNotes"
            label={t("booking.notes")}
            placeholder={t("booking.notesPlaceholder")}
            value={draft.notes}
            onChangeText={(value) => update("notes", value)}
            rows={4}
            maxLength={500}
          />

          <Text variant="small" color="tertiary">
            {t("booking.disclaimer")}
          </Text>

          <div className="flex gap-2">
            <Button
              text={t("booking.cancel")}
              variant="outline"
              onClick={close}
              disabled={loading}
              fullWidth
            />
            <Button
              text={t("booking.submit")}
              type="submit"
              leftIcon={CalendarPlus}
              loading={loading}
              disabled={!isValid}
              fullWidth
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
