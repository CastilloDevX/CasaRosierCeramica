import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

let adminClient: SupabaseClient | null = null;
const READ_CACHE_TTL_MS = Number(process.env.CMS_SUPABASE_READ_CACHE_MS ?? 10_000);
const readCache = new Map<string, { response: Response; expiresAt: number }>();
const pendingReads = new Map<string, Promise<Response>>();

function headersToCacheKey(headers: HeadersInit | undefined) {
  if (!headers) return "";
  const normalized = new Headers(headers);
  return Array.from(normalized.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, value]) => `${key}:${value}`)
    .join("|");
}

function getRequestCacheKey(input: RequestInfo | URL, init?: RequestInit) {
  const request = input instanceof Request ? input : null;
  const method = (init?.method ?? request?.method ?? "GET").toUpperCase();
  const url = input instanceof Request ? input.url : String(input);
  const headers = headersToCacheKey(init?.headers ?? request?.headers);
  return `${method}:${url}:${headers}`;
}

async function cachedAdminFetch(input: RequestInfo | URL, init?: RequestInit) {
  const request = input instanceof Request ? input : null;
  const method = (init?.method ?? request?.method ?? "GET").toUpperCase();

  if (method !== "GET" && method !== "HEAD") {
    readCache.clear();
    pendingReads.clear();
    return fetch(input, init);
  }

  const key = getRequestCacheKey(input, init);
  const cached = readCache.get(key);
  if (cached && cached.expiresAt > Date.now()) {
    return cached.response.clone();
  }

  const pending = pendingReads.get(key);
  if (pending) {
    const response = await pending;
    return response.clone();
  }

  const requestPromise = fetch(input, init)
    .then((response) => {
      if (response.ok && READ_CACHE_TTL_MS > 0) {
        readCache.set(key, { response: response.clone(), expiresAt: Date.now() + READ_CACHE_TTL_MS });
      }
      return response;
    })
    .finally(() => {
      pendingReads.delete(key);
    });

  pendingReads.set(key, requestPromise);
  const response = await requestPromise;
  return response.clone();
}

export function createAdminClient() {
  if (adminClient) return adminClient;

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing Supabase admin environment variables. Define NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }

  adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
    global: { fetch: cachedAdminFetch },
  });
  return adminClient;
}
