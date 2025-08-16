import type React from "react"
import { MerchantDashboardShell } from "@/components/merchant/merchant-dashboard-shell"

export default function MerchantLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <MerchantDashboardShell>{children}</MerchantDashboardShell>
}
