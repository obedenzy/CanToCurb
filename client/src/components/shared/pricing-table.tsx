import { useState } from "react";
import { Link } from "wouter";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { UserWithSubscription, PricingPlan } from "@/lib/types";

type PricingTableProps = {
  plans: PricingPlan[];
  loading?: boolean;
  user: UserWithSubscription | null;
};

export default function PricingTable({ plans, loading = false, user }: PricingTableProps) {
  const [isQuarterly, setIsQuarterly] = useState(false);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 flex flex-col h-[460px]">
            <div className="p-6 border-b border-gray-100">
              <div className="space-y-3">
                <Skeleton className="h-6 w-1/2 mx-auto" />
                <Skeleton className="h-8 w-1/3 mx-auto" />
                <Skeleton className="h-4 w-2/3 mx-auto" />
                <Skeleton className="h-4 w-full mx-auto" />
              </div>
              <Skeleton className="h-10 w-full mt-4" />
            </div>
            <div className="flex-grow p-6">
              <div className="space-y-3">
                {[1, 2, 3, 4, 5].map((j) => (
                  <Skeleton key={j} className="h-5 w-full" />
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-secondary mb-4">Trash day on autopilot</h2>
        <p className="text-gray-600 max-w-3xl mx-auto">All plans include a 15 day free trial with no strings attached. Cancel anytime.</p>
        
        <div className="inline-flex items-center mt-4">
          <span className="mr-3 text-sm font-medium text-gray-700">Monthly</span>
          <Switch
            checked={isQuarterly}
            onCheckedChange={setIsQuarterly}
          />
          <span className="ml-3 text-sm font-medium text-gray-700">Quarterly Discount</span>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {plans.map((plan) => (
          <div 
            key={plan.id} 
            className={`bg-white rounded-lg shadow-sm overflow-hidden border ${plan.isPopular ? 'border-primary/30' : 'border-gray-100'} flex flex-col relative`}
          >
            {plan.isPopular && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                Most Popular
              </div>
            )}
            <div className="p-6 border-b border-gray-100">
              <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-secondary">${isQuarterly && plan.priceQuarterly ? (plan.priceQuarterly / 300).toFixed(0) : (plan.priceMonthly / 100).toFixed(0)}</h3>
                <span className="text-gray-500">per month</span>
                <p className="mt-2 text-gray-600">{plan.description}</p>
              </div>
              {plan.name === "Enterprise" ? (
                <Link href="/contact">
                  <a className="block w-full bg-primary text-white hover:bg-primary/90 py-2 rounded-md text-center font-medium">
                    Let's Talk
                  </a>
                </Link>
              ) : (
                <Link href={user ? "/dashboard" : "/signup"}>
                  <a className={`block w-full ${plan.isPopular ? 'bg-primary text-white hover:bg-primary/90' : 'bg-white text-primary border border-primary hover:bg-primary/5'} py-2 rounded-md text-center font-medium`}>
                    {user ? "Go to Dashboard" : `Try ${plan.name}`}
                  </a>
                </Link>
              )}
            </div>
            <div className="flex-grow p-6">
              <ul className="space-y-3">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center">
                    <Check className="text-green-500 mr-2 h-5 w-5" />
                    <span className="text-gray-600">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-8 text-center max-w-3xl mx-auto">
        <p className="text-sm text-gray-500 mb-2">1. Our Can-to-Curb service includes taking your cans to the curb the evening before collection day, and returning them the next day, after pickup.</p>
        <p className="text-sm text-gray-500">2. For properties over 50 ft, please contact our sales team for a custom quote.</p>
      </div>
    </>
  );
}
