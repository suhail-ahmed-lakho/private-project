"use client"

import { useState } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BookOpen,
  Trophy,
  Users,
  Wallet2,
  TrendingUp,
  Calendar,
  Clock,
  Award,
  ChevronRight,
  Bell
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

// Mock data
const userData = {
  name: "John Doe",
  plan: "Premium",
  progress: 65,
  coursesCompleted: 8,
  currentModule: "Advanced Technical Analysis",
  wallet: {
    balance: 24,
    stipendNext: "2024-05-01",
    referrals: 3,
    earnings: 45
  }
}

const courses = [
  {
    title: "Crypto Basics",
    progress: 100,
    status: "Completed",
    lastAccessed: "2 days ago"
  },
  {
    title: "Technical Analysis Fundamentals",
    progress: 80,
    status: "In Progress",
    lastAccessed: "5 hours ago"
  },
  {
    title: "Advanced Trading Strategies",
    progress: 30,
    status: "In Progress",
    lastAccessed: "1 day ago"
  },
  {
    title: "Risk Management",
    progress: 0,
    status: "Not Started",
    lastAccessed: null
  }
]

const chartData = [
  { name: "Week 1", progress: 20 },
  { name: "Week 2", progress: 35 },
  { name: "Week 3", progress: 45 },
  { name: "Week 4", progress: 65 },
  { name: "Week 5", progress: 75 },
  { name: "Week 6", progress: 85 }
]

const notifications = [
  {
    title: "New Course Available",
    description: "Advanced DeFi Trading Strategies is now available",
    time: "2 hours ago"
  },
  {
    title: "Achievement Unlocked",
    description: "Completed Basic Technical Analysis module",
    time: "1 day ago"
  },
  {
    title: "Upcoming Live Session",
    description: "Market Analysis with John Smith - Tomorrow at 2 PM",
    time: "1 day ago"
  }
]

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1 bg-muted/30">
        <div className="container py-8">
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold">Welcome back, {userData.name}</h1>
            <p className="text-muted-foreground">
              Continue your learning journey with CryptoEdu
            </p>
          </div>

          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-8">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="courses">My Courses</TabsTrigger>
              <TabsTrigger value="wallet">Wallet</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card className="hover-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Trophy className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Overall Progress</p>
                      <p className="text-2xl font-bold">{userData.progress}%</p>
                    </div>
                  </div>
                </Card>

                <Card className="hover-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <BookOpen className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Courses Completed</p>
                      <p className="text-2xl font-bold">{userData.coursesCompleted}</p>
                    </div>
                  </div>
                </Card>

                <Card className="hover-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Users className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Referrals</p>
                      <p className="text-2xl font-bold">{userData.wallet.referrals}</p>
                    </div>
                  </div>
                </Card>

                <Card className="hover-card p-6">
                  <div className="flex items-center gap-4">
                    <div className="rounded-xl bg-primary/10 p-3 text-primary">
                      <Wallet2 className="h-8 w-8" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold">${userData.wallet.earnings}</p>
                    </div>
                  </div>
                </Card>
              </div>

              <div className="mt-8 grid gap-6 lg:grid-cols-3">
                <Card className="col-span-2 p-6">
                  <h3 className="mb-6 text-xl font-semibold">Learning Progress</h3>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="progress"
                          stroke="hsl(var(--primary))"
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="mb-6 flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Recent Notifications</h3>
                    <Bell className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <div className="space-y-4">
                    {notifications.map((notification, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <p className="font-medium">{notification.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {notification.description}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="courses">
              <div className="grid gap-6 md:grid-cols-2">
                {courses.map((course) => (
                  <Card key={course.title} className="hover-card overflow-hidden p-6">
                    <div className="mb-4">
                      <div className="mb-4 flex items-start justify-between">
                        <div>
                          <h3 className="mb-1 font-semibold">{course.title}</h3>
                          <span className="text-sm text-muted-foreground">
                            {course.status}
                          </span>
                        </div>
                        {course.status === "Completed" && (
                          <div className="rounded-full bg-primary/10 p-2 text-primary">
                            <Award className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                      <Progress value={course.progress} className="h-2" />
                      {course.lastAccessed && (
                        <p className="mt-2 text-xs text-muted-foreground">
                          Last accessed {course.lastAccessed}
                        </p>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="wallet">
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                <Card className="hover-card p-6">
                  <TrendingUp className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Current Balance</h3>
                  <p className="text-3xl font-bold">${userData.wallet.balance}</p>
                </Card>

                <Card className="hover-card p-6">
                  <Calendar className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Next Stipend</h3>
                  <p className="text-3xl font-bold">
                    {new Date(userData.wallet.stipendNext).toLocaleDateString()}
                  </p>
                </Card>

                <Card className="hover-card p-6">
                  <Clock className="mb-4 h-8 w-8 text-primary" />
                  <h3 className="mb-2 font-semibold">Referral Earnings</h3>
                  <p className="text-3xl font-bold">${userData.wallet.earnings}</p>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  )
}