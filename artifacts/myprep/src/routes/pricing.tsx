import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Check, Star, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const plans = [
  {
    name: "Free",
    price: "₦0",
    period: "forever",
    desc: "Get started with basic exam practice",
    features: [
      "50 free questions/day",
      "3 exam types",
      "Basic score tracking",
      "Community access",
    ],
    cta: "Start Free",
    highlighted: false,
  },
  {
    name: "Premium",
    price: "₦2,500",
    period: "/month",
    desc: "Full access to everything Elite Tutor offers",
    features: [
      "Unlimited questions",
      "All 18+ exam types",
      "AI Study Assistant",
      "Full CBT simulation",
      "Advanced analytics",
      "Ad-free experience",
      "Priority support",
      "Downloadable content",
    ],
    cta: "Go Premium",
    highlighted: true,
  },
  {
    name: "Premium Yearly",
    price: "₦20,000",
    period: "/year",
    desc: "Save 33% with annual billing",
    features: [
      "Everything in Premium",
      "33% savings",
      "Early access to features",
      "Exclusive study groups",
    ],
    cta: "Save with Yearly",
    highlighted: false,
  },
];

export const Route = createFileRoute("/pricing")({
  component: PricingPage,
});

function PricingPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center mb-12">
        <h1 className="font-display text-3xl font-bold text-foreground sm:text-4xl">Simple, Affordable Pricing</h1>
        <p className="mt-3 text-muted-foreground">Start free. Upgrade when you're ready for full power.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-3 max-w-4xl mx-auto">
        {plans.map((plan, i) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border p-6 transition-all ${
              plan.highlighted
                ? "border-primary bg-card shadow-hero relative"
                : "border-border bg-card"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 rounded-full bg-gradient-hero px-3 py-1 text-xs font-semibold text-white">
                <Star className="h-3 w-3" /> Most Popular
              </div>
            )}
            <h3 className="font-display text-lg font-semibold">{plan.name}</h3>
            <div className="mt-2 flex items-baseline gap-1">
              <span className="font-display text-3xl font-bold">{plan.price}</span>
              <span className="text-sm text-muted-foreground">{plan.period}</span>
            </div>
            <p className="mt-2 text-sm text-muted-foreground">{plan.desc}</p>
            <ul className="mt-5 space-y-2.5">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm">
                  <Check className="h-4 w-4 shrink-0 text-primary" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
            <Link to="/signup" className="block mt-6">
              <Button
                className={`w-full gap-2 ${
                  plan.highlighted
                    ? "bg-gradient-hero text-white shadow-hero hover:opacity-90"
                    : ""
                }`}
                variant={plan.highlighted ? "default" : "outline"}
              >
                {plan.cta} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
