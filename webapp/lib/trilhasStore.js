import { db } from "./db";
import { TRILHAS } from "./products";

const KEY = "trilhas_data";

export async function getTrilhas() {
  const conn = await db();
  const { rows } = await conn.execute({ sql: "SELECT value FROM settings WHERE key = ?", args: [KEY] });
  if (!rows.length) return TRILHAS;
  try {
    const parsed = JSON.parse(rows[0].value);
    if (Array.isArray(parsed) && parsed.length) return parsed;
  } catch {}
  return TRILHAS;
}

export async function saveTrilhas(items) {
  const conn = await db();
  await conn.execute({
    sql: `INSERT INTO settings (key, value) VALUES (?, ?)
          ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
    args: [KEY, JSON.stringify(items)],
  });
}

export async function resetTrilhas() {
  const conn = await db();
  await conn.execute({ sql: "DELETE FROM settings WHERE key = ?", args: [KEY] });
}
