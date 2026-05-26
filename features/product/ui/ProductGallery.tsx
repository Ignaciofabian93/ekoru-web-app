"use client";

import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { useTranslation } from "@/i18n/context";
import { resolveImageUrl } from "@/utils/resolveImage";

import { NAMESPACE } from "../i18n";

interface Props {
  name: string;
  images: string[];
}

export function ProductGallery({ name, images }: Props) {
  const { t } = useTranslation(NAMESPACE);
  const [index, setIndex] = useState(0);

  const urls = images.map((img) => resolveImageUrl(img)).filter(Boolean) as string[];
  const total = urls.length;
  const current = urls[index];

  function go(delta: number) {
    if (total === 0) return;
    setIndex((prev) => (prev + delta + total) % total);
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="bg-background-secondary relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl border border-border-light">
        {current ? (
          <Image
            src={current}
            alt={t("gallery.imageAlt", {
              name,
              index: String(index + 1),
              total: String(total),
            })}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 600px"
            className="object-contain"
            priority={index === 0}
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-foreground-muted">
            <ImageOff size={48} strokeWidth={1.5} />
            <span className="text-sm">{t("gallery.noImage")}</span>
          </div>
        )}

        {total > 1 && (
          <>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label={t("gallery.previous")}
              className="absolute top-1/2 left-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-sm transition hover:bg-white"
            >
              <ChevronLeft size={20} strokeWidth={2} />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label={t("gallery.next")}
              className="absolute top-1/2 right-3 flex size-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-foreground shadow-sm transition hover:bg-white"
            >
              <ChevronRight size={20} strokeWidth={2} />
            </button>
            <div className="absolute right-3 bottom-3 rounded-full bg-black/60 px-2.5 py-1 text-xs font-medium text-white">
              {index + 1} / {total}
            </div>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {urls.map((url, i) => (
            <button
              key={url + i}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={t("gallery.goToImage", { index: String(i + 1) })}
              aria-current={i === index}
              className={`bg-background-secondary relative size-16 shrink-0 overflow-hidden rounded-lg border-2 transition ${
                i === index
                  ? "border-primary"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={url}
                alt={t("gallery.thumbnailAlt", { index: String(i + 1) })}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
