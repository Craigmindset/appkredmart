"use client"

import { useMemo, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Download, ReceiptText } from "lucide-react"
import {
  useOrders,
  orderTotal,
  type Order,
  type PaymentMethod,
  type PaymentStatus,
  type Fulfillment,
} from "@/store/orders-store"
import { formatNaira } from "@/lib/currency"
import { useToast } from "@/hooks/use-toast"

type SortKey = "newest" | "oldest" | "total"

const payStatusVariant: Record<PaymentStatus, string> = {
  Paid: "bg-emerald-100 text-emerald-800",
  Pending: "bg-amber-100 text-amber-800",
  Refunded: "bg-sky-100 text-sky-800",
  Failed: "bg-rose-100 text-rose-800",
}

const fulfillVariant: Record<Fulfillment, string> = {
  Processing: "text-blue-700",
  "Ready for Delivery": "text-indigo-700",
  "Rider on Move": "text-fuchsia-700",
  Delivered: "text-emerald-700",
  Canceled: "text-rose-700",
}

function withinRange(iso: string, start?: string, end?: string) {
  const t = new Date(iso).getTime()
  if (start) {
    const s = new Date(start).setHours(0, 0, 0, 0)
    if (t < s) return false
  }
  if (end) {
    const e = new Date(end).setHours(23, 59, 59, 999)
    if (t > e) return false
  }
  return true
}

export default function MyOrdersPage() {
  const { toast } = useToast()
  const orders = useOrders((s) => s.orders)
  const seedDemo = useOrders((s) => s.seedDemo)

  // Controls
  const [q, setQ] = useState("")
  const [start, setStart] = useState<string>("")
  const [end, setEnd] = useState<string>("")
  const [method, setMethod] = useState<PaymentMethod | "all">("all")
  const [sort, setSort] = useState<SortKey>("newest")

  const filtered = useMemo(() => {
    let list = orders.slice()
    // search by id or product title
    const s = q.trim().toLowerCase()
    if (s) {
      list = list.filter(
        (o) => o.id.toLowerCase().includes(s) || o.items.some((it) => it.title.toLowerCase().includes(s)),
      )
    }
    if (method !== "all") {
      list = list.filter((o) => o.paymentMethod === method)
    }
    // date range
    list = list.filter((o) => withinRange(o.createdAt, start || undefined, end || undefined))
    // sort
    if (sort === "newest") list.sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt))
    if (sort === "oldest") list.sort((a, b) => +new Date(a.createdAt) - +new Date(b.createdAt))
    if (sort === "total") list.sort((a, b) => orderTotal(b) - orderTotal(a))
    return list
  }, [orders, q, method, start, end, sort])

  // Receipt modal state
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState<Order | null>(null)

  const openReceipt = (o: Order) => {
    setActive(o)
    setOpen(true)
  }

  const downloadReceipt = () => {
    if (!active) return
    const html = `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>KredMart Receipt - ${active.id}</title>
    <style>
      body { font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Ubuntu, Cantarell, Noto Sans, Helvetica, Arial; padding: 24px; color: #111827; }
      h1 { font-size: 18px; margin: 0 0 8px; }
      table { width: 100%; border-collapse: collapse; margin-top: 12px; }
      th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid #e5e7eb; font-size: 13px; }
      .muted { color: #6b7280; }
      .right { text-align: right; }
    </style>
  </head>
  <body>
    <h1>KredMart Receipt</h1>
    <div class="muted">Order: ${active.id}</div>
    <div class="muted">Date: ${new Date(active.createdAt).toLocaleString()}</div>
    <div class="muted">Payment: ${active.paymentMethod} (${active.paymentStatus})</div>
    <table>
      <thead>
        <tr><th>Item</th><th class="right">Qty</th><th class="right">Price</th><th class="right">Total</th></tr>
      </thead>
      <tbody>
        ${active.items
          .map(
            (it) =>
              `<tr><td>${it.title}</td><td class="right">${it.qty}</td><td class="right">${it.price}</td><td class="right">${
                it.qty * it.price
              }</td></tr>`,
          )
          .join("")}
      </tbody>
      <tfoot>
        <tr><td colspan="3" class="right"><strong>Grand Total</strong></td><td class="right"><strong>${orderTotal(
          active,
        )}</strong></td></tr>
      </tfoot>
    </table>
  </body>
</html>`.trim()

    const blob = new Blob([html], { type: "text/html;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `kredmart-receipt-${active.id}.html`
    document.body.appendChild(a)
    a.click()
    a.remove()
    URL.revokeObjectURL(url)
    toast({ title: "Receipt downloaded", description: `Saved kredmart-receipt-${active.id}.html` })
  }

  const resetFilters = () => {
    setQ("")
    setStart("")
    setEnd("")
    setMethod("all")
    setSort("newest")
  }

  return (
    <>
      <Card>
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between gap-3">
            <CardTitle>My Orders</CardTitle>
            {orders.length === 0 && (
              <Button variant="outline" onClick={seedDemo}>
                Load demo orders
              </Button>
            )}
          </div>
          {/* Top controls */}
          <div className="grid gap-3 md:grid-cols-5">
            {/* Search */}
            <div className="md:col-span-2">
              <Label htmlFor="search" className="text-xs text-muted-foreground">
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search by Order ID or Product"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            {/* Date range */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <Label htmlFor="start" className="text-xs text-muted-foreground">
                  Start date
                </Label>
                <Input id="start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
              </div>
              <div className="flex-1">
                <Label htmlFor="end" className="text-xs text-muted-foreground">
                  End date
                </Label>
                <Input id="end" type="date" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
            </div>
            {/* Payment method */}
            <div>
              <Label className="text-xs text-muted-foreground">Payment Method</Label>
              <Select value={method} onValueChange={(v: any) => setMethod(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All methods" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Wallet">Wallet</SelectItem>
                  <SelectItem value="Card">Card</SelectItem>
                  <SelectItem value="Pay on Delivery">Pay on Delivery</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* Sort */}
            <div>
              <Label className="text-xs text-muted-foreground">Sort</Label>
              <Select value={sort} onValueChange={(v: SortKey) => setSort(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Sort" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Newest</SelectItem>
                  <SelectItem value="oldest">Oldest</SelectItem>
                  <SelectItem value="total">Total</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="flex justify-end">
            <Button variant="ghost" size="sm" onClick={resetFilters} className="text-muted-foreground">
              Reset
            </Button>
          </div>
        </CardHeader>

        <CardContent className="overflow-x-auto">
          {filtered.length === 0 ? (
            <div className="text-sm text-muted-foreground">No orders match your filters.</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Payment Status</TableHead>
                  <TableHead>Fulfillment</TableHead>
                  <TableHead>Delivery</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((o) => {
                  const first = o.items[0]
                  const more = o.items.length - 1
                  return (
                    <TableRow key={o.id}>
                      <TableCell className="font-medium">{o.id}</TableCell>
                      <TableCell className="max-w-[340px]">
                        <div className="flex items-center gap-3">
                          <img
                            src={first.image || "/placeholder.svg?height=56&width=56"}
                            alt={first.title}
                            className="h-10 w-10 rounded object-cover"
                          />
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {first.title}
                              {more > 0 ? ` (+${more} more)` : ""}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {o.paymentMethod} • {new Date(o.createdAt).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={`px-2 py-0.5 text-[10px] ${payStatusVariant[o.paymentStatus]}`}>
                          {o.paymentStatus}
                        </Badge>
                      </TableCell>
                      <TableCell className={`${fulfillVariant[o.fulfillment]} text-sm`}>{o.fulfillment}</TableCell>
                      <TableCell className="text-sm">{o.delivery}</TableCell>
                      <TableCell className="text-right">{formatNaira(orderTotal(o))}</TableCell>
                      <TableCell>
                        <Button variant="outline" size="sm" onClick={() => openReceipt(o)}>
                          <ReceiptText className="mr-2 h-4 w-4" />
                          View Receipt
                        </Button>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Receipt Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Receipt {active ? "— " + active.id : ""}</DialogTitle>
          </DialogHeader>
          {active && (
            <div className="space-y-3">
              <div className="grid gap-2 text-sm text-muted-foreground md:grid-cols-3">
                <div>
                  <div className="text-xs">Date</div>
                  <div className="font-medium text-foreground">{new Date(active.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-xs">Payment</div>
                  <div className="font-medium text-foreground">
                    {active.paymentMethod} ({active.paymentStatus})
                  </div>
                </div>
                <div>
                  <div className="text-xs">Fulfillment</div>
                  <div className="font-medium text-foreground">{active.fulfillment}</div>
                </div>
              </div>

              <div className="rounded-md border">
                <div className="grid grid-cols-12 border-b bg-muted/50 px-3 py-2 text-xs font-medium">
                  <div className="col-span-7">Item</div>
                  <div className="col-span-2 text-right">Qty</div>
                  <div className="col-span-3 text-right">Total</div>
                </div>
                <div>
                  {active.items.map((it) => (
                    <div key={it.id} className="grid grid-cols-12 px-3 py-2 text-sm">
                      <div className="col-span-7">{it.title}</div>
                      <div className="col-span-2 text-right">{it.qty}</div>
                      <div className="col-span-3 text-right">{formatNaira(it.qty * it.price)}</div>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-12 border-t px-3 py-2 text-sm">
                  <div className="col-span-9 text-right font-medium">Grand Total</div>
                  <div className="col-span-3 text-right font-semibold">{formatNaira(orderTotal(active))}</div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2">
                <Button onClick={downloadReceipt}>
                  <Download className="mr-2 h-4 w-4" /> Download
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
