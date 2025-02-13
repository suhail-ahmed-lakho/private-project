"use client"

import { Card } from "@/components/ui/card"
import {
  Users,
  BookOpen,
  DollarSign,
  TrendingUp,
  Users2,
  AlertCircle
} from "lucide-react"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts"

// Mock data - replace with real data from your backend
const data = [
  { name: "Jan", users: 400, revenue: 2400 },
  { name: "Feb", users: 300, revenue: 1398 },
  { name: "Mar", users: 200, revenue: 9800 },
  { name: "Apr", users: 278, revenue: 3908 },
  { name: "May", users: 189, revenue: 4800 },
  { name: "Jun", users: 239, revenue: 3800 }
]

const stats = [
  {
    title: "Total Users",
    value: "1,234",
    change: "+12%",
    icon: Users
  },
  {
    title: "Active Courses",
    value: "24",
    change: "+3",
    icon: BookOpen
  },
  {
    title: "Revenue",
    value: "$12,345",
    change: "+18%",
    icon: DollarSign
  },
  {
    title: "Referrals",
    value: "456",
    change: "+24%",
    icon: Users2
  }
]

const alerts = [
  {
    title: "New User Registrations",
    description: "5 new users registered in the last hour",
    timestamp: "1 hour ago"
  },
  {
    title: "Payment Processing",
    description: "3 pending payments require review",
    timestamp: "2 hours ago"
  },
  {
    title: "Course Completion",
    description: "10 users completed their courses today",
    timestamp: "3 hours ago"
  }
]

export default function AdminDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Dashboard Overview</h1>
        <p className="text-muted-foreground">
          Welcome to the admin dashboard. Here's what's happening today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
              <stat.icon className="h-8 w-8 text-primary" />
            </div>
            <div className="mt-4 flex items-center text-sm">
              <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
              <span className="text-green-500">{stat.change}</span>
              <span className="ml-2 text-muted-foreground">vs last month</span>
            </div>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">User Growth</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="users"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-6">
          <h3 className="mb-4 text-lg font-semibold">Revenue</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center gap-2">
          <AlertCircle className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        <div className="mt-4 space-y-4">
          {alerts.map((alert, index) => (
            <div
              key={index}
              className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{alert.title}</p>
                <p className="text-sm text-muted-foreground">
                  {alert.description}
                </p>
              </div>
              <span className="text-sm text-muted-foreground">
                {alert.timestamp}
              </span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}