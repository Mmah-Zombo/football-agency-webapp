// components/sidebar.tsx
"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { useEffect } from "react"
import { cn } from "@/lib/utils"
import { LayoutDashboard, Users, Building2, FileText, Calendar, LogOut, User as UserIcon } from "lucide-react"
import { useAuthStore, roleLabels } from "@/lib/auth-store"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Players", href: "/players", icon: Users },
  { name: "Clubs", href: "/clubs", icon: Building2 },
  { name: "Contracts", href: "/contracts", icon: FileText },
  { name: "Matches", href: "/matches", icon: Calendar },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const { user, isAuthenticated, isLoading, logout, loadUser } = useAuthStore()

  // Critical: load user from server on every mount
  useEffect(() => {
    loadUser()
  }, [loadUser])

  const handleLogout = async () => {
    await logout()
    router.push("/")
  }

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 bg-sidebar text-sidebar-foreground">
      <div className="flex h-full flex-col">
        {/* Logo */}
        <div className="flex h-16 items-center gap-3 border-b border-sidebar-border px-6">
          <div className="h-8 w-8 rounded-md bg-sidebar-foreground flex items-center justify-center">
            <span className="text-sidebar font-bold text-sm">FA</span>
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">FootballAgents</h1>
            <p className="text-xs text-sidebar-foreground/60">Management System</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 px-3 py-4">
          {navigation.map((item) => {
            const isActive = pathname === item.href || pathname.startsWith(item.href + "/")
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground/80 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                )}
              >
                <item.icon className="h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Profile Section */}
        <div className="border-t border-sidebar-border p-4 space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-9 flex-1" />
                <Skeleton className="h-9 flex-1" />
              </div>
            </div>
          ) : isAuthenticated && user ? (
            <>
              <Link href="/profile" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                <div className="h-10 w-10 rounded-full bg-sidebar-accent overflow-hidden flex-shrink-0">
                  <img
                    src={user.avatar || "/placeholder.svg?height=40&width=40&query=avatar"}
                    alt={user.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{user.name}</p>
                  <p className="text-xs text-sidebar-foreground/60 truncate">
                    {roleLabels[user.role] || user.role}
                  </p>
                </div>
              </Link>

              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  asChild
                >
                  <Link href="/profile">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 justify-start text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent"
                  onClick={handleLogout}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign out
                </Button>
              </div>
            </>
          ) : (
            <div className="rounded-lg bg-sidebar-accent p-3">
              <p className="text-xs font-medium text-sidebar-accent-foreground">Agent Portal</p>
              <p className="text-xs text-sidebar-foreground/60">v1.0.0 • 2025</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  )
}