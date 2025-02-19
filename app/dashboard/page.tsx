"use client"

import { useState, useEffect, memo } from "react"
import { SiteHeader } from "@/components/site-header"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
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
  Bell,
  Wallet,
  ArrowDownToLine
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
import { toast } from "react-hot-toast"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Loader2 } from "lucide-react"

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

interface Payment {
  planDetails: {
    name: string;
    price: number;
    duration: string;
  };
  paymentMethod: string;
  transactionId: string;
  status: string;
  timestamp: string;
  screenshot?: string;
}

interface WithdrawalMethod {
  type: 'bank' | 'crypto'
  bankDetails?: {
    name: string
    bankName: string
    accountNo: string
    ifscCode: string
  }
  cryptoDetails?: {
    network: string
    address: string
  }
}

interface Withdrawal {
  amount: number;
  method: 'bank' | 'crypto';
  details: any;
  timestamp: string;
  status: 'pending' | 'completed' | 'failed';
}

interface Plan {
  name: string;
  price: number;
  status: 'active' | 'expired' | 'pending';
  purchaseDate: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

const StatCard = memo(({ title, value, icon: Icon }: StatCardProps) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
      </CardContent>
    </Card>
  )
})

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState("overview")
  const [userName, setUserName] = useState<string>("")
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null)
  const router = useRouter()
  const [payments, setPayments] = useState<Payment[]>([])
  const [lastPaymentId, setLastPaymentId] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)
  const [walletBalance, setWalletBalance] = useState(1000)
  const [totalEarnings, setTotalEarnings] = useState(2500)
  const [totalWithdrawals, setTotalWithdrawals] = useState(0)
  const [pendingWithdrawals, setPendingWithdrawals] = useState(0)
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([])
  const [isWithdrawDialogOpen, setIsWithdrawDialogOpen] = useState(false)
  const [withdrawAmount, setWithdrawAmount] = useState("")
  const [withdrawalMethod, setWithdrawalMethod] = useState<'bank' | 'crypto'>('bank')
  const [bankDetails, setBankDetails] = useState({
    name: '',
    bankName: '',
    accountNo: '',
    ifscCode: ''
  })
  const [cryptoDetails, setCryptoDetails] = useState({
    trc20Address: '',
    bep20Address: ''
  })
  const [isWithdrawing, setIsWithdrawing] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/login")
      return
    }

    // Get user data
    const userDataStr = localStorage.getItem("userData")
    if (userDataStr) {
      const userData = JSON.parse(userDataStr)
      setUserName(userData.name || "User")
    }

    // Get selected plan and payment status
    const storedPlanStr = localStorage.getItem("selectedPlan")
    const paymentStr = localStorage.getItem("payment")
    
    if (storedPlanStr) {
      try {
        const storedPlan = JSON.parse(storedPlanStr)
        const payment = paymentStr ? JSON.parse(paymentStr) : null
        
        // Only show plan as active if payment is completed
        const planStatus = payment?.status === 'completed' ? 'active' : 'pending'
        
        const formattedPlan: Plan = {
          name: formatPlanName(storedPlan.name),
          price: Number(storedPlan.price),
          status: planStatus,
          purchaseDate: storedPlan.purchaseDate || new Date().toISOString()
        }
        
        if (planStatus === 'active') {
          setSelectedPlan(formattedPlan)
        } else {
          setSelectedPlan(null) // Don't show pending plans
        }
      } catch (error) {
        console.error("Error parsing plan/payment data:", error)
        // Clear invalid data
        localStorage.removeItem("selectedPlan")
        localStorage.removeItem("payment")
      }
    }

    // Get wallet stats
    const storedStats = localStorage.getItem('walletStats')
    if (storedStats) {
      const stats = JSON.parse(storedStats)
      setWalletBalance(stats.balance)
      setTotalEarnings(stats.totalEarnings)
      setTotalWithdrawals(stats.totalWithdrawals)
      setPendingWithdrawals(stats.pendingWithdrawals)
    }

    // Load withdrawal history
    const storedWithdrawals = localStorage.getItem('withdrawals')
    if (storedWithdrawals) {
      setWithdrawals(JSON.parse(storedWithdrawals))
    }

    // Get payments from localStorage
    const storedPayments = localStorage.getItem('payments')
    if (storedPayments) {
      setPayments(JSON.parse(storedPayments))
    }

    // Get last payment ID
    const lastId = localStorage.getItem('lastPaymentId')
    if (lastId) {
      setLastPaymentId(lastId)
      localStorage.removeItem('lastPaymentId')
      
      toast.success("Payment submitted! We're processing your request.", {
        duration: 5000,
        icon: '🎉'
      })
    }

    // Get payment status
    const payments = localStorage.getItem('payments')
    if (payments) {
      const paymentsList = JSON.parse(payments)
      if (paymentsList.length > 0) {
        const latestPayment = paymentsList[paymentsList.length - 1]
        // Update plan status based on payment
        if (selectedPlan) {
          setSelectedPlan(prev => prev ? {
            ...prev,
            status: latestPayment.status
          } : null)
        }
      }
    }

    // Add loading state
    const fetchData = async () => {
      try {
        // Fetch data
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching data:", error)
        setIsLoading(false)
      }
    }
    fetchData()
  }, [router])

  const handleWithdrawSubmit = async () => {
    if (!withdrawAmount || parseFloat(withdrawAmount) <= 0) {
      toast.error("Please enter a valid amount")
      return
    }

    if (parseFloat(withdrawAmount) > walletBalance) {
      toast.error("Insufficient balance")
      return
    }

    setIsWithdrawing(true)
    try {
      const withdrawalAmount = parseFloat(withdrawAmount)
      
      // Update wallet balance
      const newBalance = walletBalance - withdrawalAmount
      setWalletBalance(newBalance)
      localStorage.setItem('walletBalance', newBalance.toString())

      const newWithdrawal: Withdrawal = {
        amount: withdrawalAmount,
        method: withdrawalMethod,
        details: withdrawalMethod === 'bank' ? bankDetails : cryptoDetails,
        timestamp: new Date().toISOString(),
        status: 'pending' as const
      }

      const updatedWithdrawals = [...withdrawals, newWithdrawal]
      setWithdrawals(updatedWithdrawals)
      localStorage.setItem('withdrawals', JSON.stringify(updatedWithdrawals))

      toast.success("Withdrawal request submitted successfully!")
      setIsWithdrawDialogOpen(false)
      setWithdrawAmount("")
    } catch (error) {
      toast.error("Failed to process withdrawal")
    } finally {
      setIsWithdrawing(false)
    }
  }

  const resetForm = () => {
    setWithdrawAmount("")
    setBankDetails({
      name: '',
      bankName: '',
      accountNo: '',
      ifscCode: ''
    })
    setCryptoDetails({
      trc20Address: '',
      bep20Address: ''
    })
  }

  const formatPlanName = (name: string) => {
    switch(name?.toLowerCase()) {
      case "basic":
        return "🚀 Basic Plan"
      case "standard":
        return "⭐ Standard Plan"
      case "premium":
        return "💎 Premium Plan"
      case "professional":
        return "👑 Professional Plan"
      default:
        return name || "No Plan Selected"
    }
  }

  // Debug function to check stored data
  useEffect(() => {
    const plan = localStorage.getItem("selectedPlan")
    const payment = localStorage.getItem("payment")
    console.log("Stored plan:", plan ? JSON.parse(plan) : null)
    console.log("Stored payment:", payment ? JSON.parse(payment) : null)
  }, [])

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>
  }

  if (!mounted) return null

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Welcome back, {userName}!</h1>
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Active Plan:</span>
          <span className="inline-flex items-center rounded-full bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-1.5 text-sm font-medium text-white shadow-sm">
            {selectedPlan?.name || "No Plan Selected"}
          </span>
        </div>
      </div>

      {/* Active Plan Card */}
      <Card className="p-6 mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold mb-2">Subscription Details</h2>
            {selectedPlan ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">{selectedPlan.name}</span>
                  <span className={`px-2 py-1 text-sm rounded-full ${
                    selectedPlan.status === 'active' 
                      ? 'bg-green-100 text-green-700'
                      : selectedPlan.status === 'pending'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {selectedPlan.status.charAt(0).toUpperCase() + selectedPlan.status.slice(1)}
                  </span>
                </div>
                <p className="text-muted-foreground">
                  ${selectedPlan.price.toFixed(2)}/month
                </p>
                <p className="text-sm text-muted-foreground">
                  Started: {new Date(selectedPlan.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            ) : (
              <div className="flex flex-col gap-2">
                <p className="text-muted-foreground">No active subscription</p>
                <Button
                  onClick={() => router.push('/plans')}
                  variant="outline"
                  className="w-fit"
                >
                  View Plans
                </Button>
              </div>
            )}
          </div>
          {selectedPlan && (
            <Button
              variant="outline"
              onClick={() => router.push('/plans')}
              className="shrink-0"
            >
              Upgrade Plan
            </Button>
          )}
        </div>
      </Card>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="courses">My Courses</TabsTrigger>
          <TabsTrigger value="wallet">Wallet</TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard title="Overall Progress" value={`${userData.progress}%`} icon={Trophy} />
            <StatCard title="Courses Completed" value={userData.coursesCompleted} icon={BookOpen} />
            <StatCard title="Referrals" value={userData.wallet.referrals} icon={Users} />
            <StatCard title="Total Earnings" value={`$${userData.wallet.earnings}`} icon={Wallet2} />
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
          <div className="grid gap-6 md:grid-cols-2 mb-8">
            <Card className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-xl font-semibold flex items-center gap-2">
                    <Wallet className="h-5 w-5" />
                    Wallet Balance
                  </h2>
                  <p className="text-3xl font-bold mt-2 text-green-600">
                    ${walletBalance.toFixed(2)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Available for withdrawal
                  </p>
                </div>
                <Button
                  onClick={() => setIsWithdrawDialogOpen(true)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                  disabled={walletBalance <= 0}
                >
                  <ArrowDownToLine className="h-4 w-4" />
                  Withdraw
                </Button>
              </div>
              {walletBalance <= 0 && (
                <p className="text-sm text-red-500">
                  Insufficient balance for withdrawal
                </p>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Stats</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-2 bg-green-50 rounded-lg">
                  <span className="text-muted-foreground">Total Earnings</span>
                  <span className="font-medium text-green-600">${totalEarnings.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-blue-50 rounded-lg">
                  <span className="text-muted-foreground">Total Withdrawals</span>
                  <span className="font-medium text-blue-600">${totalWithdrawals.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                  <span className="text-muted-foreground">Pending Withdrawals</span>
                  <span className="font-medium text-yellow-600">${pendingWithdrawals.toFixed(2)}</span>
                </div>
              </div>
            </Card>

            {withdrawals.length > 0 && (
              <Card className="p-6 md:col-span-2">
                <h2 className="text-xl font-semibold mb-4">Recent Withdrawals</h2>
                <div className="space-y-3">
                  {withdrawals.map((withdrawal, index) => (
                    <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                      <div>
                        <p className="font-medium">${withdrawal.amount.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(withdrawal.timestamp).toLocaleDateString()} via {withdrawal.method}
                        </p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-sm ${
                        withdrawal.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        withdrawal.status === 'completed' ? 'bg-green-100 text-green-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {withdrawal.status.charAt(0).toUpperCase() + withdrawal.status.slice(1)}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Purchases</h2>
        <div className="space-y-4">
          {payments.length > 0 ? (
            payments.map((payment, index) => (
              <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">{payment.planDetails.name} Plan</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        payment.status === 'pending' 
                          ? 'bg-yellow-100 text-yellow-800'
                          : payment.status === 'completed'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Amount</p>
                        <p className="font-medium">
                          ${payment.planDetails.price}/{payment.planDetails.duration}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Payment Method</p>
                        <p className="font-medium">{payment.paymentMethod}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Transaction ID</p>
                        <p className="font-medium">{payment.transactionId}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Purchase Date</p>
                        <p className="font-medium">
                          {new Date(payment.timestamp).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {payment.screenshot && (
                    <div className="relative h-24 w-24 rounded-lg overflow-hidden shrink-0">
                      <Image
                        src={payment.screenshot}
                        alt="Payment proof"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </Card>
            ))
          ) : (
            <Card className="p-6">
              <p className="text-center text-muted-foreground">
                No purchase history available
              </p>
            </Card>
          )}
        </div>
      </div>

      <Dialog open={isWithdrawDialogOpen} onOpenChange={setIsWithdrawDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold">
              STUDENT WITHDRAWAL FROM
            </DialogTitle>
          </DialogHeader>
          
          {/* Make this div scrollable */}
          <div className="flex-1 overflow-y-auto pr-2">
            {/* Amount Section */}
            <div className="mb-6 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <h3 className="font-bold text-lg">Withdrawal Amount</h3>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-medium">Available Balance: ${walletBalance.toFixed(2)}</span>
                </div>
                <div>
                  <label className="text-sm font-medium">Amount to Withdraw:</label>
                  <Input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    placeholder="Enter amount"
                    min="0"
                    max={walletBalance}
                    className="mt-1"
                  />
                  {parseFloat(withdrawAmount) > walletBalance && (
                    <p className="text-red-500 text-sm mt-1">
                      Amount exceeds available balance
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Method Selection */}
            <div className="mb-6 sticky top-0 bg-white z-10">
              <div className="flex gap-4 mb-4">
                <Button
                  type="button"
                  variant={withdrawalMethod === 'bank' ? 'default' : 'outline'}
                  onClick={() => setWithdrawalMethod('bank')}
                  className="flex-1"
                >
                  Bank Transfer
                </Button>
                <Button
                  type="button"
                  variant={withdrawalMethod === 'crypto' ? 'default' : 'outline'}
                  onClick={() => setWithdrawalMethod('crypto')}
                  className="flex-1"
                >
                  Crypto Currency
                </Button>
              </div>
            </div>

            {/* Conditional Rendering of Details */}
            {withdrawalMethod === 'bank' ? (
              <div className="space-y-4">
                <h3 className="font-bold">BANK DETAILS :</h3>
                <div>
                  <label className="text-sm font-medium">NAME :</label>
                  <Input
                    type="text"
                    value={bankDetails.name}
                    onChange={(e) => setBankDetails({...bankDetails, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">BANK NAME :</label>
                  <Input
                    type="text"
                    value={bankDetails.bankName}
                    onChange={(e) => setBankDetails({...bankDetails, bankName: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">ACCOUNT NO :</label>
                  <Input
                    type="text"
                    value={bankDetails.accountNo}
                    onChange={(e) => setBankDetails({...bankDetails, accountNo: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">IFSC CODE :</label>
                  <Input
                    type="text"
                    value={bankDetails.ifscCode}
                    onChange={(e) => setBankDetails({...bankDetails, ifscCode: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <h3 className="font-bold">CRYPTO CURRENCY :</h3>
                <div>
                  <p className="text-sm font-medium">DEPOSIT NETWORK (TRX)</p>
                  <p className="font-medium">TRON (TRC20)</p>
                  <Input
                    type="text"
                    value={cryptoDetails.trc20Address}
                    onChange={(e) => setCryptoDetails({...cryptoDetails, trc20Address: e.target.value})}
                    placeholder="Enter TRC20 address"
                  />
                </div>
                <div>
                  <p className="text-sm font-medium">DEPOSIT NETWORK (BNB)</p>
                  <p className="font-medium">BNB smart chain (BEP20)</p>
                  <Input
                    type="text"
                    value={cryptoDetails.bep20Address}
                    onChange={(e) => setCryptoDetails({...cryptoDetails, bep20Address: e.target.value})}
                    placeholder="Enter BEP20 address"
                  />
                </div>
              </div>
            )}
          </div>

          <DialogFooter className="mt-4">
            <Button 
              onClick={handleWithdrawSubmit} 
              disabled={isWithdrawing || !withdrawAmount || parseFloat(withdrawAmount) > walletBalance} 
              className="w-full"
            >
              {isWithdrawing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                'Submit Withdrawal Request'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}