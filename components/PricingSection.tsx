import React from "react";

interface PricingFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  name: string;
  price: number;
  period: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
  popular?: boolean;
  highlightColor?: string;
}

interface PricingSectionProps {
  title?: string;
  subtitle?: string;
  plans: PricingPlan[];
  onPlanSelect?: (planName: string) => void;
}

const PricingSection: React.FC<PricingSectionProps> = ({
  title = "Library Management Plans",
  subtitle = "Choose the perfect plan for your educational institution",
  plans,
  onPlanSelect,
}) => {
  const getButtonClasses = (variant: string) => {
    const baseClasses = "w-full rounded-full px-6 py-3 font-semibold transition-all duration-300";

    switch (variant) {
      case "primary":
        return `${baseClasses} bg-white text-blue-600 hover:bg-gray-100 hover:shadow-lg`;
      case "secondary":
        return `${baseClasses} bg-blue-600 text-white hover:bg-blue-700 hover:shadow-lg`;
      case "outline":
      default:
        return `${baseClasses} border-2 border-slate-300 text-slate-700 hover:border-blue-600 hover:text-blue-600`;
    }
  };

  const getCheckIconColor = (isPopular: boolean = false) => {
    return isPopular ? "text-white" : "text-green-500";
  };

  const getPriceColor = (isPopular: boolean = false) => {
    return isPopular ? "text-blue-200" : "text-slate-600";
  };

  return (
    <section id="pricing" className="bg-slate-50 py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-4xl font-bold md:text-5xl">{title}</h2>
          <p className="mx-auto max-w-3xl text-xl text-slate-600">{subtitle}</p>
        </div>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative overflow-hidden rounded-2xl p-8 shadow-lg ${
                plan.popular
                  ? "bg-blue-600 text-white shadow-2xl"
                  : "border border-slate-100 bg-white"
              }`}
            >
              {plan.popular && (
                <div className="absolute top-4 right-4 rounded-full bg-yellow-400 px-3 py-1 text-sm font-semibold text-yellow-900">
                  Popular
                </div>
              )}

              <h3 className="mb-4 text-2xl font-bold">{plan.name}</h3>

              <div className="mb-6">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className={getPriceColor(plan.popular)}>/{plan.period}</span>
              </div>

              <ul className="mb-8 space-y-3">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center">
                    <svg
                      className={`mr-3 h-5 w-5 ${getCheckIconColor(plan.popular)}`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    {feature.text}
                  </li>
                ))}
              </ul>

              <button
                className={getButtonClasses(plan.buttonVariant)}
                onClick={() => onPlanSelect?.(plan.name)}
              >
                {plan.buttonText}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
