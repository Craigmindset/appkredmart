import type React from "react"
import { DashboardShell } from "@/components/dashboard-sidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>
}
