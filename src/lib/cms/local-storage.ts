import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");

async function ensureDataDir() {
  await mkdir(DATA_DIR, { recursive: true });
}

export function resolveDataPath(filename: string) {
  return path.join(DATA_DIR, filename);
}

export async function readJsonFile<T>(filename: string, fallback: T): Promise<T> {
  await ensureDataDir();
  const filePath = resolveDataPath(filename);

  try {
    const raw = await readFile(filePath, "utf8");
    if (!raw.trim()) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    await writeJsonFile(filename, fallback);
    return fallback;
  }
}

export async function writeJsonFile<T>(filename: string, value: T) {
  await ensureDataDir();
  const filePath = resolveDataPath(filename);
  await writeFile(filePath, `${JSON.stringify(value, null, 2)}\n`, "utf8");
}

// Esta capa se reemplazará por Supabase cuando el CMS salga de modo local.
