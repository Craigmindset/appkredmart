// Wallet balance fetcher for client hydration.

import { NextResponse } from "next/server"
import { getSession } from "@/lib/auth/server"
import { sql } from "@/lib/db"

export async function GET() {
  const session = await getSession()
  if (!session) return NextResponse.json({ balance: null, currency: null }, { status: 401 })
  const rows = await sql()`select balance, currency from wallets where user_id = ${Number(session.sub)} limit 1`
  const wallet = (rows as any[])[0]
  return NextResponse.json({ balance: wallet?.balance ?? 0, currency: wallet?.currency ?? "NGN" })
}
