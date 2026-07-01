import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { createSocialGallery, getSocialGalleries } from "@/lib/cms/social-galleries";
import { type NextRequest, NextResponse } from "next/server";

export async function GET() {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await getSocialGalleries();
  return NextResponse.json({ socialGalleries: items });
}

export async function POST(request: NextRequest) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await request.json();
  try { const item = await createSocialGallery(body); return NextResponse.json({ socialGallery: item }); }
  catch (err) { return NextResponse.json({ error: err instanceof Error ? err.message : "Error" }, { status: 400 }); }
}
