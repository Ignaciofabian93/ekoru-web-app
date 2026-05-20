import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { GRAPHQL_URL } from "@/config/endpoints";

export async function POST(req: Request) {
  const body = await req.text();
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body,
  });

  const data = (await res.json().catch(() => ({}))) as unknown;
  return NextResponse.json(data, { status: res.status });
}
