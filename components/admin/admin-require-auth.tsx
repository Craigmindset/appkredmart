"use client"

import type React from "react"

import { useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAdminAuthStore } from "@/store/admin-auth-store"

export function AdminRequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const isAuthenticated = useAdminAuthStore((s) => s.isAuthenticated)

  useEffect(() => {
    if (!isAuthenticated) {
      // If not signed in, send to admin sign-in
      router.replace("/admin")
    }
  }, [isAuthenticated, router])

  // Prevent flashing protected content while checking
  if (!isAuthenticated && pathname !== "/admin") {
    return null
  }

  return <>{children}</>
}
