import { NextResponse, type NextRequest } from "next/server";
import {
  COUNTRY_COOKIE,
  DEFAULT_LANGUAGE,
  hasCountry,
  LANGUAGE_COOKIE,
  SUPPORTED_LANGUAGES,
} from "@/constants/settings";
import { getLanguagesForCountry } from "@/constants/language-data";
import { COOKIE_MAX_AGE_SECONDS } from "@/utils/cookies";

// Patterns evaluated AFTER the leading `/[lang]` segment is stripped.
const PROTECTED_PATTERNS: RegExp[] = [
  /^\/profile(\/|$)/,
  /^\/cart\/checkout(\/|$)/,
  /^\/cart\/confirmation(\/|$)/,
  /^\/publish(\/|$)/,
];

const SUPPORTED = SUPPORTED_LANGUAGES as readonly string[];

/**
 * Headers carrying the visitor's ISO country, in priority order. Which one (if
 * any) is present depends on what fronts the container — Cloudflare adds
 * `cf-ipcountry` to every proxied request; nginx needs the GeoIP2 module. When
 * none are set, detection degrades to the browser's Accept-Language.
 */
const COUNTRY_HEADERS = [
  "cf-ipcountry", // Cloudflare
  "x-vercel-ip-country", // Vercel
  "cloudfront-viewer-country", // AWS CloudFront
  "x-geo-country", // nginx GeoIP2 / custom reverse proxy
] as const;

// Cloudflare sends XX when the IP can't be resolved and T1 for Tor exit nodes.
const UNKNOWN_COUNTRIES = new Set(["XX", "T1"]);

/**
 * The visitor's market: a pick made in the LocaleSwitcher wins, then whatever
 * the edge reports about their IP. `null` when neither is available.
 */
function getCountry(request: NextRequest): string | null {
  const saved = request.cookies.get(COUNTRY_COOKIE)?.value?.trim().toUpperCase() ?? "";
  if (hasCountry(saved)) return saved;

  for (const header of COUNTRY_HEADERS) {
    const value = request.headers.get(header)?.trim().toUpperCase();
    if (value && !UNKNOWN_COUNTRIES.has(value)) return value;
  }
  return null;
}

/**
 * Seeds the market cookie on first contact so a guest's search results are
 * scoped to where they actually are instead of the `CL` default. Skipped once
 * the cookie holds a real choice, and for countries outside the served markets
 * (a visitor from Mexico keeps falling back to the default).
 *
 * Attributes mirror `utils/cookies.ts` so the LocaleSwitcher overwrites this
 * value in place rather than creating a second cookie of the same name.
 */
function seedCountry(
  request: NextRequest,
  response: NextResponse,
  country: string | null,
): NextResponse {
  const saved = request.cookies.get(COUNTRY_COOKIE)?.value?.trim().toUpperCase() ?? "";
  if (hasCountry(saved)) return response;
  if (!country || !hasCountry(country)) return response;

  response.cookies.set(COUNTRY_COOKIE, country, {
    path: "/",
    maxAge: COOKIE_MAX_AGE_SECONDS,
    sameSite: "lax",
  });
  return response;
}

/** Base language codes from Accept-Language, most preferred first. */
function getAcceptedLanguages(request: NextRequest): string[] {
  return (request.headers.get("Accept-Language") ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.split(";");
      const quality = Number(
        params.find((p) => p.trim().startsWith("q="))?.split("=")[1] ?? 1,
      );
      return {
        code: tag.split("-")[0].trim().toLowerCase(),
        quality: Number.isNaN(quality) ? 0 : quality,
      };
    })
    .filter((entry) => entry.code && entry.code !== "*")
    .sort((a, b) => b.quality - a.quality)
    .map((entry) => entry.code);
}

function getLocale(request: NextRequest, country: string | null): string {
  // An explicit choice always wins over anything we infer.
  const cookieLang = request.cookies.get(LANGUAGE_COOKIE)?.value ?? "";
  if (SUPPORTED.includes(cookieLang)) return cookieLang;

  const accepted = getAcceptedLanguages(request);

  // With a known origin, only languages consistent with that market are on the
  // table (US → en/es, CA → en/fr, CL → es). The browser preference picks among
  // them, so a Spanish speaker visiting from the US still lands on `es` while
  // everyone else there gets `en`.
  if (country) {
    const allowed = getLanguagesForCountry(country) as readonly string[];
    return (
      accepted.find((code) => allowed.includes(code)) ?? allowed[0] ?? DEFAULT_LANGUAGE
    );
  }

  return accepted.find((code) => SUPPORTED.includes(code)) ?? DEFAULT_LANGUAGE;
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  // Resolved once and threaded through: every branch seeds the market cookie,
  // since plenty of visitors land straight on `/en/...` from search or a shared
  // link and never pass through the redirect below.
  const country = getCountry(request);

  const segments = pathname.split("/");
  const maybeLang = segments[1] ?? "";
  const hasLangPrefix = SUPPORTED.includes(maybeLang);

  if (!hasLangPrefix) {
    const locale = getLocale(request, country);
    request.nextUrl.pathname = `/${locale}${pathname}`;
    const redirect = NextResponse.redirect(request.nextUrl);
    // This redirect now depends on the visitor, so an edge cache must never
    // replay one country's `/en` hop for the next country's request.
    redirect.headers.set("Vary", "Cookie, Accept-Language, CF-IPCountry");
    return seedCountry(request, redirect, country);
  }

  const rest = `/${segments.slice(2).join("/")}`;
  const isProtected = PROTECTED_PATTERNS.some((rx) => rx.test(rest));
  if (!isProtected) return seedCountry(request, NextResponse.next(), country);

  // Either cookie is enough: if only `refreshToken` is present, the axios
  // client will exchange it for a fresh `token` on the first 401.
  const hasSession = request.cookies.has("token") || request.cookies.has("refreshToken");
  if (hasSession) return seedCountry(request, NextResponse.next(), country);

  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${maybeLang}/login`;
  loginUrl.search = "";
  loginUrl.searchParams.set("redirectTo", pathname + search);
  return seedCountry(request, NextResponse.redirect(loginUrl), country);
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
