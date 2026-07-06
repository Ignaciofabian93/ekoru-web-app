"use client";
import type { SupportedLanguage } from "@/constants/settings";
import { useTranslation } from "@/i18n/context";
import { NAMESPACE } from "../i18n";
import Link from "next/link";
import { ImageOff, Star } from "lucide-react";
import { useServices } from "../hooks/useServices";

export function ServicesHighlight({ lang }: { lang: SupportedLanguage }) {
  const { t } = useTranslation(NAMESPACE);
  const { services } = useServices();

  return (
    <div className="my-10">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-foreground">{t("products.title")}</h2>
          <p className="text-sm text-foreground-secondary mt-0.5">
            {t("products.subtitle")}
          </p>
        </div>
        <Link
          href={`/${lang}/marketplace`}
          className="text-sm font-semibold text-primary hover:underline"
        >
          {t("products.seeAll")}
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {services.map((service) => (
          <Link
            key={service.id}
            href={`/${lang}/service/${service.id}`}
            className="group bg-surface border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-square bg-background-secondary flex items-center justify-center">
              <ImageOff
                size={32}
                className="text-foreground-tertiary"
                strokeWidth={1.5}
              />
            </div>
            <div className="p-3">
              {service.name && (
                <p className="text-xs text-foreground-tertiary uppercase tracking-wide truncate">
                  {service.name}
                </p>
              )}
              <p className="text-sm font-semibold text-foreground mt-0.5 line-clamp-2 leading-snug">
                {service.description}
              </p>
              <div className="flex items-center justify-between mt-2">
                {service && (
                  <span className="flex items-center gap-0.5 text-xs text-foreground-secondary">
                    <Star
                      size={11}
                      className="text-amber-400"
                      fill="currentColor"
                      strokeWidth={0}
                    />
                    {service.basePrice}
                  </span>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
