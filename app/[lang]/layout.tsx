import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { hasLocale, SUPPORTED_LANGUAGES } from "@/constants/settings";
import { getDictionary } from "@/i18n/dictionaries";
import { DictionaryProvider } from "@/i18n/context";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { DrawerProvider } from "@/context/DrawerContext";
import Drawer from "@/components/Drawer/Drawer";
import {
  getDrawerDictionary,
  NAMESPACE as DRAWER_NAMESPACE,
} from "@/components/Drawer/i18n";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://ekoru.cl";

const OG_LOCALE: Record<string, string> = {
  en: "en_US",
  es: "es_ES",
  fr: "fr_FR",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string }>;
}): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const dict = await getDictionary(lang);

  return {
    metadataBase: new URL(BASE_URL),
    title: {
      default: dict.metadata.title,
      template: `%s | Ekoru`,
    },
    description: dict.metadata.description,
    keywords: [
      "sustainability",
      "circular economy",
      "eco",
      "marketplace",
      "recycle",
      "green",
      "sostenible",
    ],
    authors: [{ name: "Ekoru" }],
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: "Ekoru",
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `/${lang}`,
      locale: OG_LOCALE[lang] ?? "es_ES",
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.description,
    },
    alternates: {
      canonical: `/${lang}`,
      languages: {
        en: "/en",
        es: "/es",
        fr: "/fr",
      },
    },
  };
}

export async function generateStaticParams() {
  return SUPPORTED_LANGUAGES.map((lang) => ({ lang }));
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;

  if (!hasLocale(lang)) notFound();

  const [dict, drawerDict] = await Promise.all([
    getDictionary(lang),
    getDrawerDictionary(lang),
  ]);

  return (
    <ApolloWrapper>
      <DictionaryProvider dictionary={dict}>
        <DictionaryProvider dictionary={{ [DRAWER_NAMESPACE]: drawerDict }}>
          <DrawerProvider>
            {children}
            <Drawer />
          </DrawerProvider>
        </DictionaryProvider>
      </DictionaryProvider>
    </ApolloWrapper>
  );
}
