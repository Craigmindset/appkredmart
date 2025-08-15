// Newsletter endpoint (server). Real practice: store to DB or call ESP (e.g., Resend, Mailchimp).

import { NextResponse } from "next/server"
import { z } from "zod"
import { sql } from "@/lib/db"

const Body = z.object({
  email: z.string().email(),
})

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  const { email } = parsed.data

  await sql()`insert into newsletter_subs (email) values (${email}) on conflict (email) do nothing`

  return NextResponse.json({ ok: true })
}
