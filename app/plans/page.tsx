"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Check, Crown, Star } from "lucide-react"

const plans = [
  {
    name: "Basic",
    price: 30,
    duration: "1 month",
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access"
    ],
    stipend: null
  },
  {
    name: "Standard",
    price: 50,
    duration: "2 months",
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access"
    ],
    stipend: null
  },
  {
    name: "Premium",
    price: 100,
    duration: "4 months",
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access"
    ],
    stipend: {
      amount: 6,
      months: 3
    }
  },
  {
    name: "Professional",
    price: 200,
    duration: "6 months",
    features: [
      "Basic to advance curriculum coverage",
      "Complete crypto feature access",
      "24/7 Customer Support",
      "Crypto Signal Access"
    ],
    stipend: {
      amount: 12,
      months: 5
    }
  }
]

export default function PlansPage() {
  const router = useRouter()
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null)

  const handlePlanSelection = (plan: { name: string; price: number }) => {
    // Store complete plan data
    const planData = {
      name: plan.name,
      price: plan.price,
      status: 'pending',
      purchaseDate: new Date().toISOString()
    }
    
    // Store selected plan
    localStorage.setItem("selectedPlan", JSON.stringify(planData))
    
    const token = localStorage.getItem("token")
    if (!token) {
      router.push(`/register?redirect=/payment`)
    } else {
      router.push("/payment")
    }
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4">Choose Your Plan</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Select the perfect plan to start your crypto trading journey. All plans include access to our community and basic resources.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <Card 
            key={plan.name}
            className={`p-6 relative overflow-hidden group transition-all duration-300 
              hover:shadow-2xl hover:-translate-y-1 flex flex-col
              ${plan.name === "Premium" ? "border-primary shadow-lg" : ""}
              ${plan.name === "Professional" ? "border-purple-500 shadow-lg" : ""}
            `}
          >
            {/* Popular Badge for Premium */}
            {plan.name === "Premium" && (
              <div className="absolute top-5 -right-12 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground px-14 py-1.5 text-sm 
                transform rotate-45 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center gap-1">
                  <Star className="h-4 w-4" />
                  <span>Most Popular</span>
                </div>
              </div>
            )}
            
            {/* Best Value Badge for Professional */}
            {plan.name === "Professional" && (
              <div className="absolute top-5 -right-12 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-14 py-1.5 text-sm 
                transform rotate-45 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <div className="flex items-center justify-center gap-1">
                  <Crown className="h-4 w-4" />
                  <span>Best Value</span>
                </div>
              </div>
            )}

            <div className="mb-6 relative">
              <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold group-hover:text-primary transition-colors duration-300">
                  ${plan.price}
                </span>
                <span className="text-muted-foreground">/{plan.duration}</span>
              </div>
              {plan.stipend && (
                <p className="text-green-600 font-medium mt-2 text-sm">
                  ${plan.stipend.amount} monthly stipend for {plan.stipend.months} months
                </p>
              )}
            </div>

            <div className="flex-grow">
              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 group-hover:transform group-hover:translate-x-1 transition-transform duration-200">
                    <Check className="h-4 w-4 text-primary shrink-0 mt-1" />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-6 mt-auto border-t">
              <Button
                className={`w-full h-12 text-sm font-medium transition-all duration-300 
                  ${plan.name === "Professional" 
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 shadow-lg hover:shadow-xl" 
                    : plan.name === "Premium"
                    ? "bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl"
                    : "hover:bg-primary hover:text-primary-foreground"
                  }
                  group-hover:scale-105
                `}
                variant={plan.name === "Premium" || plan.name === "Professional" ? "default" : "outline"}
                onClick={() => handlePlanSelection(plan)}
              >
                Get Started Now
              </Button>
              <p className="text-xs text-center text-muted-foreground mt-3 group-hover:text-primary transition-colors duration-300">
                {plan.name === "Professional" || plan.name === "Premium" 
                  ? "Instant Access to All Features" 
                  : "7-Day Money-Back Guarantee"}
              </p>
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-12 text-center">
        <div className="inline-flex items-center gap-4 p-4 bg-muted rounded-lg hover:bg-muted/80 transition-colors duration-300">
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">7-Day Money-Back Guarantee</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">Cancel Anytime</span>
          </div>
          <div className="h-4 w-px bg-border" />
          <div className="flex items-center gap-2">
            <Check className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">24/7 Support</span>
          </div>
        </div>
      </div>
    </div>
  )
}