"use client"

import { useEffect, useState } from "react"
import { DataTable } from "@/components/ui/data-table"
import { Button } from "@/components/ui/button"
import { UserPlus } from "lucide-react"
import { columns } from "./columns"

interface User {
  id: string
  name: string
  email: string
  role: string
  joinedDate: string
  status: string
}

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem("userData")
    if (userData) {
      const user = JSON.parse(userData)
      setUsers([
        {
          id: "1",
          name: user.name,
          email: user.email,
          role: "user",
          joinedDate: new Date().toISOString().split('T')[0],
          status: "active"
        }
      ])
    }
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Users</h1>
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Add User
        </Button>
      </div>
      <DataTable columns={columns} data={users} />
    </div>
  )
}