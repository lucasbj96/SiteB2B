import { NextResponse } from "next/server";
import { db } from "../../../lib/db";

function rowToClient(r) {
  return {
    id: r.id,
    name: r.name,
    sector: r.sector || "",
    logo: r.logo || null,
    primary: r.primary_color,
    secondary: r.secondary_color,
    isDefault: !!r.is_default,
  };
}

export async function GET() {
  const conn = await db();
  const { rows } = await conn.execute("SELECT * FROM clients ORDER BY created_at DESC");
  return NextResponse.json({ clients: rows.map(rowToClient) });
}

export async function POST(req) {
  const body = await req.json();
  const name = (body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });

  const conn = await db();
  const id = "c" + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  const rec = {
    id,
    name,
    sector: (body.sector || "").trim(),
    logo: body.logo || null,
    primary: body.primary || "#3B6EF6",
    secondary: body.secondary || "#10245E",
    isDefault: !!body.isDefault,
  };
  await conn.execute({
    sql: `INSERT INTO clients (id, name, sector, logo, primary_color, secondary_color, is_default, created_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [rec.id, rec.name, rec.sector, rec.logo, rec.primary, rec.secondary, rec.isDefault ? 1 : 0, new Date().toISOString()],
  });
  return NextResponse.json({ client: rec }, { status: 201 });
}
