import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GATEWAY_BASE_URL } from "@/config/endpoints";

// Proxies a single product image upload to the gateway. The browser posts a
// multipart body to this same-origin route; we read the HttpOnly `token`
// cookie and forward the file + the caller-supplied `entityId` to the
// gateway with a Bearer header — the same cookie→Bearer bridge used by the
// GraphQL route. A 401 here is caught by the axios client
// (lib/api/client.ts), which refreshes the token and retries.
//
// The gateway forwards the bytes to ekoru-image-processor, which writes the
// final WebP to R2 and returns `{ success, key, imageUrl }` — the URL points
// at the public CDN domain (cdn[-staging].ekoru.cl). We surface a 502 if the
// gateway response is missing a key so callers never silently get nulls in
// the downstream GraphQL mutation.
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const incoming = await req.formData();
  const file = incoming.get("image") ?? incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }

  const entityId = incoming.get("entityId");
  if (typeof entityId !== "string" || !entityId) {
    return NextResponse.json(
      { message: "entityId is required" },
      { status: 400 },
    );
  }

  const forward = new FormData();
  // The gateway expects the field name "image" for product uploads.
  forward.append("image", file, file.name || "upload.jpg");
  forward.append("entityId", entityId);

  // Do NOT set Content-Type — fetch derives the multipart boundary from the
  // FormData body automatically.
  const gatewayUrl = `${GATEWAY_BASE_URL}/api/images/upload/product`;
  const gatewayRes = await fetch(gatewayUrl, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: forward,
  });

  // Capture the raw text first so we can log it even when JSON parsing fails.
  // This is the only place that sees the gateway's actual response.
  const raw = await gatewayRes.text();
  let data: Record<string, unknown> = {};
  try {
    data = raw ? (JSON.parse(raw) as Record<string, unknown>) : {};
  } catch {
    console.error(
      `[products/images] gateway ${gatewayRes.status} returned non-JSON body from ${gatewayUrl}:`,
      raw.slice(0, 500),
    );
    return NextResponse.json(
      {
        message: "Gateway returned a non-JSON response",
        status: gatewayRes.status,
        bodyPreview: raw.slice(0, 200),
      },
      { status: 502 },
    );
  }

  if (gatewayRes.ok && (typeof data.key !== "string" || !data.key)) {
    console.error(
      `[products/images] gateway ${gatewayRes.status} returned 2xx without an R2 key from ${gatewayUrl}:`,
      data,
    );
    return NextResponse.json(
      {
        message: "Gateway response missing R2 image key",
        gatewayBody: data,
      },
      { status: 502 },
    );
  }

  return NextResponse.json(data, { status: gatewayRes.status });
}
