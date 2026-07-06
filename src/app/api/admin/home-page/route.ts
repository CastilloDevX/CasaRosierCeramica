import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { getHomePageSettings, updateHomePageSettings } from "@/lib/cms/home-page";

export async function GET() {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ page: await getHomePageSettings() });
}

export async function PUT(request: Request) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const page = await updateHomePageSettings(await request.json());
    return NextResponse.json({ page });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo guardar la home." }, { status: 400 });
  }
}
