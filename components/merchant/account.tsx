"use client"

import type React from "react"

import { useState } from "react"
import { useMerchantAuth } from "@/store/merchant-auth-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export function Account() {
  const { toast } = useToast()
  const { user, login } = useMerchantAuth()
  const [firstName, setFirstName] = useState(user?.firstName ?? "")
  const [lastName, setLastName] = useState(user?.lastName ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [avatarUrl, setAvatarUrl] = useState(user?.avatarUrl ?? "")
  const initials = (firstName?.[0] ?? "") + (lastName?.[0] ?? (firstName ? "" : "U"))

  const onAvatarChange: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) return
    if (file.size > 2 * 1024 * 1024) {
      toast({ title: "File too large", description: "Max 2MB", variant: "destructive" })
      return
    }
    const reader = new FileReader()
    reader.onload = () => setAvatarUrl(String(reader.result || ""))
    reader.readAsDataURL(file)
  }

  const onSave = async () => {
    login({ firstName, lastName, email, avatarUrl })
    toast({ title: "Profile updated" })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex items-center gap-3">
          <Avatar className="h-14 w-14">
            {avatarUrl ? <AvatarImage src={avatarUrl || "/placeholder.svg"} alt="Avatar" /> : null}
            <AvatarFallback>{initials.toUpperCase()}</AvatarFallback>
          </Avatar>
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium">
            <Upload className="h-4 w-4" />
            <span>Change photo</span>
            <input type="file" accept="image/*" onChange={onAvatarChange} className="hidden" />
          </label>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">First name</label>
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last name</label>
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={onSave}>Save Changes</Button>
        </div>
      </CardContent>
    </Card>
  )
}
