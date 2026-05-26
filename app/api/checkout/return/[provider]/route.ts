import { NextResponse } from "next/server";
import { cookies } from "next/headers";

import { GATEWAY_BASE_URL } from "@/config/endpoints";
import { DEFAULT_LANGUAGE, LANGUAGE_COOKIE } from "@/constants/settings";

/**
 * Payment-provider return endpoint.
 *
 * - Webpay POSTs `token_ws` here after the buyer finishes at Transbank.
 * - Khipu / MercadoPago redirect here with GET and provider-specific query
 *   params (`payment_id`, `collection_id`, etc.).
 *
 * We forward the full request to the gateway so it can commit/confirm the
 * transaction against the provider, then redirect the buyer to the localized
 * confirmation page with the canonical `paymentId` query param. The gateway is
 * the source of truth — never trust the provider's POST body to decide order
 * status here.
 */
type Params = { provider: string };

async function forward(req: Request, { params }: { params: Promise<Params> }, method: "GET" | "POST") {
  const { provider } = await params;
  const cookieStore = await cookies();
  const lang = cookieStore.get(LANGUAGE_COOKIE)?.value || DEFAULT_LANGUAGE;

  const url = new URL(req.url);
  const target = `${GATEWAY_BASE_URL}/payments/return/${provider}${url.search}`;

  const body = method === "POST" ? await req.text() : undefined;
  const contentType = req.headers.get("content-type");

  let gatewayRes: Response;
  try {
    gatewayRes = await fetch(target, {
      method,
      headers: {
        ...(contentType ? { "Content-Type": contentType } : {}),
      },
      body,
      redirect: "manual",
    });
  } catch (err) {
    console.error("[checkout/return] gateway unreachable", err);
    return NextResponse.redirect(
      new URL(`/${lang}/cart/confirmation`, req.url),
      { status: 303 },
    );
  }

  // Gateway should reply with JSON `{ paymentId }` (or include it in a redirect
  // Location). If we get a Location header, mirror it; otherwise build one.
  const location = gatewayRes.headers.get("location");
  if (location) {
    return NextResponse.redirect(new URL(location, req.url), { status: 303 });
  }

  const data = (await gatewayRes.json().catch(() => ({}))) as { paymentId?: string };
  const dest = new URL(`/${lang}/cart/confirmation`, req.url);
  if (data.paymentId) dest.searchParams.set("paymentId", data.paymentId);
  return NextResponse.redirect(dest, { status: 303 });
}

export async function GET(req: Request, ctx: { params: Promise<Params> }) {
  return forward(req, ctx, "GET");
}

export async function POST(req: Request, ctx: { params: Promise<Params> }) {
  return forward(req, ctx, "POST");
}
