// Login user (server-side). Real practice: verify password, set session cookie.

import { NextResponse } from "next/server"
import { z } from "zod"
import { sql } from "@/lib/db"
import { createSessionCookie } from "@/lib/auth/server"
import bcrypt from "bcryptjs"

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  const { email, password } = parsed.data

  const rows = await sql()`select id, first_name, last_name, password_hash from users where email = ${email} limit 1`
  const user = (rows as any[])[0]
  if (!user) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  const ok = await bcrypt.compare(password, user.password_hash)
  if (!ok) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })

  await createSessionCookie({ sub: String(user.id), email, name: `${user.first_name} ${user.last_name ?? ""}` })
  return NextResponse.json({ id: user.id })
}
