import { NextResponse } from "next/server";
import { checkCredentials, createSessionToken, SESSION_COOKIE, SESSION_MAX_AGE } from "../../../../lib/auth";

export async function POST(req) {
  let body;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }
  const { username, password } = body || {};
  if (!checkCredentials(username, password)) {
    return NextResponse.json({ error: "Usuário ou senha incorretos." }, { status: 401 });
  }
  const token = await createSessionToken(username);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
