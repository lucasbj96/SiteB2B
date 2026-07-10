// Uses Web Crypto (globalThis.crypto) so this works in both the Node.js
// runtime (API routes) and the Edge runtime (middleware).

const COOKIE_NAME = "catsc_session";
const MAX_AGE_SECONDS = 60 * 60 * 24 * 30; // 30 days

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s) throw new Error("SESSION_SECRET não está configurada.");
  return s;
}

function b64url(bytes) {
  let str = "";
  for (const b of new Uint8Array(bytes)) str += String.fromCharCode(b);
  return btoa(str).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  const str = atob(s);
  const bytes = new Uint8Array(str.length);
  for (let i = 0; i < str.length; i++) bytes[i] = str.charCodeAt(i);
  return bytes;
}

async function hmacKey() {
  const enc = new TextEncoder().encode(secret());
  return crypto.subtle.importKey("raw", enc, { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

async function sign(payload) {
  const key = await hmacKey();
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return b64url(sig);
}

export async function createSessionToken(username) {
  const exp = Date.now() + MAX_AGE_SECONDS * 1000;
  const payload = b64url(new TextEncoder().encode(JSON.stringify({ u: username, exp })));
  const sig = await sign(payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token) {
  if (!token || typeof token !== "string" || !token.includes(".")) return null;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  try {
    const key = await hmacKey();
    const valid = await crypto.subtle.verify(
      "HMAC",
      key,
      b64urlToBytes(sig),
      new TextEncoder().encode(payload)
    );
    if (!valid) return null;
    const data = JSON.parse(new TextDecoder().decode(b64urlToBytes(payload)));
    if (!data.exp || Date.now() > data.exp) return null;
    return data;
  } catch {
    return null;
  }
}

function timingSafeStrEqual(a, b) {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  const len = Math.max(ab.length, bb.length, 1);
  let diff = ab.length === bb.length ? 0 : 1;
  for (let i = 0; i < len; i++) {
    diff |= (ab[i] || 0) ^ (bb[i] || 0);
  }
  return diff === 0;
}

export function checkCredentials(username, password) {
  const validUser = process.env.ADMIN_USERNAME || "";
  const validPass = process.env.ADMIN_PASSWORD || "";
  if (!validUser || !validPass) return false;
  const okUser = timingSafeStrEqual(username || "", validUser);
  const okPass = timingSafeStrEqual(password || "", validPass);
  return okUser && okPass;
}

export const SESSION_COOKIE = COOKIE_NAME;
export const SESSION_MAX_AGE = MAX_AGE_SECONDS;
