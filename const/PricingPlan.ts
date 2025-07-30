export const pricingPlans = [
  {
    name: "Starter",
    price: 29,
    period: "month",
    features: [
      { text: "Up to 200 students", included: true },
      { text: "2 admin accounts", included: true },
      { text: "Basic analytics", included: true },
      { text: "Email support", included: true },
    ],
    buttonText: "Get Started",
    buttonVariant: "outline" as const,
  },
  {
    name: "Professional",
    price: 79,
    period: "month",
    features: [
      { text: "Up to 1000 students", included: true },
      { text: "5 admin accounts", included: true },
      { text: "Advanced analytics", included: true },
      { text: "Priority support", included: true },
      { text: "Payment automation", included: true },
    ],
    buttonText: "Get Started",
    buttonVariant: "primary" as const,
    popular: true,
  },
  {
    name: "Enterprise",
    price: 199,
    period: "month",
    features: [
      { text: "Unlimited students", included: true },
      { text: "Unlimited admins", included: true },
      { text: "Custom integrations", included: true },
      { text: "Dedicated support", included: true },
    ],
    buttonText: "Contact Sales",
    buttonVariant: "outline" as const,
  },
];
