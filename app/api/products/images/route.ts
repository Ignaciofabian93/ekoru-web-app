import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GATEWAY_BASE_URL } from "@/config/endpoints";

// Proxies a single product image upload to the gateway. The browser posts a
// multipart body to this same-origin route; we read the HttpOnly `token`
// cookie and forward the file to the gateway with a Bearer header — the same
// cookie→Bearer bridge used by the GraphQL route. A 401 here is caught by the
// axios client (lib/api/client.ts), which refreshes the token and retries.
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const incoming = await req.formData();
  const file = incoming.get("image") ?? incoming.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }

  const forward = new FormData();
  // The gateway expects the field name "image" for product uploads.
  forward.append("image", file, file.name || "upload.jpg");

  // Do NOT set Content-Type — fetch derives the multipart boundary from the
  // FormData body automatically.
  const gatewayRes = await fetch(`${GATEWAY_BASE_URL}/api/images/upload/product`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: forward,
  });

  const data = (await gatewayRes.json().catch(() => ({}))) as Record<string, unknown>;

  // Always rebuild the absolute URL from GATEWAY_BASE_URL + imagePath so the
  // value is independent of how the gateway configured its own external host.
  if (typeof data.imagePath === "string") {
    data.imageUrl = `${GATEWAY_BASE_URL}${data.imagePath}`;
  }

  return NextResponse.json(data, { status: gatewayRes.status });
}
