import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

const DEFAULTS = {
  whatsappNumber: "5547999340133",
};

export async function GET() {
  const conn = await db();
  const { rows } = await conn.execute("SELECT key, value FROM settings");
  const settings = { ...DEFAULTS };
  rows.forEach((r) => (settings[r.key] = r.value));
  return NextResponse.json({ settings });
}

export async function PUT(req) {
  const body = await req.json();
  const conn = await db();
  const entries = Object.entries(body || {});
  for (const [key, value] of entries) {
    await conn.execute({
      sql: `INSERT INTO settings (key, value) VALUES (?, ?)
            ON CONFLICT(key) DO UPDATE SET value=excluded.value`,
      args: [key, String(value)],
    });
  }
  return NextResponse.json({ ok: true });
}
