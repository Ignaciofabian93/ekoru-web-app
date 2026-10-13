"use client";
import { MapPinOff } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

import { Text } from "@/components/Primitives/Text";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useHasCompleteLocation } from "@/hooks/useSellerData";
import { useTranslation } from "@/i18n/context";
import { useSeller } from "@/store/useAuthStore";

/**
 * Tells a signed-in seller whose location is incomplete that their listings
 * won't appear in search until they fill it in, with a link straight to the
 * location section of Edit profile. Renders nothing for visitors and for
 * sellers whose location is complete, so it can sit on any seller surface.
 */
export function LocationNotice({ className }: { className?: string }) {
  const { t } = useTranslation();
  const seller = useSeller();
  const complete = useHasCompleteLocation(seller);
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;

  if (!seller || complete) return null;

  return (
    <div
      role="status"
      className={[
        "flex flex-col gap-3 rounded-2xl border border-warning/40 bg-warning/10 p-4 sm:flex-row sm:items-center",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <MapPinOff size={22} strokeWidth={2} className="shrink-0 text-warning" aria-hidden />
      <div className="flex flex-1 flex-col gap-0.5">
        <Text variant="span" weight="bold">
          {t("locationNotice.title")}
        </Text>
        <Text variant="span" size="sm" color="secondary">
          {t("locationNotice.body")}
        </Text>
      </div>
      <Link
        href={`/${lang}/profile/edit-profile#location`}
        className="inline-flex shrink-0 items-center justify-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-on-primary transition-colors hover:bg-primary-hover"
      >
        {t("locationNotice.action")}
      </Link>
    </div>
  );
}
