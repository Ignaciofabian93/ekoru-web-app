"use client";
import { Modal } from "@/components/Overlays";
import { Text } from "@/components/Primitives/Text";
import { Toggle } from "@/components/Primitives/Toggle";
import { useTranslation } from "@/i18n/context";

import type { CommunityEvent } from "../hooks/useCommunityEvents";
import { useEventAttendance } from "../hooks/useEventAttendance";
import { NAMESPACE } from "../i18n";

/**
 * The organiser confirms who came to their event. Each confirmation earns
 * eco-points, once, for the attendee (if they registered with an account)
 * and for the organiser.
 */
export function EventAttendanceModal({
  event,
  onClose,
}: {
  event: CommunityEvent | null;
  onClose: () => void;
}) {
  const { t } = useTranslation(NAMESPACE);
  const { attendees, loading, saving, setAttended } = useEventAttendance(
    event?.id ?? null,
  );
  const confirmed = attendees.filter((a) => a.attendedAt).length;

  return (
    <Modal
      isOpen={event !== null}
      onClose={onClose}
      size="md"
      title={t("events.organizer.attendanceTitle")}
    >
      <div className="flex flex-col gap-4">
        <Text variant="p" color="tertiary">
          {t("events.organizer.attendanceIntro", { title: event?.title ?? "" })}
        </Text>
        {loading && attendees.length === 0 ? (
          <Text variant="span" size="sm" color="tertiary">
            {t("events.organizer.attendanceLoading")}
          </Text>
        ) : attendees.length === 0 ? (
          <Text variant="span" size="sm" color="tertiary">
            {t("events.organizer.attendanceEmpty")}
          </Text>
        ) : (
          <>
            <Text variant="span" size="sm" weight="semibold">
              {t("events.organizer.attendanceCount", {
                confirmed: String(confirmed),
                total: String(attendees.length),
              })}
            </Text>
            <ul className="flex flex-col divide-y divide-border">
              {attendees.map((attendee) => (
                <li
                  key={attendee.id}
                  className="flex items-center justify-between gap-3 py-2.5"
                >
                  <div className="flex min-w-0 flex-col">
                    <Text variant="span" size="sm" weight="semibold" className="truncate">
                      {attendee.name}
                    </Text>
                    <Text variant="span" size="xs" color="tertiary" className="truncate">
                      {attendee.email}
                      {attendee.hasAccount ? "" : ` · ${t("events.organizer.guestNoPoints")}`}
                    </Text>
                  </div>
                  <Toggle
                    checked={Boolean(attendee.attendedAt)}
                    disabled={saving}
                    ariaLabel={t("events.organizer.attendedLabel", {
                      name: attendee.name,
                    })}
                    onChange={(next) => void setAttended(attendee.id, next)}
                  />
                </li>
              ))}
            </ul>
          </>
        )}
      </div>
    </Modal>
  );
}
