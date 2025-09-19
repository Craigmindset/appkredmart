"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useTrackOrder } from "@/lib/services/order/use-track-order";
import { Bike, Box, CheckCircle2, Loader2, Package, Truck } from "lucide-react";
import { Order } from "@/store/orders-store";
import { upperCaseText } from "@/lib/utils";

type Step = {
  key: "confirmed" | "packed" | "picked" | "rider" | "delivered";
  label: string;
  icon: React.ComponentType<{ className?: string }>;
};

const STEPS: Step[] = [
  { key: "confirmed", label: "Order confirmed", icon: CheckCircle2 },
  { key: "packed", label: "Packed", icon: Box },
  { key: "picked", label: "Item picked", icon: Package },
  { key: "rider", label: "Rider on move", icon: Bike },
  { key: "delivered", label: "Delivered", icon: Truck },
];

function fulfillmentToStep(fulfillment: Order["fulfillment"]) {
  if (!fulfillment) return 1;
  switch (fulfillment) {
    case "Processing":
      return 2; // confirmed + packed
    case "Ready for Delivery":
      return 3; // item picked
    case "Rider on Move":
      return 4;
    case "Delivered":
      return 5;
    case "Canceled":
      return 1;
    default:
      return 1;
  }
}

export function TrackOrder() {
  const [id, setId] = useState("");
  const [orderId, setOrderId] = useState<string | null>(null);
  const { data, isLoading } = useTrackOrder(orderId);

  const currentStep = fulfillmentToStep(
    (upperCaseText(data?.fulfillment || "") as Order["fulfillment"]) ||
      undefined
  );
  return (
    <Card>
      <CardHeader>
        <CardTitle>Track Order</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-col gap-2 sm:flex-row">
          <Input
            placeholder="Enter Order ID"
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
          <Button onClick={() => setOrderId(id)}>
            {isLoading ? <Loader2 className="animate-spin" /> : "Find"}
          </Button>
        </div>
        {!orderId && (
          <>
            <div className="text-sm text-muted-foreground">
              No order selected. Enter an Order ID to view status.
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="font-medium">Example</div>
              <Badge variant="secondary">KM-ORD-000000</Badge>
            </div>
          </>
        )}
        {!data ? (
          <div className="text-sm text-muted-foreground">
            No orders available.
          </div>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-3 text-sm">
              <div className="font-medium">Tracking</div>
              <Badge variant="secondary">{data.id}</Badge>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground">
                {new Date(data.createdAt).toLocaleString()}
              </span>
            </div>

            <div className="relative">
              <div className="grid gap-6 md:grid-cols-5">
                {STEPS.map((s, idx) => {
                  const done = idx + 1 <= currentStep;
                  const Icon = s.icon;
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
                      <div
                        className={`text-sm ${
                          done ? "font-medium" : "text-muted-foreground"
                        }`}
                      >
                        {s.label}
                      </div>
                    </div>
                  );
                })}

                <div className="pointer-events-none mt-3 hidden h-0.5 w-full rounded bg-muted md:block" />
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
