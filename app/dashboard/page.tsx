"use client"

import { useState, useEffect, memo } from "react"
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card"
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
  ArrowDownToLine,
  UserCheck,
  DollarSign
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
import { Badge } from "@/components/ui/badge"

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
  referralBonus: {
    type: 'percentage' | 'fixed';
    value: number;
  };
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ElementType;
}

interface ReferredUser {
  name: string;
  joinedDate: string;
  status: 'active' | 'inactive';
  plan: string;
  discount: number;
}

interface ReferralStats {
  myReferralCode: string;
  code: string;
  totalReferrals: number;
  activeReferrals: number;
  earnings: number;
  currentTier: {
    threshold: number;
    bonus: number;
  };
  nextTier?: {
    threshold: number;
    bonus: number;
    remaining: number;
  };
  milestones: {
    achieved: {
      referrals: number;
      reward: {
        type: 'bonus' | 'courseAccess' | 'planUpgrade';
        value: string | number;
      };
    }[];
    next?: {
      referrals: number;
      reward: {
        type: 'bonus' | 'courseAccess' | 'planUpgrade';
        value: string | number;
      };
      remaining: number;
    };
  };
  referredUsers: Array<ReferredUser>;
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

const generateReferralCode = () => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 8; i++) {
    code += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return code;
};

const ReferralCodeCard = () => {
  const [copied, setCopied] = useState(false);
  const [referralCode, setReferralCode] = useState<string>("");

  useEffect(() => {
    // Try to get existing referral code from localStorage
    let code = localStorage.getItem('myReferralCode');
    
    // If no code exists, generate a new one
    if (!code) {
      code = generateReferralCode();
      localStorage.setItem('myReferralCode', code);
      
      // Store this code in the list of valid referral codes
      const storedCodes = JSON.parse(localStorage.getItem('referralCodes') || '[]');
      storedCodes.push(code);
      localStorage.setItem('referralCodes', JSON.stringify(storedCodes));
    }
    
    setReferralCode(code);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Referral code copied!");
  };

  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Referral Code</CardTitle>
        <CardDescription>Share this code with friends to earn rewards</CardDescription>
      </CardHeader>
      <CardContent className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-lg px-4 py-2">
            {referralCode || "Loading..."}
          </Badge>
        </div>
        <Button onClick={copyToClipboard} variant="outline">
          {copied ? "Copied!" : "Copy Code"}
        </Button>
      </CardContent>
    </Card>
  );
};

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
  const [referralData, setReferralData] = useState<ReferralStats>({
    myReferralCode: '',
    code: '',
    totalReferrals: 0,
    activeReferrals: 0,
    earnings: 0,
    currentTier: {
      threshold: 0,
      bonus: 0
    },
    milestones: {
      achieved: [],
      next: undefined
    },
    referredUsers: []
  })

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
          purchaseDate: storedPlan.purchaseDate || new Date().toISOString(),
          referralBonus: {
            type: 'percentage',
            value: 10
          }
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

    // Load or generate referral code
    let code = localStorage.getItem('referralCode');
    
    if (!code) {
      const userName = localStorage.getItem('userName') || 'USER';
      const prefix = userName.slice(0, 3).toUpperCase();
      const random = Math.random().toString(36).substring(2, 7).toUpperCase();
      code = `${prefix}${random}`;
      
      // Store the new code
      localStorage.setItem('referralCode', code);
      
      // Initialize or update the list of valid codes
      const allCodes = JSON.parse(localStorage.getItem('validReferralCodes') || '[]');
      if (!allCodes.includes(code)) {
        allCodes.push(code);
        localStorage.setItem('validReferralCodes', JSON.stringify(allCodes));
      }
    } else {
      // Make sure existing code is in the valid codes list
      const allCodes = JSON.parse(localStorage.getItem('validReferralCodes') || '[]');
      if (!allCodes.includes(code)) {
        allCodes.push(code);
        localStorage.setItem('validReferralCodes', JSON.stringify(allCodes));
      }
    }

    // Update referral data state
    const fetchReferralData = async () => {
      try {
        const response = await fetch(`/api/referrals?code=${code}`);
        if (!response.ok) throw new Error('Failed to fetch referrals');

        const data = await response.json();
        const referrals = data.referrals;

        setReferralData({
          myReferralCode: code,
          code: code,
          totalReferrals: referrals.length,
          activeReferrals: referrals.filter(r => r.status === 'active').length,
          earnings: referrals.reduce((sum, r) => sum + (r.earnings || 0), 0),
          currentTier: {
            threshold: 0,
            bonus: 0
          },
          milestones: {
            achieved: [],
            next: {
              referrals: 5,
              reward: {
                type: 'bonus',
                value: 10
              },
              remaining: 5
            }
          },
          referredUsers: referrals
        });
      } catch (error) {
        console.error('Error fetching referral data:', error);
      }
    };

    fetchReferralData();

    // Set up storage event listener
    window.addEventListener('storage', fetchReferralData);
    return () => window.removeEventListener('storage', fetchReferralData);
  }, [])

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

  // Function to add a test referral
  const addTestReferral = () => {
    const newUser = {
      name: `User ${Math.floor(Math.random() * 1000)}`,
      joinedDate: new Date().toISOString(),
      status: 'active' as const
    };

    // Get current data from localStorage
    const currentUsers = JSON.parse(localStorage.getItem('referredUsers') || '[]');
    const updatedUsers = [...currentUsers, newUser];
    
    // Update localStorage
    localStorage.setItem('referredUsers', JSON.stringify(updatedUsers));
    
    // Update earnings
    const currentEarnings = parseFloat(localStorage.getItem('referralEarnings') || '0');
    const newEarnings = currentEarnings + 10; // $10 per referral
    localStorage.setItem('referralEarnings', newEarnings.toString());

    // Update state
    setReferralData(prev => ({
      ...prev,
      totalReferrals: updatedUsers.length,
      activeReferrals: updatedUsers.filter(u => u.status === 'active').length,
      totalEarnings: newEarnings,
      referredUsers: updatedUsers
    }));
  };

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
            <StatCard title="Total Earnings" value={`$${totalEarnings}`} icon={DollarSign} />
            <StatCard title="Active Referrals" value={userData.referralStats?.activeReferrals || 0} icon={UserCheck} />
            <StatCard title="Total Referrals" value={userData.referralStats?.totalReferrals || 0} icon={Users} />
          </div>

          <ReferralCodeCard />

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
                      <p className="text-sm text-muted-foreground mt-1">
                        {notification.time}
                      </p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  </div>
                ))}
              </div>
            </Card>
          </div>

          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Your Referral Program</h2>
            </div>

            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Your Referral Program</CardTitle>
                <CardDescription>
                  Share your referral code with friends and earn rewards
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-6">
                  {/* Referral Code */}
                  <div className="flex items-center gap-4">
                    <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-lg font-semibold">
                      {referralData.myReferralCode || 'Generating...'}
                    </code>
                    <Button
                      variant="outline"
                      onClick={() => {
                        const code = referralData.myReferralCode;
                        if (code) {
                          navigator.clipboard.writeText(`${window.location.origin}/register?ref=${code}`);
                          toast({
                            title: "Copied!",
                            description: "Referral link copied to clipboard",
                          });
                        }
                      }}
                      disabled={!referralData.myReferralCode}
                    >
                      Copy Referral Link
                    </Button>
                    <Button onClick={addTestReferral}>
                      Test Add Referral
                    </Button>
                  </div>

                  {/* Referral Stats */}
                  <div className="grid gap-6 md:grid-cols-4">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Referrals</p>
                      <p className="text-2xl font-bold">{referralData.totalReferrals}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Active Referrals</p>
                      <p className="text-2xl font-bold">{referralData.activeReferrals}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Current Bonus</p>
                      <p className="text-2xl font-bold text-green-600">
                        {referralData.currentTier.bonus}
                        {selectedPlan?.referralBonus.type === 'percentage' ? '%' : '$'}
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Total Earnings</p>
                      <p className="text-2xl font-bold text-green-600">
                        ${referralData.earnings.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Next Tier Progress */}
                  {referralData.nextTier && (
                    <Card className="p-4 mt-6">
                      <h4 className="font-semibold mb-2">Next Tier Progress</h4>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>
                            {referralData.totalReferrals} / {referralData.nextTier.threshold} Referrals
                          </span>
                          <span className="text-muted-foreground">
                            {referralData.nextTier.remaining} more to unlock {referralData.nextTier.bonus}
                            {selectedPlan?.referralBonus.type === 'percentage' ? '%' : '$'} bonus
                          </span>
                        </div>
                        <Progress
                          value={(referralData.totalReferrals / referralData.nextTier.threshold) * 100}
                          className="h-2"
                        />
                      </div>
                    </Card>
                  )}

                  {/* Milestones */}
                  <div className="space-y-4 mt-6">
                    <h4 className="font-semibold">Milestones</h4>
                    
                    {/* Achieved Milestones */}
                    {referralData.milestones.achieved.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Achieved</p>
                        <div className="grid gap-4 md:grid-cols-2">
                          {referralData.milestones.achieved.map((milestone, index) => (
                            <Card key={index} className="p-4 bg-muted/50">
                              <div className="flex items-center gap-2">
                                <Award className="h-5 w-5 text-green-600" />
                                <div>
                                  <p className="font-medium">
                                    {milestone.referrals} Referrals Achievement
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Reward: {milestone.reward.type === 'bonus' 
                                      ? `$${milestone.reward.value} Bonus` 
                                      : milestone.reward.type === 'planUpgrade'
                                      ? `Free upgrade to ${milestone.reward.value} Plan`
                                      : `Free access to ${milestone.reward.value}`}
                                  </p>
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Milestone */}
                    {referralData.milestones.next && (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">Next Milestone</p>
                        <Card className="p-4">
                          <div className="flex items-center gap-2">
                            <Trophy className="h-5 w-5 text-yellow-600" />
                            <div>
                              <p className="font-medium">
                                {referralData.milestones.next.referrals} Referrals Goal
                              </p>
                              <p className="text-sm text-muted-foreground">
                                Reward: {referralData.milestones.next.reward.type === 'bonus' 
                                  ? `$${referralData.milestones.next.reward.value} Bonus` 
                                  : referralData.milestones.next.reward.type === 'planUpgrade'
                                  ? `Free upgrade to ${referralData.milestones.next.reward.value} Plan`
                                  : `Free access to ${referralData.milestones.next.reward.value}`}
                              </p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {referralData.milestones.next.remaining} more referrals needed
                              </p>
                            </div>
                          </div>
                          <Progress
                            value={((referralData.milestones.next.referrals - referralData.milestones.next.remaining) / referralData.milestones.next.referrals) * 100}
                            className="h-2 mt-3"
                          />
                        </Card>
                      </div>
                    )}
                  </div>

                  {/* Referred Users List */}
                  <div className="space-y-4 mt-6">
                    <h4 className="font-semibold">Recent Referrals</h4>
                    <div className="space-y-2">
                      {referralData.referredUsers.map((user, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <UserCheck className={`h-5 w-5 ${
                                user.status === 'active' ? 'text-green-600' : 'text-yellow-600'
                              }`} />
                              <div>
                                <p className="font-medium">{user.name}</p>
                                <p className="text-sm text-muted-foreground">
                                  Joined {new Date(user.joinedDate).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <Badge variant={user.status === 'active' ? 'default' : 'secondary'}>
                                {user.status}
                              </Badge>
                              <p className="text-sm text-muted-foreground mt-1">{user.plan}</p>
                              <p className="text-sm text-green-600">
                                ${user.discount} discount applied
                              </p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Card>
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