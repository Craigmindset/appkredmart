// Minimal JWT-based auth helpers with HTTP-only cookies.
// Real practice: replace or extend with Auth provider (NextAuth, Supabase Auth, etc.)

import { env } from "@/lib/env"
import { SignJWT, jwtVerify } from "jose"
import { cookies } from "next/headers"

const COOKIE_NAME = "kredmart_session"
const ALGO = "HS256"

type SessionPayload = {
  sub: string // user id
  email: string
  name?: string
  iat?: number
  exp?: number
}

function secretKey() {
  return new TextEncoder().encode(env().JWT_SECRET)
}

export async function createSessionCookie(payload: Omit<SessionPayload, "iat" | "exp">, ttlSeconds = 60 * 60 * 24 * 7) {
  const now = Math.floor(Date.now() / 1000)
  const exp = now + ttlSeconds
  const token = await new SignJWT({ ...payload, iat: now, exp }).setProtectedHeader({ alg: ALGO }).sign(secretKey())
  ;(await cookies()).set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: true,
    path: "/",
    maxAge: ttlSeconds,
  })
}

export async function getSession(): Promise<SessionPayload | null> {
  const c = (await cookies()).get(COOKIE_NAME)?.value
  if (!c) return null
  try {
    const { payload } = await jwtVerify(c, secretKey())
    return payload as SessionPayload
  } catch {
    return null
  }
}

export async function clearSession() {
  ;(await cookies()).delete(COOKIE_NAME)
}
