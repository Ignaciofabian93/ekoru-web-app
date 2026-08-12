"use client";
import { FileText, MailCheck } from "lucide-react";

import { Modal } from "@/components/Overlays";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { useTranslation } from "@/i18n/context";

import { useRequestQuote } from "../hooks/useRequestQuote";
import { NAMESPACE } from "../i18n";
import type { ServiceDetail } from "../types";

interface Props {
  service: ServiceDetail;
  isOpen: boolean;
  onClose: () => void;
}

export function RequestQuoteDialog({ service, isOpen, onClose }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const { draft, update, isValid, loading, done, submit, reset } =
    useRequestQuote(service);

  const close = () => {
    onClose();
    setTimeout(reset, 250);
  };

  return (
    <Modal isOpen={isOpen} onClose={close} size="md" title={t("quote.title")}>
      {done ? (
        <div className="flex flex-col items-center gap-3 py-4 text-center">
          <MailCheck className="size-10 text-primary" aria-hidden="true" />
          <Text variant="p" weight="bold">
            {t("quote.sentTitle")}
          </Text>
          <Text variant="p" color="tertiary">
            {t("quote.sentBody")}
          </Text>
          <Button text={t("quote.close")} variant="outline" onClick={close} />
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
            {t("quote.intro", { service: service.name })}
          </Text>

          <Input
            name="title"
            label={t("quote.subject")}
            placeholder={t("quote.subjectPlaceholder")}
            value={draft.title}
            onChangeText={(value) => update("title", value)}
            required
          />

          <TextArea
            name="description"
            label={t("quote.description")}
            placeholder={t("quote.descriptionPlaceholder")}
            value={draft.description}
            onChangeText={(value) => update("description", value)}
            rows={5}
            maxLength={2000}
            required
          />

          <TextArea
            name="clientNotes"
            label={t("quote.notes")}
            placeholder={t("quote.notesPlaceholder")}
            value={draft.notes}
            onChangeText={(value) => update("notes", value)}
            rows={3}
            maxLength={500}
          />

          <Text variant="small" color="tertiary">
            {t("quote.disclaimer")}
          </Text>

          <div className="flex gap-2">
            <Button
              text={t("quote.cancel")}
              variant="outline"
              onClick={close}
              disabled={loading}
              fullWidth
            />
            <Button
              text={t("quote.submit")}
              type="submit"
              leftIcon={FileText}
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
