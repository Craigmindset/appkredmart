"use client";

import type React from "react";
import { useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useMerchantAuth } from "@/store/merchant-auth-store";

export default function MerchantRequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isHydrated } = useMerchantAuth();

  useEffect(() => {
    if (isHydrated && !user) {
      const next = pathname || "/dashboard/merchant";

      router.replace(`/admindesk?next=${encodeURIComponent(next)}`);
    }
  }, [isHydrated, user, router, pathname]);

  // Show loading while not hydrated
  if (!isHydrated) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Loading merchant session...
          </p>
        </div>
      </div>
    );
  }

  // Show loading while user is null (should redirect soon)
  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="mt-2 text-sm text-muted-foreground">
            Redirecting to sign in...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
