"use client"

import type React from "react"

import { useState } from "react"
import { Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"

export default function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setEmail("")
    toast({ title: "Subscribed", description: "You have been added to our newsletter." })
  }

  return (
    <section className="bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col items-center text-center gap-3">
          <h4 className="text-xl font-semibold">Join our newsletter</h4>
          <p className="text-sm text-white/70">Stay updated on deals and new arrivals.</p>
          <form onSubmit={onSubmit} className="mt-4 flex w-full max-w-md gap-2">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="bg-white text-black"
            />
            <Button type="submit" className="min-w-[110px]" disabled={loading}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> {"Submitting"}
                </span>
              ) : (
                "Submit"
              )}
            </Button>
          </form>
        </div>
      </div>
    </section>
  )
}
