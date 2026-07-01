import { NextResponse, type NextRequest } from "next/server";
import { createOffering, getOfferings } from "@/lib/cms/offerings";
import { requireAdminApi } from "@/lib/auth/supabase-auth";

export async function GET(request: NextRequest) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const offerings = await getOfferings();
  return NextResponse.json({ offerings });
}

export async function POST(request: NextRequest) {
  const session = await requireAdminApi();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  if (!body?.title || !body?.type) {
    return NextResponse.json({ error: "El título y el tipo son obligatorios." }, { status: 400 });
  }

  try {
    const offering = await createOffering(body);
    return NextResponse.json({ offering });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "No se pudo crear el offering" }, { status: 400 });
  }
}
