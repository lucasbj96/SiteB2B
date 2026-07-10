import { NextResponse } from "next/server";

// Always returns 200 without touching auth or the database, so Render's
// health check never mistakes the login redirect (or a Turso hiccup) for
// the process being down and restarts it unnecessarily.
export async function GET() {
  return NextResponse.json({ ok: true });
}
