import type React from "react"
import { DashboardShell } from "@/components/dashboard-sidebar"
import RequireAuth from "@/components/require-auth"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <DashboardShell>{children}</DashboardShell>
    </RequireAuth>
  )
}
