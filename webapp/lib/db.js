import { createClient } from "@libsql/client";

let client;
let ready;

function getClient() {
  if (!client) {
    const url = process.env.TURSO_DATABASE_URL;
    const authToken = process.env.TURSO_AUTH_TOKEN;
    if (!url) {
      throw new Error(
        "TURSO_DATABASE_URL não está configurada. Defina as variáveis de ambiente do Turso."
      );
    }
    client = createClient({ url, authToken });
  }
  return client;
}

async function migrate() {
  const db = getClient();
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS clients (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        sector TEXT,
        logo TEXT,
        primary_color TEXT,
        secondary_color TEXT,
        is_default INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS product_overrides (
        product_id TEXT PRIMARY KEY,
        name TEXT,
        tag TEXT,
        pitch TEXT,
        manifesto TEXT,
        body TEXT,
        points TEXT,
        cta_title TEXT,
        cta_sub TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS home_content (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        eyebrow TEXT,
        heading_pre TEXT,
        heading_accent TEXT,
        heading_post TEXT,
        lead TEXT,
        section_eyebrow TEXT,
        section_title TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )`,
    ],
    "write"
  );
}

async function seed() {
  const conn = getClient();
  const { rows } = await conn.execute("SELECT COUNT(*) AS n FROM clients");
  if (Number(rows[0].n) > 0) return;
  await conn.execute({
    sql: `INSERT INTO clients (id, name, sector, logo, primary_color, secondary_color, is_default, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [
      "catolica-default",
      "Católica SC (padrão)",
      "",
      "/assets/catolica-logo.png",
      "#900B40",
      "#4F0623",
      1,
      new Date().toISOString(),
    ],
  });
}

export async function db() {
  if (!ready) ready = migrate().then(seed);
  await ready;
  return getClient();
}
