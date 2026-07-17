import { NextResponse } from "next/server";
import { db } from "../../../lib/db";
import { PRODUCTS } from "../../../lib/products";
import { getTrilhas } from "../../../lib/trilhasStore";

// Only includes keys that actually have a saved value. Spreading a key set
// to `undefined` into the base product would still clobber it (object
// spread keeps keys with undefined values), which silently wiped
// stats/blocks for override rows saved before those columns existed.
function rowToOverride(r) {
  if (!r) return null;
  const ov = { name: r.name, tag: r.tag, pitch: r.pitch, manifesto: r.manifesto };
  if (r.body != null) ov.body = JSON.parse(r.body);
  if (r.points != null) ov.points = JSON.parse(r.points);
  if (r.cta_title != null || r.cta_sub != null) ov.cta = [r.cta_title, r.cta_sub];
  if (r.stats != null) ov.stats = JSON.parse(r.stats);
  if (r.blocks != null) ov.blocks = JSON.parse(r.blocks);
  return ov;
}

function withTrilhas(blocks, trilhas) {
  return (blocks || []).map((b) => (b.isTrilhas ? { ...b, items: trilhas } : b));
}

export async function GET() {
  const conn = await db();
  const [{ rows }, trilhas] = await Promise.all([conn.execute("SELECT * FROM product_overrides"), getTrilhas()]);
  const byId = {};
  rows.forEach((r) => (byId[r.product_id] = r));

  const products = PRODUCTS.map((base) => {
    const ov = rowToOverride(byId[base.id]);
    const merged = ov ? { ...base, ...ov } : base;
    return { ...merged, blocks: withTrilhas(merged.blocks, trilhas), hasOverride: !!ov };
  });

  return NextResponse.json({ products });
}
