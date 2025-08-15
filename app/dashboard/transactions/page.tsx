"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useOrders, orderTotal, type Order } from "@/store/orders-store"
import { useLoans, type Loan } from "@/store/loans-store"
import { useAuth } from "@/store/auth-store"
import { formatNaira } from "@/lib/currency"

type TxKind = "ORDER" | "LOAN" | "AIRTIME" | "DATA" | "WALLET_PAYMENT"

type Tx = {
  id: string
  kind: TxKind
  ref: string
  details: string
  amount: number
  method?: string
  status: string
  createdAt: string // ISO
}

function mapOrders(orders: Order[]): Tx[] {
  return orders.map((o) => ({
    id: "TX-" + o.id,
    kind: "ORDER",
    ref: o.id,
    details: (o.items[0]?.title ?? "Order") + (o.items.length > 1 ? ` (+${o.items.length - 1} more)` : ""),
    amount: orderTotal(o),
    method: o.paymentMethod,
    status: o.paymentStatus,
    createdAt: o.createdAt,
  }))
}

function mapLoans(loans: Loan[]): Tx[] {
  return loans.map((l, idx) => ({
    id: "TXL-" + l.id,
    kind: "LOAN",
    ref: l.id,
    details: `${l.provider} — Loan`,
    amount: l.loanAmount,
    method: "BNPL",
    status: l.status,
    createdAt: l.startDate || new Date(Date.now() - idx * 3600_000).toISOString(),
  }))
}

const PAGE_SIZE = 10

export default function TransactionsPage() {
  const user = useAuth((s) => s.user)
  const orders = useOrders((s) => s.orders)
  const seedOrders = useOrders((s) => s.seedDemo)
  const loans = useLoans((s) => s.loans)
  const seedLoans = useLoans((s) => s.seedDemo)

  const rows = useMemo(() => {
    const arr = [...mapOrders(orders), ...mapLoans(loans)]
    return arr.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
  }, [orders, loans])

  const [page, setPage] = useState(1)
  const pageCount = Math.max(1, Math.ceil(rows.length / PAGE_SIZE))
  const start = (page - 1) * PAGE_SIZE
  const pageRows = rows.slice(start, start + PAGE_SIZE)

  const downloadStatement = () => {
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "Guest User"
    const email = user?.email ?? "N/A"
    const printed = new Date().toLocaleString()

    const bodyRows = rows
      .map(
        (r) => `
      <tr>
        <td>${new Date(r.createdAt).toLocaleString()}</td>
        <td>${r.kind}</td>
        <td>${r.ref}</td>
        <td>${r.details}</td>
        <td style="text-align:right">${r.amount}</td>
        <td>${r.method ?? "-"}</td>
        <td>${r.status}</td>
      </tr>`,
      )
      .join("")

    const html = `
<!doctype html>
<html>
<head>
<meta charset="utf-8" />
<title>KredMart Statement</title>
<style>
  @media print { .noprint { display: none; } }
  body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial; color:#111827; padding:24px; position:relative; }
  h1 { margin:0 0 8px; font-size:20px; }
  .muted { color:#6b7280; }
  table { width:100%; border-collapse:collapse; margin-top:12px; }
  th, td { border-bottom:1px solid #e5e7eb; padding:8px 6px; font-size:12px; text-align:left; }
  th { background:#f9fafb; font-weight:600; }
  tfoot td { font-weight:600; }
  .stamp {
    position: fixed; inset: 0; display:flex; align-items:center; justify-content:center;
    pointer-events:none; opacity:0.08; font-size:120px; font-weight:900; letter-spacing:8px; color:#111827;
    transform: rotate(-20deg);
  }
</style>
</head>
<body>
  <div class="stamp">KREDMART</div>
  <h1>KredMart Account Statement</h1>
  <div class="muted">Name: ${fullName}</div>
  <div class="muted">Email: ${email}</div>
  <div class="muted">Printed: ${printed}</div>

  <table>
    <thead>
      <tr>
        <th>Date</th><th>Type</th><th>Reference</th><th>Details</th><th style="text-align:right">Amount</th><th>Method</th><th>Status</th>
      </tr>
    </thead>
    <tbody>
      ${bodyRows}
    </tbody>
  </table>
</body>
</html>`.trim()

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kredmart-statement-${Date.now()}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
  }

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>Transactions</CardTitle>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="bg-transparent" onClick={downloadStatement}>
            Download Statement
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {rows.length === 0 && (
          <div className="text-sm text-muted-foreground">
            No transactions yet.{" "}
            <button onClick={seedOrders} className="underline">
              Load demo orders
            </button>{" "}
            ·{" "}
            <button onClick={seedLoans} className="underline">
              Load demo loans
            </button>
          </div>
        )}

        {rows.length > 0 && (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Reference</TableHead>
                  <TableHead>Details</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Method</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pageRows.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="whitespace-nowrap text-sm">
                      {new Date(r.createdAt).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-sm">{r.kind}</TableCell>
                    <TableCell className="text-sm">{r.ref}</TableCell>
                    <TableCell className="max-w-[380px] truncate text-sm">{r.details}</TableCell>
                    <TableCell className="text-right font-medium">{formatNaira(r.amount)}</TableCell>
                    <TableCell className="text-sm">{r.method ?? "—"}</TableCell>
                    <TableCell className="text-sm">{r.status}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {/* Pagination */}
            <div className="mt-3 flex items-center justify-between text-sm">
              <div className="text-muted-foreground">
                Page {page} of {pageCount}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="bg-transparent"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page <= 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(pageCount, p + 1))}
                  disabled={page >= pageCount}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
