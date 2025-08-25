import LayoutShell from "@/components/layout-shell";
import UserGuest from "@/components/user-guest";
import { Suspense } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <LayoutShell showFooter={false}>
        <UserGuest>{children}</UserGuest>
      </LayoutShell>
    </Suspense>
  );
}
