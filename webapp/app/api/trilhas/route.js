import { NextResponse } from "next/server";
import { getTrilhas, saveTrilhas, resetTrilhas } from "../../../lib/trilhasStore";
import { TRILHAS } from "../../../lib/products";

export async function GET() {
  const items = await getTrilhas();
  return NextResponse.json({ trilhas: items, hasOverride: JSON.stringify(items) !== JSON.stringify(TRILHAS) });
}

export async function PUT(req) {
  const body = await req.json();
  const items = Array.isArray(body.trilhas) ? body.trilhas : [];
  await saveTrilhas(items);
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  await resetTrilhas();
  return NextResponse.json({ ok: true });
}
