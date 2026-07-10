import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { PRODUCTS } from "../../../lib/products";

function rowToOverride(r) {
  if (!r) return null;
  return {
    name: r.name,
    tag: r.tag,
    pitch: r.pitch,
    manifesto: r.manifesto,
    body: r.body ? JSON.parse(r.body) : undefined,
    points: r.points ? JSON.parse(r.points) : undefined,
    cta: [r.cta_title, r.cta_sub],
  };
}

export async function GET() {
  const conn = await db();
  const { rows } = await conn.execute("SELECT * FROM product_overrides");
  const byId = {};
  rows.forEach((r) => (byId[r.product_id] = r));

  const products = PRODUCTS.map((base) => {
    const ov = rowToOverride(byId[base.id]);
    const merged = ov ? { ...base, ...ov } : base;
    return { ...merged, hasOverride: !!ov };
  });

  return NextResponse.json({ products });
}
