"use client"

import { useState, Suspense, useEffect } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Eye, EyeOff, Loader2 } from "lucide-react"

export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <RegisterContent />
    </Suspense>
  )
}

function RegisterContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const redirectTo = searchParams.get('redirect')
  const referralCode = searchParams.get('ref')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Error",
        description: "Passwords do not match",
        variant: "destructive"
      })
      return
    }

    if (formData.password.length < 8) {
      toast({
        title: "Error",
        description: "Password must be at least 8 characters long",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    
    try {
      localStorage.setItem("userName", formData.fullName)
      
      const userData = {
        name: formData.fullName,
        email: formData.email,
        registrationDate: new Date().toISOString()
      }
      localStorage.setItem("userData", JSON.stringify(userData))
      localStorage.setItem("token", "mock-token")

      if (referralCode) {
        try {
          const response = await fetch('/api/referrals', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              referralCode,
              userName: formData.fullName,
              email: formData.email
            }),
          });

          if (!response.ok) {
            throw new Error('Failed to record referral');
          }

          localStorage.setItem("usedReferralCode", referralCode)

          toast({
            title: "Registration Successful",
            description: "Referral code applied! You'll get a discount on your purchase.",
          })
        } catch (error) {
          console.error('Error recording referral:', error);
          toast({
            title: "Warning",
            description: "Registration successful but failed to apply referral code.",
            variant: "destructive",
          })
        }
      } else {
        toast({
          title: "Registration Successful",
          description: "Please login to continue",
        })
      }
      
      router.push(`/login${redirectTo ? `?redirect=${redirectTo}` : ''}`)
      router.refresh()
    } catch (error) {
      console.error('Registration error:', error)
      toast({
        title: "Error",
        description: "Registration failed. Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (referralCode) {
      console.log('Referral code detected:', referralCode)
    }
  }, [referralCode])

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1">
        <div className="container flex items-center justify-center py-8 sm:py-16">
          <Card className="w-full max-w-md p-4 sm:p-6">
            <div className="text-center">
              <h1 className="mb-2 text-2xl font-bold">Create an Account</h1>
              <p className="mb-6 text-muted-foreground">
                Join CryptoEdu and start your crypto journey today
              </p>
              {referralCode && (
                <div className="mb-4 p-2 bg-green-50 text-green-700 rounded-md text-sm">
                  <p className="font-medium">Referral Code Applied!</p>
                  <p>Code: {referralCode}</p>
                  <p>You'll get a discount on your purchase</p>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  Full Name
                </label>
                <Input
                  id="fullName"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium">
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password
                </label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    autoComplete="new-password"
                    className="w-full pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-0 top-0"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link
                  href="/login"
                  className="font-medium text-primary hover:underline"
                >
                  Log in
                </Link>
              </p>
            </form>
          </Card>
        </div>
      </main>
    </div>
  )
}