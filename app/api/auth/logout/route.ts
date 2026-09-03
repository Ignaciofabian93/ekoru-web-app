import { NextResponse } from "next/server";
import { GATEWAY_BASE_URL } from "@/config/endpoints";
import { forwardSetCookies } from "@/lib/api/forwardCookies";
import { SESSION_COOKIES } from "@/utils/cookies";

/**
 * Whether the browser reached us over TLS. A `Secure` cookie can only be
 * overwritten from a secure context, so the expiry we emit has to carry the
 * same flag the login response did — otherwise the delete is ignored in prod
 * and the session survives the logout.
 */
function isSecureRequest(req: Request): boolean {
  const forwarded = req.headers.get("x-forwarded-proto")?.split(",")[0].trim();
  if (forwarded) return forwarded === "https";
  return new URL(req.url).protocol === "https:";
}

export async function POST(req: Request) {
  const cookieHeader = req.headers.get("cookie") ?? "";

  const gatewayRes = await fetch(`${GATEWAY_BASE_URL}/session/logout`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookieHeader,
    },
    body: "{}",
  });

  const data = await gatewayRes.json().catch(() => ({ success: true }));
  const res = NextResponse.json(data, { status: gatewayRes.status });

  // Gateway emits `clearCookie` Set-Cookie headers; forward them so the
  // browser drops the local cookies even if it ignored the gateway's domain.
  forwardSetCookies(gatewayRes, res);

  // ...and expire them ourselves regardless of what the gateway said. The
  // cookies live on *this* origin — the login route re-emitted them here — so
  // ending the session is our responsibility, not something to delegate to an
  // upstream response that may 5xx, time out, or clear under attributes the
  // browser won't match. Without this, `token` survives logout and the next
  // page load re-authenticates through `AuthHydrator`'s `me` query; if only
  // `refreshToken` survived, Apollo's error link would silently mint a new
  // access token and do the same.
  const secure = isSecureRequest(req);
  for (const name of SESSION_COOKIES) {
    res.cookies.set(name, "", {
      path: "/",
      maxAge: 0,
      expires: new Date(0),
      httpOnly: true,
      sameSite: "lax",
      secure,
    });
  }

  return res;
}
