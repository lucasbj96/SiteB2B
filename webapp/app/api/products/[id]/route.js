import { NextResponse } from "next/server";
import { db } from "../../../../lib/db";
import { getBaseProduct } from "../../../../lib/products";

export async function PUT(req, { params }) {
  const { id } = await params;
  if (!getBaseProduct(id)) return NextResponse.json({ error: "Programa não encontrado." }, { status: 404 });
  const body = await req.json();
  const conn = await db();
  await conn.execute({
    sql: `INSERT INTO product_overrides (product_id, name, tag, pitch, manifesto, body, points, cta_title, cta_sub, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
          ON CONFLICT(product_id) DO UPDATE SET
            name=excluded.name, tag=excluded.tag, pitch=excluded.pitch, manifesto=excluded.manifesto,
            body=excluded.body, points=excluded.points, cta_title=excluded.cta_title, cta_sub=excluded.cta_sub,
            updated_at=excluded.updated_at`,
    args: [
      id,
      body.name || "",
      body.tag || "",
      body.pitch || "",
      body.manifesto || "",
      JSON.stringify(Array.isArray(body.body) ? body.body : []),
      JSON.stringify(Array.isArray(body.points) ? body.points : []),
      body.ctaTitle || "",
      body.ctaSub || "",
      new Date().toISOString(),
    ],
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(req, { params }) {
  const { id } = await params;
  const conn = await db();
  await conn.execute({ sql: "DELETE FROM product_overrides WHERE product_id = ?", args: [id] });
  return NextResponse.json({ ok: true });
}
