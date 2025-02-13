"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Wallet2,
  Settings,
  Users2,
  LogOut
} from "lucide-react"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard
  },
  {
    title: "Course Management",
    href: "/admin/courses",
    icon: BookOpen
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users
  },
  {
    title: "Wallet Management",
    href: "/admin/wallets",
    icon: Wallet2
  },
  {
    title: "Referral System",
    href: "/admin/referrals",
    icon: Users2
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings
  }
]

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <Link href="/admin" className="flex items-center space-x-2">
            <LayoutDashboard className="h-6 w-6" />
            <span className="font-bold">Admin Panel</span>
          </Link>
          <Link 
            href="/"
            className="flex items-center space-x-1 text-sm text-muted-foreground hover:text-foreground"
          >
            <LogOut className="h-4 w-4" />
            <span>Exit Admin</span>
          </Link>
        </div>
      </header>

      <div className="container flex gap-8 py-4">
        {/* Sidebar */}
        <aside className="w-64 shrink-0">
          <nav className="flex flex-col space-y-1">
            {sidebarItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium hover:bg-accent",
                  pathname === item.href ? "bg-accent" : "transparent"
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.title}</span>
              </Link>
            ))}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}