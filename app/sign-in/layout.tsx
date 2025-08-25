import UserGuest from "@/components/user-guest";
import { Suspense } from "react";

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense>
      <UserGuest>{children}</UserGuest>
    </Suspense>
  );
}
