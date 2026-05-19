import { NextResponse, type NextRequest } from "next/server";
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from "@/constants/settings";

// Patterns evaluated AFTER the leading `/[lang]` segment is stripped.
// Add new authenticated areas here; everything not listed is public.
const PROTECTED_PATTERNS: RegExp[] = [
  /^\/profile(\/|$)/,
  /^\/cart\/checkout(\/|$)/,
  /^\/cart\/confirmation(\/|$)/,
  /^\/publish(\/|$)/,
];

const SUPPORTED = SUPPORTED_LANGUAGES as readonly string[];

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  const segments = pathname.split("/");
  const maybeLang = segments[1] ?? "";
  const hasLangPrefix = SUPPORTED.includes(maybeLang);
  const lang = hasLangPrefix ? maybeLang : DEFAULT_LANGUAGE;
  const rest = hasLangPrefix ? `/${segments.slice(2).join("/")}` : pathname;

  const isProtected = PROTECTED_PATTERNS.some((rx) => rx.test(rest));
  if (!isProtected) return NextResponse.next();

  // Either cookie is enough: if only `refreshToken` is present, the axios
  // client will exchange it for a fresh `token` on the first 401.
  const hasSession =
    req.cookies.has("token") || req.cookies.has("refreshToken");
  if (hasSession) return NextResponse.next();

  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = `/${lang}/login`;
  loginUrl.search = "";
  loginUrl.searchParams.set("redirectTo", pathname + search);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  // Skip middleware for API routes, Next.js internals, and static assets.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
