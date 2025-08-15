"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

export function TrackOrder() {
  const [id, setId] = useState("")
  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input placeholder="Enter Order ID" value={id} onChange={(e) => setId(e.target.value)} />
          <Button>Find</Button>
        </div>
        <div className="text-sm text-muted-foreground">No order selected. Enter an Order ID to view status.</div>
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <div className="font-medium">Example</div>
          <Badge variant="secondary">KM-ORD-000000</Badge>
        </div>
      </CardContent>
    </Card>
  )
}
