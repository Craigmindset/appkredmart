"use client"

// store/auth-store.ts
import { defineStore } from "pinia"

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      avatarUrl: "", // Optional avatarUrl
    },
  }),
  actions: {
    // Actions here
  },
})

// components/dashboard-sidebar.tsx
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar-menu"
import { Link } from "next/link"
import { usePathname } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"

const DashboardSidebar = () => {
  const { user } = useAuthStore()
  const pathname = usePathname()
  const initials = `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`

  const items = [
    { href: "/dashboard", icon: <span>Dashboard Icon</span>, label: "Dashboard" },
    { href: "/settings", icon: <span>Settings Icon</span>, label: "Settings" },
    // More items here
  ]

  return (
    <div className="sidebar">
      <SidebarMenu className="gap-2">
        {items.map((i) => (
          <SidebarMenuItem key={i.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === i.href}
              size="lg"
              className="data-[active=true]:bg-[#0a2e6e] data-[active=true]:text-white hover:data-[active=true]:bg-[#0a2e6e]"
            >
              <Link href={i.href}>
                {i.icon}
                <span>{i.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <div className="footer">
        <Avatar className="h-6 w-6">
          {user?.avatarUrl ? <AvatarImage src={user.avatarUrl || "/placeholder.svg"} alt="Profile" /> : null}
          <AvatarFallback className="text-[10px]">{initials.toUpperCase()}</AvatarFallback>
        </Avatar>
      </div>
    </div>
  )
}

export default DashboardSidebar
