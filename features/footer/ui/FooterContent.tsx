"use client";
import { Text } from "@/components/Text/Text";
import { EKORU_LOGO } from "@/constants/images";
import { useTranslation } from "@/i18n/context";
import clsx from "clsx";
import { Mail, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { FaInstagram, FaLinkedin } from "react-icons/fa6";
import { FooterLinkModal, type FooterLinkKey } from "./FooterLinkModal";

function Divider() {
  return <div className="h-px w-full bg-white/10" />;
}

export function FooterContent() {
  const { t } = useTranslation("footer");
  const [activeModal, setActiveModal] = useState<FooterLinkKey | null>(null);

  const SOCIAL_ICONS = [
    {
      key: "Instagram",
      icon: <FaInstagram size={20} aria-hidden />,
      href: "https://www.instagram.com/ekoru_chile/",
      ariaLabelKey: "a11y.instagram",
    },
    {
      key: "LinkedIn",
      icon: <FaLinkedin size={20} aria-hidden />,
      href: "https://www.linkedin.com/company/ekoru-chile/posts/?feedView=all",
      ariaLabelKey: "a11y.linkedin",
    },
  ];

  const PLATFORM_LINKS = [
    { key: "howItWorks" },
    { key: "forPeople" },
    { key: "forShops" },
    { key: "forCompanies" },
    { key: "ourImpact" },
  ] as const;

  const RESOURCE_LINKS = [
    { key: "blog" },
    { key: "guides" },
    { key: "faq" },
    { key: "helpCenter" },
    { key: "community" },
  ] as const;

  const LEGAL_LINKS = [{ key: "termsAndPolicies" }] as const;

  return (
    <footer
      id="footer"
      aria-label={t("a11y.footerLabel")}
      className={clsx(
        "flex w-full flex-col px-6 pb-8 pt-20",
        "bg-linear-to-br from-primary via-secondary-dark to-primary",
        "text-white",
      )}
    >
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-16 grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col items-center gap-6 md:items-start">
            <Image
              src={EKORU_LOGO}
              alt="Ekoru logo"
              width={4096}
              height={996}
              loading="eager"
              style={{ width: 160, height: "auto" }}
            />
            <Text
              variant="p"
              size="base"
              color="white"
              align="center"
              className="opacity-80 md:text-left"
            >
              {t("slogan")}
            </Text>
            <div className="flex gap-3">
              {SOCIAL_ICONS.map(({ key, icon, href, ariaLabelKey }) => (
                <Link
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(ariaLabelKey)}
                  className={clsx(
                    "flex h-10 w-10 items-center justify-center rounded-full",
                    "bg-white/10 transition-colors hover:bg-primary",
                  )}
                >
                  {icon}
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
            <Text variant="p" size="lg" color="white" weight="bold">
              {t("platform.title")}
            </Text>
            <ul className="flex flex-col gap-2">
              {PLATFORM_LINKS.map(({ key }) => (
                <li key={key}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setActiveModal(key)}
                    className={clsx(
                      "relative text-white/80",
                      "text-sm",
                      "after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white",
                      "after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                      "transition-colors after:duration-300 hover:text-white",
                    )}
                  >
                    {t(`platform.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
            <Text variant="p" size="lg" color="white" weight="bold">
              {t("resources.title")}
            </Text>
            <ul className="flex flex-col gap-2">
              {RESOURCE_LINKS.map(({ key }) => (
                <li key={key}>
                  <button
                    type="button"
                    aria-haspopup="dialog"
                    onClick={() => setActiveModal(key)}
                    className={clsx(
                      "relative text-white/80",
                      "text-sm after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-white",
                      "after:origin-left after:scale-x-0 after:transition-transform hover:after:scale-x-100",
                      "transition-colors after:duration-300 hover:text-white",
                    )}
                  >
                    {t(`resources.${key}`)}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* <div className="flex flex-col items-center gap-4 text-center md:items-start md:text-start">
            <Text variant="p" size="lg" color="white" weight="bold">
              {t("newsletter.title")}
            </Text>
            <Text variant="p" size="sm" color="white" className="opacity-80">
              {t("newsletter.description")}
            </Text>
            <div className="flex w-10/12 gap-2 lg:w-full">
              <input
                id="newsletter-email"
                type="email"
                aria-label={t("a11y.emailInputLabel")}
                placeholder={t("newsletter.placeholder")}
                className={clsx(
                  "flex-1 rounded-full border border-white/20 bg-white/10 px-4 py-2",
                  "text-sm text-white placeholder:text-white/50",
                  "focus:border-primary focus:outline-none",
                )}
              />
              <button
                type="button"
                aria-label={t("a11y.subscribeLabel")}
                className="hover:bg-primary-hover rounded-full bg-primary px-4 py-2 transition-colors"
              >
                <Mail size={18} aria-hidden />
              </button>
            </div>
          </div> */}
        </div>

        <Divider />

        <div className="flex flex-col items-center justify-between gap-4 py-8 md:flex-row">
          <div className="flex items-center gap-2 text-white/80">
            <MapPin size={20} className="text-white" aria-hidden />
            <Text variant="span" size="sm" color="white" className="opacity-80">
              {t("contact.location")}
            </Text>
          </div>
          <div className="flex items-center gap-2 text-white/80">
            <Mail size={20} className="text-white" aria-hidden />
            <Link
              href={`mailto:${t("contact.email")}`}
              aria-label={t("a11y.emailContactLabel")}
              className="text-sm text-white/80 transition-colors"
            >
              {t("contact.email")}
            </Link>
          </div>
        </div>

        <Divider />

        <div className="flex flex-col items-center justify-between gap-4 pt-8 md:flex-row">
          <Text variant="p" size="sm" color="white" className="opacity-60">
            {t("legal.copyright")}
          </Text>
          <div className="flex gap-6">
            {LEGAL_LINKS.map(({ key }) => (
              <Link
                key={key}
                href="/terms-and-policies"
                className="text-sm text-white/60 transition-colors"
              >
                {t(`legal.${key}`)}
              </Link>
            ))}
          </div>
        </div>
      </div>

      <FooterLinkModal activeKey={activeModal} onClose={() => setActiveModal(null)} />
    </footer>
  );
}
