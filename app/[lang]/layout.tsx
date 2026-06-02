import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cabin } from "next/font/google";

import { hasLocale, SUPPORTED_LANGUAGES } from "@/constants/settings";
import {
  SITE_URL,
  SITE_NAME,
  OG_LOCALE,
  HREFLANG,
  buildLanguageAlternates,
} from "@/config/site";
import { getDictionary } from "@/i18n/dictionaries";
import { DictionaryProvider } from "@/i18n/context";
import { ApolloWrapper } from "@/lib/apollo/ApolloWrapper";
import { DrawerProvider } from "@/context/DrawerContext";
import Drawer from "@/components/Drawer/Drawer";
import { ToastProvider } from "@/components/Toast/ToastProvider";
import {
  getDrawerDictionary,
  NAMESPACE as DRAWER_NAMESPACE,
} from "@/components/Drawer/i18n";

const cabin = Cabin({
  variable: "--font-cabin",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#65a30d",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
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
    metadataBase: new URL(SITE_URL),
    title: {
      default: dict.metadata.title,
      template: `%s | ${SITE_NAME}`,
    },
    description: dict.metadata.description,
    applicationName: SITE_NAME,
    keywords: [
      "sustainability",
      "circular economy",
      "eco",
      "marketplace",
      "recycle",
      "green",
      "sostenible",
      "economía circular",
      "reciclar",
    ],
    authors: [{ name: SITE_NAME }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
    category: "shopping",
    formatDetection: { telephone: false, email: false, address: false },
    icons: {
      icon: "/favicon.ico",
      shortcut: "/favicon.ico",
      apple: "/brand/icon.webp",
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      type: "website",
      siteName: SITE_NAME,
      title: dict.metadata.title,
      description: dict.metadata.description,
      url: `/${lang}`,
      locale: OG_LOCALE[lang] ?? OG_LOCALE.es,
      alternateLocale: SUPPORTED_LANGUAGES.filter((l) => l !== lang).map(
        (l) => OG_LOCALE[l],
      ),
      images: [
        {
          url: "/brand/logo.webp",
          alt: SITE_NAME,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.metadata.title,
      description: dict.metadata.description,
      images: ["/brand/logo.webp"],
    },
    alternates: {
      canonical: `/${lang}`,
      languages: buildLanguageAlternates(),
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
    <html
      lang={HREFLANG[lang] ?? lang}
      className={`${cabin.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground overflow-x-hidden">
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
        <ToastProvider />
      </body>
    </html>
  );
}
