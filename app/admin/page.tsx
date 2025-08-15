"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAdminRBACStore, type AdminRole } from "@/store/admin-rbac-store"
import { toast } from "@/hooks/use-toast"
import { Eye, EyeOff, Shield, User, X } from "lucide-react"

export default function AdminSignIn() {
  const router = useRouter()
  const { signIn } = useAdminRBACStore()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "super-admin" as AdminRole,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.email || !formData.password) {
      toast({
        title: "Error",
        description: "Please fill in all fields.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Demo authentication - in real app, validate against API
    signIn(formData.email, formData.role)

    toast({
      title: "Welcome!",
      description: `Signed in as ${formData.role.replace("-", " ")}`,
    })

    router.replace("/admin/dashboard/overview")
    setIsLoading(false)
  }

  const roleDescriptions = {
    "super-admin": "Full access to all features and settings",
    manager: "Manage merchants, users, inventory, and orders",
    marketer: "Manage products, inventory, and customer support",
    finance: "Access to revenue, transactions, and financial data",
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-2 top-2 h-8 w-8"
            onClick={() => router.push("/")}
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
          <div className="flex justify-center mb-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-600 text-white">
              <Shield className="h-6 w-6" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">Admin Portal</CardTitle>
          <p className="text-gray-600">Sign in to KredMart Admin Dashboard</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="admin@kredmart.com"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => setFormData((prev) => ({ ...prev, password: e.target.value }))}
                  className="pr-10"
                  required
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role (Demo)</Label>
              <Select
                value={formData.role}
                onValueChange={(value: AdminRole) => setFormData((prev) => ({ ...prev, role: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super-admin">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Super Admin
                    </div>
                  </SelectItem>
                  <SelectItem value="manager">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Manager
                    </div>
                  </SelectItem>
                  <SelectItem value="marketer">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Marketer
                    </div>
                  </SelectItem>
                  <SelectItem value="finance">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Finance
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">{roleDescriptions[formData.role]}</p>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Signing In...
                </>
              ) : (
                "Sign In"
              )}
            </Button>
          </form>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-900 mb-2">Demo Credentials:</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>
                <strong>Email:</strong> Any valid email
              </p>
              <p>
                <strong>Password:</strong> Any password (3+ chars)
              </p>
              <p>
                <strong>Roles:</strong> Select different roles to see permission differences
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
