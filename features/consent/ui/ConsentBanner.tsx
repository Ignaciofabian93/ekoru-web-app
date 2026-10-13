"use client";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect } from "react";

import { Button } from "@/components/Primitives/Button";
import { DEFAULT_LANGUAGE } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { ACTIVE_CATEGORIES, needsDecision, type ConsentCategory } from "../consent";
import { useConsentStore } from "../hooks/useConsent";

/**
 * Asks before any optional cookie is set (WEB-15). Renders nothing while the
 * build uses no optional category, which is the case until analytics arrives
 * (WEB-19), and nothing once the visitor has answered, unless they reopen it
 * from "Cookie preferences" in the footer. Accept and reject look the same:
 * refusing must be as easy as accepting.
 */
export function ConsentBanner({
  categories = ACTIVE_CATEGORIES,
}: {
  categories?: readonly ConsentCategory[];
}) {
  const { t } = useTranslation();
  const params = useParams<{ lang?: string }>();
  const lang = params?.lang ?? DEFAULT_LANGUAGE;
  const { choice, loaded, reopened, load, decide } = useConsentStore();

  useEffect(() => {
    load();
  }, [load]);

  if (!loaded || categories.length === 0) return null;
  if (!needsDecision(choice, categories) && !reopened) return null;

  return (
    <section
      aria-labelledby="consent-title"
      className="fixed inset-x-0 bottom-0 z-50 px-4 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+1rem)]"
    >
      <div className="mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-border-light bg-surface p-4 shadow-lg sm:flex-row sm:items-center">
        <div className="flex flex-1 flex-col gap-1">
          <h2 id="consent-title" className="text-sm font-bold text-foreground">
            {t("consent.title")}
          </h2>
          <p className="text-sm text-foreground-secondary">
            {t("consent.body")}{" "}
            <Link
              href={`/${lang}/terms-and-conditions#clause-s6`}
              className="font-semibold text-primary underline-offset-2 hover:underline"
            >
              {t("consent.privacy")}
            </Link>
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <Button text={t("consent.reject")} onPress={() => decide(false)} />
          <Button text={t("consent.accept")} onPress={() => decide(true)} />
        </div>
      </div>
    </section>
  );
}

/** Footer link that reopens the choice. Hidden while there is nothing to choose. */
export function CookiePreferencesButton({
  label,
  className,
  categories = ACTIVE_CATEGORIES,
}: {
  label: string;
  className?: string;
  categories?: readonly ConsentCategory[];
}) {
  const reopen = useConsentStore((state) => state.reopen);
  if (categories.length === 0) return null;
  return (
    <button type="button" onClick={reopen} className={className}>
      {label}
    </button>
  );
}
