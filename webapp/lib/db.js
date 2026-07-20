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
        stats TEXT,
        blocks TEXT,
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
        reasons_title TEXT,
        reasons_subtitle TEXT,
        reasons TEXT,
        consultor_title TEXT,
        consultor_subtitle TEXT,
        updated_at TEXT
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      )`,
    ],
    "write"
  );
  // Idempotent column additions for deployments created before stats/blocks
  // editing existed. SQLite has no "ADD COLUMN IF NOT EXISTS", so we probe
  // the schema and only add what's missing.
  const { rows } = await db.execute("PRAGMA table_info(product_overrides)");
  const cols = new Set(rows.map((r) => r.name));
  if (!cols.has("stats")) await db.execute("ALTER TABLE product_overrides ADD COLUMN stats TEXT");
  if (!cols.has("blocks")) await db.execute("ALTER TABLE product_overrides ADD COLUMN blocks TEXT");

  const { rows: homeCols } = await db.execute("PRAGMA table_info(home_content)");
  const hcCols = new Set(homeCols.map((r) => r.name));
  if (!hcCols.has("reasons_title")) await db.execute("ALTER TABLE home_content ADD COLUMN reasons_title TEXT");
  if (!hcCols.has("reasons_subtitle")) await db.execute("ALTER TABLE home_content ADD COLUMN reasons_subtitle TEXT");
  if (!hcCols.has("reasons")) await db.execute("ALTER TABLE home_content ADD COLUMN reasons TEXT");
  if (!hcCols.has("consultor_title")) await db.execute("ALTER TABLE home_content ADD COLUMN consultor_title TEXT");
  if (!hcCols.has("consultor_subtitle")) await db.execute("ALTER TABLE home_content ADD COLUMN consultor_subtitle TEXT");
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
