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
import { AdminSidebar } from "@/components/admin/admin-sidebar"

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
    <div className="flex h-screen">
      <AdminSidebar />
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  )
}