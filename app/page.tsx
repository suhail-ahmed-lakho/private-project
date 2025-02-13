"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { SiteHeader } from "@/components/site-header"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check } from "lucide-react"
import {
  ChevronLeft,
  ChevronRight,
  Wallet2,
  BookOpen,
  Users2,
  Trophy,
  ArrowRight,
  CheckCircle2,
  TrendingUp,
  Shield
} from "lucide-react"

const slides = [
  {
    image: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=2070",
    title: "Master Crypto Trading",
    description: "Learn from industry experts and start your journey in cryptocurrency trading",
  },
  {
    image: "https://images.unsplash.com/photo-1621504450181-5d356f61d307?auto=format&fit=crop&q=80&w=2070",
    title: "Earn While You Learn",
    description: "Get stipends and rewards as you progress through our comprehensive courses",
  },
  {
    image: "https://images.unsplash.com/photo-1620321023374-d1a68fbc720d?auto=format&fit=crop&q=80&w=2070",
    title: "Join Our Community",
    description: "Connect with fellow traders and build your network in the crypto space",
  },
]

const features = [
  {
    icon: BookOpen,
    title: "Expert-Led Courses",
    description: "Learn from experienced traders and industry professionals",
  },
  {
    icon: Wallet2,
    title: "Earn Stipends",
    description: "Receive rewards as you progress through your learning journey",
  },
  {
    icon: Users2,
    title: "Community Support",
    description: "Join a thriving community of crypto enthusiasts",
  },
  {
    icon: Trophy,
    title: "Certification",
    description: "Earn recognized certificates upon course completion",
  },
]

const stats = [
  { value: "20K+", label: "Active Students" },
  { value: "95%", label: "Success Rate" },
  { value: "50+", label: "Expert Instructors" },
  { value: "24/7", label: "Support Available" },
]

const plans = [
  {
    name: "Basic",
    price: 30,
    duration: "1 month",
    stipend: null,
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access",
      "Technical Analysis Resources"
    ]
  },
  {
    name: "Standard",
    price: 50,
    duration: "2 months",
    stipend: null,
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access",
      "Technical Analysis Resources",
      "Fundamental Analysis Training"
    ]
  },
  {
    name: "Premium",
    price: 100,
    duration: "4 months",
    stipend: {
      amount: 6,
      months: 3
    },
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access",
      "Technical Analysis Resources",
      "Fundamental Analysis Training",
      "Priority Support",
      "Advanced Market Analysis"
    ]
  },
  {
    name: "Professional",
    price: 200,
    duration: "6 months",
    stipend: {
      amount: 12,
      months: 5
    },
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access",
      "Technical Analysis Resources",
      "Fundamental Analysis Training",
      "Priority Support",
      "Advanced Market Analysis",
      "One-on-One Mentoring",
      "Custom Trading Strategies"
    ]
  }
]

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        {/* Hero Section */}
        <div className="relative h-[85vh] overflow-hidden">
          {slides.map((slide, index) => (
            <div
              key={index}
              className={`absolute inset-0 transition-opacity duration-1000 ${
                index === currentSlide ? "opacity-100" : "opacity-0"
              }`}
            >
              <Image
                src={slide.image}
                alt={slide.title}
                fill
                className="object-cover"
                priority={index === 0}
              />
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container text-center text-white">
                  <h1 className="animate-float mb-6 text-5xl font-bold leading-tight sm:text-6xl md:text-7xl">
                    {slide.title}
                  </h1>
                  <p className="mx-auto mb-8 max-w-2xl text-lg sm:text-xl">
                    {slide.description}
                  </p>
                  <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                    <Button 
                      size="lg" 
                      className="group min-w-[200px] bg-primary text-lg hover:bg-primary/90"
                      asChild
                    >
                      <Link href="/register">
                        Get Started
                        <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                    <Button 
                      size="lg"
                      variant="outline"
                      className="min-w-[200px] border-white text-lg text-white hover:bg-white hover:text-black"
                      asChild
                    >
                      <Link href="/plans">View Plans</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            onClick={() => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)}
            className="absolute left-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>
          <button
            onClick={() => setCurrentSlide((prev) => (prev + 1) % slides.length)}
            className="absolute right-4 top-1/2 -translate-y-1/2 transform rounded-full bg-black/20 p-3 text-white backdrop-blur-sm transition-all hover:bg-black/40"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        {/* Stats Section */}
        <section className="bg-primary py-16 text-primary-foreground">
          <div className="container">
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className="text-center"
                >
                  <p className="mb-2 text-4xl font-bold">{stat.value}</p>
                  <p className="text-lg text-primary-foreground/80">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="container py-24">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold">Why Choose CryptoEdu?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Join thousands of successful traders who started their journey with our comprehensive platform
            </p>
          </div>
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card 
                key={index} 
                className="group hover-card overflow-hidden border-2 p-6"
              >
                <div className="flex flex-col items-center text-center">
                  <div className="mb-4 rounded-2xl bg-primary/10 p-3 text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                    <feature.icon className="h-8 w-8" />
                  </div>
                  <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </Card>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-muted/50 py-24">
          <div className="container">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold">Your Path to Success</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                We provide everything you need to become a successful crypto trader
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2">
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CheckCircle2 className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Structured Learning Path</h3>
                    <p className="text-muted-foreground">
                      Follow our carefully designed curriculum that takes you from basics to advanced trading
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <TrendingUp className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Real Market Experience</h3>
                    <p className="text-muted-foreground">
                      Practice with real market data and simulated trading environments
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <Shield className="mt-1 h-6 w-6 text-primary" />
                  <div>
                    <h3 className="mb-2 text-xl font-semibold">Risk Management</h3>
                    <p className="text-muted-foreground">
                      Learn essential risk management strategies to protect your investments
                    </p>
                  </div>
                </div>
              </div>
              <div className="relative aspect-video overflow-hidden rounded-xl">
                <Image
                  src="https://images.unsplash.com/photo-1642790551116-18e150f248e3?auto=format&fit=crop&q=80&w=2070"
                  alt="Trading Dashboard"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Plans Section */}
        <section className="py-24">
          <div className="container">
            <div className="mb-16 text-center">
              <h2 className="mb-4 text-4xl font-bold">Choose Your Plan</h2>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Start your crypto journey with our flexible education plans
              </p>
            </div>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {plans.map((plan) => (
                <Card
                  key={plan.name}
                  className="relative overflow-hidden p-6 transition-all hover:shadow-lg"
                >
                  {plan.stipend && (
                    <Badge className="absolute right-4 top-4 bg-primary">
                      Stipend Included
                    </Badge>
                  )}
                  <div className="mb-6 text-center">
                    <h3 className="mb-2 text-2xl font-bold">{plan.name}</h3>
                    <div className="mb-2">
                      <span className="text-4xl font-bold">${plan.price}</span>
                      <span className="text-muted-foreground">/{plan.duration}</span>
                    </div>
                    {plan.stipend && (
                      <p className="text-sm text-muted-foreground">
                        ${plan.stipend.amount} monthly stipend for {plan.stipend.months} months
                      </p>
                    )}
                  </div>

                  <ul className="mb-6 space-y-3">
                    {plan.features.slice(0, 4).map((feature) => (
                      <li key={feature} className="flex items-start gap-2">
                        <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full"
                    variant="outline"
                    asChild
                  >
                    <Link href="/plans">Choose {plan.name}</Link>
                  </Button>
                </Card>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button
                size="lg"
                className="min-w-[200px]"
                asChild
              >
                <Link href="/plans">View All Features</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative overflow-hidden py-24">
          <div className="absolute inset-0 bg-primary/10" />
          <div className="container relative">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-4xl font-bold">
                Ready to Start Your Crypto Journey?
              </h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Join thousands of successful traders who started with CryptoEdu. 
                Get access to expert-led courses, community support, and earn while you learn.
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Button 
                  size="lg" 
                  className="min-w-[200px] text-lg"
                  asChild
                >
                  <Link href="/register">Start Learning</Link>
                </Button>
                <Button 
                  size="lg"
                  variant="outline"
                  className="min-w-[200px] text-lg"
                  asChild
                >
                  <Link href="/contact">Talk to an Expert</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}