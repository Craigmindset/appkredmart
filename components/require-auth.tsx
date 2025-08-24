"use client";

import type React from "react";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useUser } from "@/lib/services/user/user";

export default function RequireAuth({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useUser();

  useEffect(() => {
    if (loading) return;
    if (!user) {
      const next = pathname || "/dashboard";
      router.replace(`/sign-in?next=${encodeURIComponent(next)}`);
    }
  }, [user, loading, router, pathname]);

  if (loading) return null;
  if (!user) return null;
  return <>{children}</>;
}
