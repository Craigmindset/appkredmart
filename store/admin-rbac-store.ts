"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type AdminRole = "super-admin" | "manager" | "marketer" | "finance";

export type Permission =
  | "view_overview"
  | "manage_merchants"
  | "manage_users"
  | "view_inventory"
  | "manage_inventory"
  | "view_products"
  | "manage_products"
  | "upload_products"
  | "view_revenue"
  | "manage_revenue"
  | "view_transactions"
  | "manage_transactions"
  | "view_orders"
  | "manage_orders"
  | "track_orders"
  | "view_support"
  | "manage_support"
  | "manage_site"
  | "manage_accounts"
  | "view_wallet"
  | "assign_roles";

export const ROLE_PERMISSIONS: Record<AdminRole, Permission[]> = {
  "super-admin": [
    "view_overview",
    "manage_merchants",
    "manage_users",
    "view_inventory",
    "manage_inventory",
    "view_products",
    "manage_products",
    "upload_products",
    "view_revenue",
    "manage_revenue",
    "view_transactions",
    "manage_transactions",
    "view_orders",
    "manage_orders",
    "track_orders",
    "view_support",
    "manage_support",
    "manage_site",
    "manage_accounts",
    "assign_roles",
  ],
  manager: [
    "view_overview",
    "manage_merchants",
    "manage_users",
    "view_inventory",
    "manage_inventory",
    "view_products",
    "manage_products",
    "upload_products",
    "view_revenue",
    "view_transactions",
    "view_orders",
    "manage_orders",
    "track_orders",
    "view_support",
    "manage_support",
  ],
  marketer: [
    "view_overview",
    "view_inventory",
    "view_products",
    "manage_products",
    "upload_products",
    "view_orders",
    "view_support",
    "manage_support",
  ],
  finance: [
    "view_overview",
    "view_revenue",
    "manage_revenue",
    "view_transactions",
    "manage_transactions",
    "view_orders",
    "track_orders",
  ],
};

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  permissions: Permission[];
};

type AdminRBACState = {
  currentUser: AdminUser | null;
  isAuthenticated: boolean;
  signIn: (email: string, role?: AdminRole) => void;
  signOut: () => void;
  hasPermission: (permission: Permission) => boolean;
  hasAnyPermission: (permissions: Permission[]) => boolean;
  canAccess: (requiredPermissions: Permission[]) => boolean;
};

export const useAdminRBACStore = create<AdminRBACState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      isAuthenticated: false,

      signIn: (email: string, role: AdminRole = "super-admin") => {
        const permissions = ROLE_PERMISSIONS[role];
        const user: AdminUser = {
          id: `admin_${Date.now()}`,
          name:
            role === "super-admin"
              ? "Super Admin"
              : role.charAt(0).toUpperCase() + role.slice(1),
          email,
          role,
          permissions,
        };

        set({
          currentUser: user,
          isAuthenticated: true,
        });
      },

      signOut: () => set({ currentUser: null, isAuthenticated: false }),

      hasPermission: (permission: Permission) => {
        const { currentUser } = get();
        return currentUser?.permissions.includes(permission) ?? false;
      },

      hasAnyPermission: (permissions: Permission[]) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        return permissions.some((permission) =>
          currentUser.permissions.includes(permission)
        );
      },

      canAccess: (requiredPermissions: Permission[]) => {
        const { currentUser } = get();
        if (!currentUser) return false;
        return requiredPermissions.every((permission) =>
          currentUser.permissions.includes(permission)
        );
      },
    }),
    {
      name: "admin-rbac",
      version: 1,
    }
  )
);
