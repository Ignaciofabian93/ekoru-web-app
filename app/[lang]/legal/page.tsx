import { DEFAULT_LANGUAGE, hasLocale } from "@/constants/settings";
import { permanentRedirect } from "next/navigation";

/**
 * `/legal` predates `/terms-and-conditions`, which is where the real terms,
 * privacy and data sections actually live. Rather than keep a second copy of
 * legal text in sync — the surest way to publish two contradictory versions —
 * this route now points at the canonical page.
 */
export default async function LegalPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  const locale = hasLocale(lang) ? lang : DEFAULT_LANGUAGE;
  permanentRedirect(`/${locale}/terms-and-conditions`);
}
