"use client";

import { useUser } from "@/lib/services/user/user";
import { Loader2 } from "lucide-react";
import { redirect, useSearchParams } from "next/navigation";
import React from "react";

const UserGuest = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useUser();
  const searchParams = useSearchParams();
  const next = searchParams.get("next");

  if (loading) {
    return <Loader2 className="animate-spin" />;
  }
  if (!user || user.role !== "user") {
    return children;
  }

  return redirect(next || "/welcome");
};

export default UserGuest;
