// Current session endpoint to hydrate client store if needed.

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/server"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ user: null })

  const rows = await sql()`select id, first_name, last_name, email, phone from users where id = ${Number(
    session.sub,
  )} limit 1`
  const user = (rows as any[])[0] ?? null
  return NextResponse.json({ user })
}
