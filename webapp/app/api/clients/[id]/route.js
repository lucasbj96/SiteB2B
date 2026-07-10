import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";

export async function PUT(req, { params }) {
  const { id } = await params;
  const body = await req.json();
  const name = (body.name || "").trim();
  if (!name) return NextResponse.json({ error: "Nome é obrigatório." }, { status: 400 });

  const conn = await db();
  const existing = await conn.execute({ sql: "SELECT id FROM clients WHERE id = ?", args: [id] });
  if (existing.rows.length === 0) {
    return NextResponse.json({ error: "Cliente não encontrado." }, { status: 404 });
  }
  const rec = {
    name,
    sector: (body.sector || "").trim(),
    logo: body.logo || null,
    primary: body.primary || "#3B6EF6",
    secondary: body.secondary || "#10245E",
    isDefault: !!body.isDefault,
  };
  await conn.execute({
    sql: `UPDATE clients SET name=?, sector=?, logo=?, primary_color=?, secondary_color=?, is_default=? WHERE id=?`,
    args: [rec.name, rec.sector, rec.logo, rec.primary, rec.secondary, rec.isDefault ? 1 : 0, id],
  });
  return NextResponse.json({ client: { id, ...rec } });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const conn = await db();
  await conn.execute({ sql: "DELETE FROM clients WHERE id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
