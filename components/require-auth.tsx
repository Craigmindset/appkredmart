"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { useAuth } from "@/store/auth-store"

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const user = useAuth((s) => s.user)
  const [hydrated, setHydrated] = useState(false)

  // Wait for zustand-persist hydration before guarding
  useEffect(() => {
    // Set initial state if already hydrated
    setHydrated((useAuth as any).persist?.hasHydrated?.() ?? false)
    // Subscribe to hydration finish
    const unsub = (useAuth as any).persist?.onFinishHydration?.(() => {
      setHydrated(true)
    })
    return () => {
      if (typeof unsub === "function") unsub()
    }
  }, [])

  useEffect(() => {
    if (!hydrated) return
    if (!user) {
      const next = pathname || "/dashboard"
      router.replace(`/sign-in?next=${encodeURIComponent(next)}`)
    }
  }, [hydrated, user, router, pathname])

  if (!hydrated) return null
  if (!user) return null
  return <>{children}</>
}
