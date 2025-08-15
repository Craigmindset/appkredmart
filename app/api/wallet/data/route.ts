// Purchase Data (server). Real practice mirrors airtime but logs plan details.

import { NextResponse } from "next/server"
import { z } from "zod"
import { sql } from "@/lib/db"
import { getSession } from "@/lib/auth/server"

const Body = z.object({
  network: z.enum(["AIRTEL", "GLO", "MTN"]),
  phone: z.string().regex(/^\d{11}$/),
  plan: z.string().min(1),
  price: z.number().int().min(50),
})

export async function POST(req: Request) {
  const session = await getSession()
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  const body = await req.json().catch(() => ({}))
  const parsed = Body.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  const { network, phone, plan, price } = parsed.data

  const userId = Number(session.sub)
  const tx = await sql().transaction(async (trx) => {
    const walletRows = await trx`select id, balance from wallets where user_id = ${userId} for update`
    const wallet = (walletRows as any[])[0]
    if (!wallet || Number(wallet.balance) < price) {
      throw new Error("Insufficient funds")
    }
    await trx`update wallets set balance = balance - ${price} where id = ${wallet.id}`
    await trx`insert into transactions (user_id, type, amount, meta) values (${userId}, 'DATA', ${price}, ${JSON.stringify(
      { network, phone, plan },
    )})`
  })

  try {
    await tx
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Failed" }, { status: 400 })
  }
}
