"use client";
import { CalendarDays, CalendarPlus, Check, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Modal } from "@/components/Overlays";
import { Button } from "@/components/Primitives/Button";
import { Input } from "@/components/Primitives/Inputs";
import { Text } from "@/components/Primitives/Text";
import { TextArea } from "@/components/Primitives/TextArea";
import { Title } from "@/components/Primitives/Title";
import { DEFAULT_LANGUAGE, type SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { useParams } from "next/navigation";

import { useCommunityEvents, type CommunityEvent } from "../hooks/useCommunityEvents";
import { NAMESPACE } from "../i18n";

function formatDate(iso: string, locale: string) {
  try {
    return new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

/**
 * Community events: workshops, tutorials and meet-ups run by businesses.
 *
 * Organising is a business-account action, so the "publish" button only exists
 * for them. Reserving is open to everyone — a signed-in visitor has their
 * details prefilled and can cancel later; a guest simply leaves a name and an
 * email, which is all the organiser needs to expect them.
 */
export function CommunityEvents() {
  const { t } = useTranslation(NAMESPACE);
  const params = useParams<{ lang?: SupportedLanguage }>();
  const lang = params.lang ?? DEFAULT_LANGUAGE;
  const {
    events,
    loading,
    isBusiness,
    seller,
    registrationFor,
    register,
    registering,
    cancel,
    cancelling,
    draft,
    updateDraft,
    isDraftValid,
    createEvent,
    creating,
  } = useCommunityEvents();

  const [reserving, setReserving] = useState<CommunityEvent | null>(null);
  const [composerOpen, setComposerOpen] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const openReservation = (event: CommunityEvent) => {
    // Prefill from the session so a signed-in attendee only has to confirm.
    setName(seller?.profile?.__typename === "PersonProfile"
      ? [seller.profile.firstName, seller.profile.lastName].filter(Boolean).join(" ")
      : (seller?.profile?.businessName ?? ""));
    setEmail(seller?.email ?? "");
    setReserving(event);
  };

  return (
    <section className="flex flex-col gap-4" aria-label={t("events.title")}>
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <Title level="h2" size="h5" weight="semibold">
            {t("events.title")}
          </Title>
          <Text variant="span" size="sm" color="tertiary">
            {t("events.subtitle")}
          </Text>
        </div>
        {isBusiness && (
          <Button
            text={t("events.create.open")}
            leftIcon={CalendarPlus}
            size="sm"
            onClick={() => setComposerOpen(true)}
          />
        )}
      </header>

      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-56 animate-pulse rounded-2xl bg-background-secondary"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <Text variant="p" color="tertiary">
          {t("events.empty")}
        </Text>
      ) : (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const registration = registrationFor(event.id);
            const isFull =
              event.remainingCapacity !== null &&
              event.remainingCapacity !== undefined &&
              event.remainingCapacity <= 0;

            return (
              <li
                key={event.id}
                className="flex flex-col overflow-hidden rounded-2xl border border-border-light bg-surface"
              >
                {event.coverImage && (
                  <div className="relative h-36 w-full">
                    <Image
                      src={event.coverImage}
                      alt=""
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover"
                    />
                  </div>
                )}

                <div className="flex flex-1 flex-col gap-2 p-4">
                  <Title level="h3" size="h6" weight="semibold">
                    {event.title}
                  </Title>

                  {event.startDate && (
                    <span className="flex items-center gap-1.5 text-xs text-foreground-secondary">
                      <CalendarDays size={14} strokeWidth={2} />
                      {formatDate(event.startDate, lang)}
                    </span>
                  )}

                  <Text variant="p" size="sm" color="tertiary">
                    {event.content.length > 140
                      ? `${event.content.slice(0, 140)}…`
                      : event.content}
                  </Text>

                  <span className="flex items-center gap-1.5 text-xs text-foreground-tertiary">
                    <Users size={14} strokeWidth={2} />
                    {event.capacity
                      ? t("events.places", {
                          left: String(event.remainingCapacity ?? 0),
                          total: String(event.capacity),
                        })
                      : t("events.unlimited", {
                          count: String(event.registrationCount),
                        })}
                  </span>

                  <div className="mt-auto pt-2">
                    {registration ? (
                      <div className="flex flex-col gap-1.5">
                        <span className="flex items-center gap-1 text-xs font-semibold text-success">
                          <Check size={14} strokeWidth={2.5} />
                          {t("events.youAreIn")}
                        </span>
                        <Button
                          text={t("events.cancel")}
                          variant="outline"
                          size="sm"
                          fullWidth
                          loading={cancelling}
                          onClick={() => void cancel(registration.id)}
                        />
                      </div>
                    ) : (
                      <Button
                        text={isFull ? t("events.full") : t("events.reserve")}
                        size="sm"
                        fullWidth
                        disabled={isFull}
                        onClick={() => openReservation(event)}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}

      {/* Reservation */}
      <Modal
        isOpen={reserving !== null}
        onClose={() => setReserving(null)}
        size="sm"
        title={reserving?.title ?? t("events.reserve")}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            if (!reserving) return;
            const ok = await register(reserving.id, name, email);
            if (ok) setReserving(null);
          }}
        >
          <Text variant="p" color="tertiary">
            {t("events.reserveIntro")}
          </Text>
          <Input
            name="attendeeName"
            label={t("events.form.name")}
            value={name}
            onChangeText={setName}
            required
          />
          <Input
            name="attendeeEmail"
            type="email"
            label={t("events.form.email")}
            value={email}
            onChangeText={setEmail}
            required
          />
          <Button
            text={t("events.form.confirm")}
            type="submit"
            loading={registering}
            disabled={name.trim().length < 2 || !email.includes("@")}
            fullWidth
          />
        </form>
      </Modal>

      {/* Composer — business accounts only */}
      <Modal
        isOpen={composerOpen}
        onClose={() => setComposerOpen(false)}
        size="md"
        title={t("events.create.title")}
      >
        <form
          className="flex flex-col gap-4"
          onSubmit={async (e) => {
            e.preventDefault();
            const ok = await createEvent();
            if (ok) setComposerOpen(false);
          }}
        >
          <Input
            name="eventTitle"
            label={t("events.create.name")}
            value={draft.title}
            onChangeText={(value) => updateDraft("title", value)}
            required
          />
          <TextArea
            name="eventContent"
            label={t("events.create.description")}
            value={draft.content}
            onChangeText={(value) => updateDraft("content", value)}
            rows={4}
            maxLength={2000}
            required
          />
          <div className="flex flex-wrap gap-3">
            <Input
              name="eventStart"
              type="date"
              label={t("events.create.startDate")}
              value={draft.startDate}
              onChangeText={(value) => updateDraft("startDate", value)}
            />
            <Input
              name="eventEnd"
              type="date"
              label={t("events.create.endDate")}
              value={draft.endDate}
              onChangeText={(value) => updateDraft("endDate", value)}
            />
            <Input
              name="eventCapacity"
              type="number"
              label={t("events.create.capacity")}
              value={draft.capacity}
              onChangeText={(value) => updateDraft("capacity", value)}
              min={1}
            />
          </div>
          <Input
            name="eventCover"
            label={t("events.create.cover")}
            placeholder="https://…"
            value={draft.coverImage}
            onChangeText={(value) => updateDraft("coverImage", value)}
          />
          <Text variant="small" color="tertiary">
            {t("events.create.hint")}
          </Text>
          <Button
            text={t("events.create.submit")}
            type="submit"
            loading={creating}
            disabled={!isDraftValid}
            fullWidth
          />
        </form>
      </Modal>
    </section>
  );
}
