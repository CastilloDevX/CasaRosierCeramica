import { requireAdminApi } from "@/lib/auth/supabase-auth";
import { getHistoryLogs } from "@/lib/cms/history-logs";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  if (!(await requireAdminApi())) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const action = request.nextUrl.searchParams.get("action") || undefined;
  const entityType = request.nextUrl.searchParams.get("entity_type") || undefined;
  const date = request.nextUrl.searchParams.get("date") || undefined;
  let items = await getHistoryLogs();
  if (action) items = items.filter((x) => x.action === action);
  if (entityType) items = items.filter((x) => x.entity_type === entityType);
  if (date) items = items.filter((x) => x.created_at.startsWith(date));
  return NextResponse.json({ logs: items });
}
