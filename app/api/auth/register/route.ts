// Register user (server-side). Real practice: hash password & store in DB, then set session cookie.

import { NextResponse } from "next/server"
import { z } from "zod"
import { sql } from "@/lib/db"
import { createSessionCookie } from "@/lib/auth/server"
import bcrypt from "bcryptjs"

const Body = z.object({
  firstName: z.string().min(1),
  lastName: z.string().optional(),
  email: z.string().email(),
  phone: z.string().min(7),
  password: z.string().min(8),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  const { firstName, lastName, email, phone, password } = parsed.data

  // Ensure user not exists
  const existing = await sql()`select id from users where email = ${email} limit 1`
  if ((existing as any[]).length) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 })
  }

  const hash = await bcrypt.hash(password, 10)
  const rows = await sql()`insert into users (first_name, last_name, email, phone, password_hash)
                           values (${firstName}, ${lastName ?? ""}, ${email}, ${phone}, ${hash})
                           returning id, first_name, last_name`
  const user = (rows as any[])[0]

  // Create wallet row
  await sql()`insert into wallets (user_id, balance, currency) values (${user.id}, 0, 'NGN')`

  await createSessionCookie({ sub: String(user.id), email, name: `${user.first_name} ${user.last_name ?? ""}` })
  return NextResponse.json({ id: user.id })
}
