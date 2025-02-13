"use client"

import { useState } from "react"
import Link from "next/link"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, AlertCircle } from "lucide-react"

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

export default function PlansPage() {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      
      <main className="flex-1">
        <div className="bg-primary py-16 text-primary-foreground">
          <div className="container text-center">
            <h1 className="mb-4 text-4xl font-bold">Choose Your Plan</h1>
            <p className="text-lg">
              Start your crypto journey with our flexible education plans
            </p>
          </div>
        </div>

        <div className="container py-16">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {plans.map((plan) => (
              <Card
                key={plan.name}
                className={`relative overflow-hidden p-6 transition-all hover:shadow-lg ${
                  selectedPlan === plan.name
                    ? "border-primary ring-2 ring-primary"
                    : ""
                }`}
                onClick={() => setSelectedPlan(plan.name)}
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
                    <span className="text-muted-foreground">
                      /{plan.duration}
                    </span>
                  </div>
                  {plan.stipend && (
                    <p className="text-sm text-muted-foreground">
                      ${plan.stipend.amount} monthly stipend for{" "}
                      {plan.stipend.months} months
                    </p>
                  )}
                </div>

                <ul className="mb-6 space-y-3">
                  {plan.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-1 h-4 w-4 shrink-0 text-primary" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={selectedPlan === plan.name ? "default" : "outline"}
                  asChild
                >
                  <Link href="/register">Choose {plan.name}</Link>
                </Button>
              </Card>
            ))}
          </div>

          <div className="mt-12 rounded-lg bg-muted p-6">
            <div className="flex items-start gap-4">
              <AlertCircle className="mt-1 h-5 w-5 text-primary" />
              <div>
                <h4 className="mb-2 font-semibold">
                  Referral Program Available
                </h4>
                <p className="text-sm text-muted-foreground">
                  Earn 15% commission for every successful referral. Share your
                  unique referral link after registration and start earning today.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}