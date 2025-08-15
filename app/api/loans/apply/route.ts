// Create a loan application record before redirecting to provider.

import { NextResponse } from "next/server"
import { z } from "zod"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth/server"

const Body = z.object({
  providerName: z.string().min(1),
  payload: z.any().optional(),
})

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })

  const provider =
    await sql()`select id, apply_url from loan_providers where name = ${parsed.data.providerName} limit 1`
  const p = (provider as any[])[0]
  if (!p) return NextResponse.json({ error: "Unknown provider" }, { status: 404 })

  await sql()`insert into loan_applications (user_id, provider_id, status, payload)
             values (${Number(session.sub)}, ${p.id}, 'PENDING', ${parsed.data.payload ?? {}})`

  return NextResponse.json({ ok: true, applyUrl: p.apply_url })
}
