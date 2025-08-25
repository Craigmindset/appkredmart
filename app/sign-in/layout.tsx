import { DashboardShell } from "@/components/dashboard-sidebar";
import UserGuest from "@/components/user-guest";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserGuest>{children}</UserGuest>;
}
