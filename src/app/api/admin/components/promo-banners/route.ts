import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { createPromoBanner, getPromoBanners } from "@/lib/cms/promo-banners";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const status = request.nextUrl.searchParams.get("status") || undefined;
  let items = await getPromoBanners(); if (status) items = items.filter((x) => x.status === status);
  return NextResponse.json({ promoBanners: items });
}
export async function POST(request: NextRequest) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json(); if (!body?.title) return NextResponse.json({ error: "El título es obligatorio." }, { status: 400 });
  try { const item = await createPromoBanner(body); return NextResponse.json({ promoBanner: item }); }
  catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 400 }); }
}
