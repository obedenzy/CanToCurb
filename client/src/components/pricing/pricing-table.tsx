import { useState } from "react";
import { Check } from "lucide-react";
import { Link } from "wouter";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";

export default function PricingTable() {
  const [isQuarterly, setIsQuarterly] = useState(false);
  
  // Fetch plans from the API
  const { data: plans, isLoading } = useQuery({
    queryKey: ['/api/plans'],
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-16">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <section id="pricing" className="py-16 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-secondary">Trash day on autopilot.</h2>
          <p className="mt-4 text-gray-600 max-w-3xl mx-auto">
            All plans include a 15-day risk-free trial with no strings attached. Cancel anytime.
          </p>
          
          <div className="flex items-center justify-center mt-6">
            <span className="text-gray-600 mr-3">Monthly</span>
            <Switch
              id="billing-toggle"
              checked={isQuarterly}
              onCheckedChange={setIsQuarterly}
            />
            <Label htmlFor="billing-toggle" className="cursor-pointer flex items-center space-x-1 ml-3">
              <span className="text-gray-600">Quarterly</span>
              <Badge variant="outline" className="text-primary">Save 10%</Badge>
            </Label>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {plans?.map((plan, index) => (
            <div 
              key={plan.id} 
              className={`
                bg-neutral rounded-lg shadow-sm overflow-hidden 
                border-t-4 ${index === 1 ? 'border-primary transform scale-105 z-10 shadow-md' : 'border-gray-200 hover:shadow-md'} 
                transition-all duration-300 relative
              `}
            >
              {index === 1 && (
                <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1">
                  Most Popular
                </div>
              )}
              
              <div className="p-6">
                <div className="text-center pb-4">
                  <h3 className="text-lg font-semibold text-secondary">{plan.name}</h3>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-secondary">
                      ${isQuarterly 
                        ? ((plan.quarterlyPrice || 0) / 300).toFixed(0) 
                        : ((plan.monthlyPrice || 0) / 100).toFixed(0)}
                    </span>
                    <span className="text-gray-500">/{isQuarterly ? 'quarter' : 'month'}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{plan.description}</p>
                </div>
                
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <Check className="h-5 w-5 text-primary flex-shrink-0 mr-2" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-8">
                  <Link href={`/signup?plan=${plan.id}&cycle=${isQuarterly ? 'quarterly' : 'monthly'}`}>
                    <Button 
                      className={`w-full ${index === 1 ? 'bg-primary hover:bg-primary/90' : 'bg-secondary hover:bg-secondary/90'} text-white`}
                    >
                      {plan.name === 'Enterprise' ? "Let's Talk" : `Get ${plan.name}`}
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="mt-10 text-center text-gray-500 text-sm max-w-3xl mx-auto">
          <p className="mb-4">1. Our Can-to-Curb service includes taking your cans to the curb for existing home collection day, and returning them the next day, after pickup.</p>
          <p>2. For alternative service needs, please contact our sales team for a custom quote.</p>
        </div>
      </div>
    </section>
  );
}
