"use client"

import type React from "react"
import { useAdminRBACStore, type Permission } from "@/store/admin-rbac-store"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, AlertTriangle } from "lucide-react"

interface RBACGuardProps {
  children: React.ReactNode
  permissions: Permission[]
  requireAll?: boolean
  fallback?: React.ReactNode
}

export function RBACGuard({ children, permissions, requireAll = true, fallback }: RBACGuardProps) {
  const { currentUser, hasPermission, hasAnyPermission, canAccess } = useAdminRBACStore()

  if (!currentUser) {
    return (
      fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <Shield className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please sign in to access this resource.</p>
          </CardContent>
        </Card>
      )
    )
  }

  const hasAccess = requireAll ? canAccess(permissions) : hasAnyPermission(permissions)

  if (!hasAccess) {
    return (
      fallback || (
        <Card className="max-w-md mx-auto mt-8">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <AlertTriangle className="h-12 w-12 text-red-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Access Denied</h3>
            <p className="text-gray-600 mb-4">You don't have permission to access this resource.</p>
            <div className="bg-gray-50 rounded-lg p-3 w-full">
              <p className="text-sm text-gray-700">
                <strong>Your Role:</strong> {currentUser.role}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <strong>Required:</strong> {permissions.join(", ")}
              </p>
            </div>
          </CardContent>
        </Card>
      )
    )
  }

  return <>{children}</>
}
