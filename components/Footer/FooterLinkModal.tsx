"use client";

import { Modal } from "@/components/Overlays/Modal";
import { Text } from "@/components/Primitives/Text";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import {
  BookOpen,
  Building2,
  Check,
  Globe,
  Heart,
  HelpCircle,
  Leaf,
  LifeBuoy,
  Map,
  ShoppingBag,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { type ReactNode } from "react";
import { FaApple, FaGooglePlay } from "react-icons/fa6";
import { NAMESPACE } from "./i18n";
import type { FooterLinkKey } from "./types";

interface FooterLinkModalProps {
  activeKey: FooterLinkKey | null;
  onClose: () => void;
}

const LINK_ICONS: Record<FooterLinkKey, ReactNode> = {
  howItWorks: <Zap size={28} />,
  forPeople: <Users size={28} />,
  forShops: <ShoppingBag size={28} />,
  forCompanies: <Building2 size={28} />,
  ourImpact: <Leaf size={28} />,
  blog: <BookOpen size={28} />,
  guides: <Map size={28} />,
  faq: <HelpCircle size={28} />,
  helpCenter: <LifeBuoy size={28} />,
  community: <Heart size={28} />,
};

const IOS_URL = "https://apps.apple.com/app/ekoru";
const ANDROID_URL = "https://play.google.com/store/apps/ekoru";
const WEB_URL = "https://app.ekoru.cl";

export function FooterLinkModal({ activeKey, onClose }: FooterLinkModalProps) {
  const { t } = useTranslation(NAMESPACE);

  return (
    <Modal
      isOpen={!!activeKey}
      onClose={onClose}
      title={activeKey ? t(`modal.${activeKey}.title`) : ""}
      closeLabel={t("a11y.closeModal")}
      size="md"
    >
      {activeKey && (
        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary"
              aria-hidden
            >
              {LINK_ICONS[activeKey]}
            </div>
            <Text variant="p" size="sm" className="mt-1">
              {t(`modal.${activeKey}.description`)}
            </Text>
          </div>

          <ul className="flex flex-col gap-3">
            {(["point1", "point2", "point3"] as const).map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                  aria-hidden
                >
                  <Check size={11} strokeWidth={3} />
                </span>
                <Text variant="span" size="sm">
                  {t(`modal.${activeKey}.${point}`)}
                </Text>
              </li>
            ))}
          </ul>

          <div className="flex flex-col gap-3 border-t border-border-light pt-2">
            <Text variant="p" size="sm" align="center" weight="semibold">
              {t("modal.cta.downloadLabel")}
            </Text>
            <div className="flex flex-wrap gap-2">
              <Link
                href={IOS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "min-w-35 flex flex-1 items-center justify-center gap-2 bg-foreground",
                  "rounded-xl px-4 py-2.5 transition-opacity hover:opacity-80",
                )}
              >
                <FaApple size={18} color="#fff" aria-hidden />
                <Text variant="span" size="sm" color="white">
                  {t("modal.cta.ios")}
                </Text>
              </Link>
              <Link
                href={ANDROID_URL}
                target="_blank"
                rel="noopener noreferrer"
                className={clsx(
                  "min-w-35 flex flex-1 items-center justify-center gap-2 bg-foreground",
                  "rounded-xl px-4 py-2.5 transition-opacity hover:opacity-80",
                )}
              >
                <FaGooglePlay size={16} color="#fff" aria-hidden />
                <Text variant="span" size="sm" color="white">
                  {t("modal.cta.android")}
                </Text>
              </Link>
            </div>
            <Link
              href={WEB_URL}
              target="_blank"
              rel="noopener noreferrer"
              className={clsx(
                "flex items-center justify-center gap-2 border border-border-light",
                "rounded-xl px-4 py-2.5 transition-colors hover:border-foreground",
              )}
            >
              <Globe size={16} aria-hidden />
              <Text variant="span" size="sm">
                {t("modal.cta.web")}
              </Text>
            </Link>
          </div>
        </div>
      )}
    </Modal>
  );
}
