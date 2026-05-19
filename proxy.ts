import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { DEFAULT_LANGUAGE, SUPPORTED_LANGUAGES } from "@/constants/settings";

function getLocale(request: NextRequest): string {
  const acceptLang = request.headers.get("Accept-Language") ?? "";
  // Parse the first language code from Accept-Language header
  const firstCode =
    acceptLang.split(",")[0]?.split("-")[0]?.trim().toLowerCase() ?? "";
  return (SUPPORTED_LANGUAGES as readonly string[]).includes(firstCode)
    ? firstCode
    : DEFAULT_LANGUAGE;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const pathnameHasLocale = (SUPPORTED_LANGUAGES as readonly string[]).some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) return;

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ["/((?!api|_next|favicon.ico|.*\\..*).*)"],
};
