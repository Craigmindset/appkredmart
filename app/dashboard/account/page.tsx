"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/store/auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Eye, EyeOff, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function AccountPage() {
  const { toast } = useToast()
  const { user, setUser } = useAuth()

  const [firstName, setFirstName] = useState(user?.firstName ?? "")
  const [lastName, setLastName] = useState(user?.lastName ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [phone, setPhone] = useState(user?.phone ?? "")
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(user?.avatarUrl)

  // Password state
  const [newPwd, setNewPwd] = useState("")
  const [confirmPwd, setConfirmPwd] = useState("")
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [updatingPwd, setUpdatingPwd] = useState(false)

  // Support dialog
  const [supportOpen, setSupportOpen] = useState(false)
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("")
  const [submitting, setSubmitting] = useState(false)

  const initials = (firstName?.[0] ?? "") + (lastName?.[0] ?? (firstName ? "" : "U"))

  const onSaveProfile = async () => {
    setUser({ firstName, lastName, email, phone, avatarUrl })
    toast({ title: "Profile updated", description: "Your account details were saved." })
  }

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please choose an image.", variant: "destructive" })
      return
    }
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max size is 2MB.", variant: "destructive" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      const url = String(reader.result || "")
      setAvatarUrl(url)
      setUser({ firstName, lastName, email, phone, avatarUrl: url })
      toast({ title: "Profile image updated" })
    }
    reader.readAsDataURL(file)
  }

  const onUpdatePassword = async () => {
    if (newPwd.length < 8) {
      toast({ title: "Password too short", description: "Use at least 8 characters.", variant: "destructive" })
      return
    }
    if (newPwd !== confirmPwd) {
      toast({ title: "Passwords do not match", description: "Please re-enter.", variant: "destructive" })
      return
    }
    setUpdatingPwd(true)
    await new Promise((r) => setTimeout(r, 800))
    setUpdatingPwd(false)
    setNewPwd("")
    setConfirmPwd("")
    toast({ title: "Password updated", description: "Your new password is now active." })
  }

  const submitSupport = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 900))
    setSubmitting(false)
    setSupportOpen(false)
    setSubject("")
    setMessage("")
    toast({ title: "Message sent", description: "Support will get back to you shortly." })
  }

  return (
    <div className="space-y-6">
      {/* Profile */}
      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-start gap-4">
            <div className="relative">
              <Avatar className="h-16 w-16">
                {avatarUrl ? <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Profile" /> : null}
                <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium">
                <Upload className="h-4 w-4" />
                <span>Change photo</span>
                <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
              </label>
              <div className="mt-2 text-xs text-muted-foreground">JPG/PNG, up to 2MB.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium">First name</label>
              <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Last name</label>
              <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Phone</label>
              <Input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234 800 000 0000" />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={onSaveProfile} className="w-full md:w-auto">
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password */}
      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm font-medium">New Password</label>
              <div className="relative">
                <Input
                  type={showNew ? "text" : "password"}
                  value={newPwd}
                  onChange={(e) => setNewPwd(e.target.value)}
                  placeholder="••••••••"
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute inset-y-0 right-0 flex w-10 items-center justify-center text-muted-foreground"
                  aria-label={showNew ? "Hide password" : "Show password"}
                >
                  {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
            <div className="md:col-span-1">
              <label className="mb-1 block text-sm font-medium">Confirm Password</label>
              <div className="relative">
                <Input
                  type={showConfirm ? "text" : "password"}
                  value={confirmPwd}
                  onChange={(e) => setConfirmPwd(e.target.value)}
                  placeholder="Re-enter password"
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
          </div>

          <div className="flex justify-end">
            <Button onClick={onUpdatePassword} disabled={updatingPwd} className="w-full md:w-auto">
              {updatingPwd ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Support */}
      <Card>
        <CardHeader>
          <CardTitle>Need help?</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-between gap-3">
          <div className="text-sm text-muted-foreground">
            Contact our support team for billing, orders, loans, or general queries.
          </div>
          <Button onClick={() => setSupportOpen(true)}>Contact Support</Button>
        </CardContent>
      </Card>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Contact Support</DialogTitle>
          </DialogHeader>
          <form onSubmit={submitSupport} className="space-y-3">
            <div>
              <label className="mb-1 block text-sm font-medium">Subject</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} required />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Message</label>
              <Textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us how we can help…"
                required
              />
            </div>
            <div className="flex justify-end">
              <Button type="submit" disabled={submitting} className="w-full md:w-auto">
                {submitting ? "Sending..." : "Send Message"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
