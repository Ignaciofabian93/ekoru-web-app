import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GATEWAY_BASE_URL } from "@/config/endpoints";

// Proxies a cover image upload to the gateway's POST /api/cover-image.
// The gateway authenticates via the Bearer token, deletes the old R2 object,
// uploads the new WebP to R2 via ekoru-image-processor (resized to 1200×400),
// and persists the R2 key in the DB (PersonProfile.coverImage or
// BusinessProfile.coverImage depending on sellerType). Accepts JPEG, PNG, WebP.
export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const incoming = await req.formData();
  const file = incoming.get("file") ?? incoming.get("image");
  if (!(file instanceof File)) {
    return NextResponse.json({ message: "No image provided" }, { status: 400 });
  }

  const forward = new FormData();
  forward.append("file", file, file.name || "cover.jpg");

  const gatewayRes = await fetch(`${GATEWAY_BASE_URL}/api/cover-image`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: forward,
  });

  const data = (await gatewayRes.json().catch(() => ({}))) as Record<string, unknown>;
  return NextResponse.json(data, { status: gatewayRes.status });
}
