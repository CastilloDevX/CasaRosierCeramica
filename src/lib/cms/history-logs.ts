import { randomUUID } from "crypto";
import { createAdminClient } from "../supabase/admin";
import { createClient } from "../supabase/server";
import { readJsonFile, writeJsonFile } from "./local-storage";
import { isHistoryLogAction } from "./types";
import type { HistoryLog } from "./types";

const TABLE = "history_logs";
const FILE_NAME = "history-logs.json";

type LogInput = Omit<HistoryLog, "id" | "created_at"> & { id?: string };

// ── Mapping helpers ──

function rowToHistoryLog(row: Record<string, unknown>): HistoryLog {
  return row as unknown as HistoryLog;
}

function historyLogToRow(log: HistoryLog): Record<string, unknown> {
  return { ...log };
}

// ── Supabase helpers ──

async function readAllFromSupabase(): Promise<HistoryLog[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase.from(TABLE).select("*").order("created_at", { ascending: false });
    if (error) throw error;
    if (!data || data.length === 0) return null;
    return (data as Array<Record<string, unknown>>).map(rowToHistoryLog);
  } catch {
    return null;
  }
}

async function readRecentFromSupabase(limit: number): Promise<HistoryLog[] | null> {
  try {
    const supabase = createAdminClient();
    const { data, error } = await supabase
      .from(TABLE)
      .select("*")
      .neq("entity_type", "auth")
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map(rowToHistoryLog);
  } catch {
    return null;
  }
}

async function upsertHistoryLog(log: HistoryLog): Promise<void> {
  try {
    const supabase = createAdminClient();
    await supabase.from(TABLE).upsert(historyLogToRow(log), { onConflict: "id" });
  } catch { /* best-effort */ }
}

async function getCurrentUserIdentity(): Promise<{ user_id: string; user_email: string }> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) return { user_id: user.id, user_email: user.email ?? "system" };
  } catch { /* not in request context */ }
  return { user_id: "system", user_email: "system" };
}

// ── Public API ──

export async function getHistoryLogs() {
  const fromSupabase = await readAllFromSupabase();
  if (fromSupabase) return fromSupabase;
  return readJsonFile<HistoryLog[]>(FILE_NAME, []);
}

export async function getRecentHistoryLogs(limit = 5) {
  const fromSupabase = await readRecentFromSupabase(limit);
  if (fromSupabase) return fromSupabase;
  const items = await readJsonFile<HistoryLog[]>(FILE_NAME, []);
  return items.filter((item) => item.entity_type !== "auth").slice(0, limit);
}

export async function getHistoryLogById(id: string) {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase.from(TABLE).select("*").eq("id", id).maybeSingle();
    if (data) return rowToHistoryLog(data as Record<string, unknown>);
  } catch { /* fall through */ }
  const items = await readJsonFile<HistoryLog[]>(FILE_NAME, []);
  return items.find((l) => l.id === id) ?? null;
}

export async function createHistoryLog(data: LogInput) {
  const items = await readJsonFile<HistoryLog[]>(FILE_NAME, []);
  if (data.action && !isHistoryLogAction(data.action)) throw new Error("Acción no válida.");
  const log: HistoryLog = { ...data, id: data.id ?? randomUUID(), created_at: new Date().toISOString() };
  await writeJsonFile(FILE_NAME, [log, ...items]);
  await upsertHistoryLog(log);
  return log;
}

export async function logAction(data: Omit<LogInput, "id" | "created_at" | "user_id" | "user_email" | "old_data" | "new_data"> & { user_id?: string; user_email?: string; old_data?: unknown; new_data?: unknown }) {
  const identity = await getCurrentUserIdentity();
  return createHistoryLog({
    user_id: data.user_id ?? identity.user_id,
    user_email: data.user_email ?? identity.user_email,
    old_data: null,
    new_data: null,
    ...data,
    id: randomUUID(),
  });
}
