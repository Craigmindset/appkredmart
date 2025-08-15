"use client"

import type React from "react"

import LayoutShell from "@/components/layout-shell"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useSearchParams, useRouter } from "next/navigation"
import { useState } from "react"
import { Eye, EyeOff } from "lucide-react"

export default function ResetPasswordPage() {
  const params = useSearchParams()
  const router = useRouter()
  const email = (params.get("email") || "").toString()
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)

  const onReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) return
    setLoading(true)
    await new Promise((r) => setTimeout(r, 700))
    setLoading(false)
    router.push("/sign-in")
  }

  return (
    <LayoutShell>
      <section className="relative">
        <img
          src="/images/login-bg.jpg"
          alt="Background"
          className="pointer-events-none absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/50 via-black/20 to-transparent" />

        <div className="container mx-auto px-4">
          <div className="grid min-h-[calc(100svh-64px)] items-center gap-8 md:grid-cols-2">
            <div className="max-w-xl py-10 text-white">
              <div className="mb-10 inline-flex items-center gap-3">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 ring-1 ring-white/25">
                  <div className="h-5 w-5 rounded-full bg-white" />
                </div>
                <span className="text-2xl font-semibold tracking-tight">KredMart</span>
              </div>
              <h1 className="text-3xl font-semibold leading-tight tracking-tight md:text-5xl">
                {"Set a new password"}
              </h1>
              <p className="mt-4 max-w-md text-sm/6 text-white/85">
                {email ? `Resetting for ${email}` : "Enter a new password to secure your account."}
              </p>
            </div>

            <div className="flex w-full items-center justify-center py-10">
              <div className="w-full max-w-md rounded-2xl border bg-card p-6 shadow-lg backdrop-blur-md md:p-8">
                <div className="text-xs font-medium text-muted-foreground">{"RESET"}</div>
                <h2 className="mt-1 text-xl font-semibold tracking-tight md:text-2xl">{"Create new password"}</h2>

                <form onSubmit={onReset} className="mt-6 space-y-4">
                  <div>
                    <label className="mb-1 block text-sm font-medium">{"New Password"}</label>
                    <div className="relative">
                      <Input
                        type={showPwd ? "text" : "password"}
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPwd((v) => !v)}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                        aria-label={showPwd ? "Hide password" : "Show password"}
                      >
                        {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">{"Confirm Password"}</label>
                    <div className="relative">
                      <Input
                        type={showConfirm ? "text" : "password"}
                        required
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••••••"
                        className="pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                        aria-label={showConfirm ? "Hide password" : "Show password"}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" className="h-11 w-full" disabled={loading || password !== confirm}>
                    {loading ? "Saving..." : "Save password"}
                  </Button>

                  <div className="pt-2 text-center text-xs text-muted-foreground">
                    {"Changed your mind? "}
                    <a href="/sign-in" className="font-semibold underline">
                      {"Back to Login"}
                    </a>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    </LayoutShell>
  )
}
