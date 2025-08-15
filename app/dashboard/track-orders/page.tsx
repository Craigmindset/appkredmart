"use client"

import type React from "react"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Bike, CheckCircle2, Package, Truck, Box } from "lucide-react"
import { useOrders, type Order } from "@/store/orders-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

type Step = {
  key: "confirmed" | "packed" | "picked" | "rider" | "delivered"
  label: string
  icon: React.ComponentType<{ className?: string }>
}

const STEPS: Step[] = [
  { key: "confirmed", label: "Order confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Box },
  { key: "picked", label: "Item picked", icon: Package },
  { key: "rider", label: "Rider on move", icon: Bike },
  { key: "delivered", label: "Delivered", icon: Truck },
]

function fulfillmentToStep(o?: Order) {
  if (!o) return 1
  switch (o.fulfillment) {
    case "Processing":
      return 2 // confirmed + packed
    case "Ready for Delivery":
      return 3 // item picked
    case "Rider on Move":
      return 4
    case "Delivered":
      return 5
    case "Canceled":
      return 1
    default:
      return 1
  }
}

export default function TrackOrdersPage() {
  const orders = useOrders((s) => s.orders)
  const [id, setId] = useState("")
  const found = useMemo(() => orders.find((o) => o.id.toLowerCase() === id.trim().toLowerCase()), [orders, id])
  const current = found ?? orders[0] ?? null
  const currentStep = fulfillmentToStep(current || undefined)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Orders</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Enter Order ID e.g., KM-ORD-240091" value={id} onChange={(e) => setId(e.target.value)} />
          <Button onClick={() => void 0}>Find</Button>
        </div>

        {!current ? (
          <div className="text-sm text-muted-foreground">
            No orders available. Go to My Orders to place or seed demo.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="font-medium">Tracking</div>
              <Badge variant="secondary">{current.id}</Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">{new Date(current.createdAt).toLocaleString()}</span>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="grid gap-6 md:grid-cols-5">
                {STEPS.map((s, idx) => {
                  const done = idx + 1 <= currentStep
                  const Icon = s.icon
                  return (
                    <div key={s.key} className="flex items-center gap-3">
                      <div
                        className={`inline-flex h-9 w-9 items-center justify-center rounded-full ring-1 ${
                          done
                            ? "bg-emerald-600 text-white ring-emerald-700/50"
                            : "bg-muted text-muted-foreground ring-border"
                        }`}
                      >
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className={`text-sm ${done ? "font-medium" : "text-muted-foreground"}`}>{s.label}</div>
                    </div>
                  )
                })}
              </div>
              {/* Progress line (desktop) */}
              <div className="pointer-events-none mt-3 hidden h-0.5 w-full rounded bg-muted md:block" />
            </div>

            {/* Track Rider */}
            <div className="flex items-center justify-between rounded-md border p-3">
              <div className="text-sm text-muted-foreground">
                {currentStep >= 4
                  ? "Your rider is on the move."
                  : "Rider tracking available once the order is out for delivery."}
              </div>
              <Sheet>
                <SheetTrigger asChild>
                  <Button disabled={currentStep < 4}>Track Rider</Button>
                </SheetTrigger>
                <SheetContent side="bottom" className="h-[70vh]">
                  <SheetHeader>
                    <SheetTitle>Rider Tracking</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    <div className="md:col-span-2 rounded-lg border">
                      <img
                        src={"/placeholder.svg?height=420&width=900&query=map+with+rider+route"}
                        alt="Map preview"
                        className="h-[320px] w-full rounded-lg object-cover md:h-[420px]"
                      />
                    </div>
                    <div className="space-y-3">
                      <div>
                        <div className="text-sm font-medium">Order</div>
                        <div className="text-xs text-muted-foreground">{current?.id}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">Status</div>
                        <div className="text-xs text-muted-foreground">{current?.fulfillment}</div>
                      </div>
                      <div>
                        <div className="text-sm font-medium">ETA</div>
                        <div className="text-xs text-muted-foreground">20–35 mins</div>
                      </div>
                      <div className="flex gap-2">
                        <Button className="flex-1 bg-transparent" variant="outline">
                          Share Link
                        </Button>
                        <Button className="flex-1 bg-transparent" variant="outline">
                          Call Rider
                        </Button>
                      </div>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
