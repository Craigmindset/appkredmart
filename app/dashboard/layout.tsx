import type React from "react";
import { DashboardShell } from "@/components/dashboard-sidebar";
import RequireAuth from "@/components/require-auth";
import { SidebarProvider } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <RequireAuth>
        <DashboardShell>{children}</DashboardShell>
      </RequireAuth>
    </SidebarProvider>
  );
}
