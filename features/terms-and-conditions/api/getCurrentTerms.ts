import "server-only";
import { headers } from "next/headers";
import { gatewayFetch, gatewayHeaders } from "@/lib/api/gateway";
import { CURRENT_TERMS_DOCUMENT } from "@/graphql/legal/terms";
import type { SupportedLanguage } from "@/constants/settings";

export type TermsBlockKind = "HEADING" | "SUBHEADING" | "PARAGRAPH" | "LIST_ITEM";

export interface TermsDocument {
  version: number;
  publishedAt: string;
  language: string;
  title: string;
  summary: string | null;
  blocks: { kind: TermsBlockKind; text: string }[];
}

/**
 * The terms in force, from the API (LEG-1): the panel edits them, so the page
 * reads them on each visit instead of carrying a copy. Null when the API
 * can't be reached or nothing is published; the page then says so.
 */
export async function getCurrentTerms(lang: SupportedLanguage): Promise<TermsDocument | null> {
  try {
    const visitor = gatewayHeaders({ headers: await headers() } as unknown as Request);
    const res = await gatewayFetch("/graphql", {
      method: "POST",
      headers: { "content-type": "application/json", ...visitor },
      body: JSON.stringify({
        query: CURRENT_TERMS_DOCUMENT,
        variables: { language: lang.toUpperCase() },
      }),
      cache: "no-store",
    });
    if (!res.ok) return null;
    const json = (await res.json()) as { data?: { currentTerms: TermsDocument | null } };
    return json.data?.currentTerms ?? null;
  } catch (err) {
    console.error("[terms] could not load the terms in force", err);
    return null;
  }
}
