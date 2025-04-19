import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { useLocation, Redirect } from 'wouter';
import { Helmet } from 'react-helmet';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type SubscribeFormProps = {
  planName: string;
  planPrice: number;
  billingCycle: string;
};

const SubscribeForm = ({ planName, planPrice, billingCycle }: SubscribeFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/subscribe/success`,
        },
      });

      if (error) {
        setErrorMessage(error.message || "An unexpected error occurred.");
        toast({
          title: "Payment Failed",
          description: error.message,
          variant: "destructive",
        });
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An unexpected error occurred.");
      toast({
        title: "Payment Error",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="space-y-6">
        <PaymentElement />
        
        {errorMessage && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-start">
            <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
            <p>{errorMessage}</p>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-500">
            You'll be charged {formatCurrency(planPrice)} {billingCycle === 'quarterly' ? 'every 3 months' : 'per month'}
          </p>
          <Button 
            type="submit" 
            disabled={!stripe || isProcessing}
            className="px-8"
          >
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              "Subscribe Now"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default function Subscribe() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();
  
  // Get the query parameters
  const params = new URLSearchParams(location.split('?')[1] || '');
  const planId = params.get('planId');
  const billingCycle = params.get('cycle') || 'monthly';
  
  // Check authentication status
  const { data: authData, isLoading: authLoading } = useQuery({
    queryKey: ['/api/auth-status'],
    retry: false,
  });
  
  // Redirect if not authenticated
  if (!authLoading && !authData?.authenticated) {
    return <Redirect to="/login" />;
  }
  
  // Get plan details
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/plans'],
    enabled: !!planId,
  });
  
  const selectedPlan = plans?.find((p: any) => p.id === Number(planId));
  const planPrice = selectedPlan 
    ? (billingCycle === 'quarterly' ? selectedPlan.quarterlyPrice : selectedPlan.monthlyPrice) 
    : 0;
  
  // Validate the plan ID
  if (!planId) {
    return <Redirect to="/pricing" />;
  }

  useEffect(() => {
    // Skip if still loading plans or not authenticated
    if (plansLoading || authLoading || !authData?.authenticated || !selectedPlan) {
      return;
    }
    
    // Create subscription
    const createSubscriptionIntent = async () => {
      try {
        setIsLoading(true);
        
        // First create a payment method
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }
        
        // Get payment method from elements in the next step when form is submitted
        // Here we just get the client secret
        const response = await apiRequest("POST", "/api/create-subscription", { 
          planId,
          billingCycle,
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "Failed to initialize subscription");
      } finally {
        setIsLoading(false);
      }
    };
    
    createSubscriptionIntent();
  }, [planId, billingCycle, authData, plansLoading, authLoading, selectedPlan]);

  // Handle loading and error states
  if (authLoading || plansLoading || (isLoading && !error)) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl">Setting up your subscription...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
            <CardTitle>Subscription Error</CardTitle>
            <CardDescription>There was a problem setting up your subscription</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-center text-red-600">{error}</p>
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button onClick={() => window.history.back()}>Go Back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // If plan not found
  if (!selectedPlan) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle>Plan Not Found</CardTitle>
            <CardDescription>The selected plan is not available</CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <a href="/pricing">View Available Plans</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Make sure we have a client secret to proceed
  if (!clientSecret) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <p className="text-xl">Setting up payment information...</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Subscribe | TrashMonkey</title>
        <meta name="description" content="Subscribe to TrashMonkey's trash can service" />
      </Helmet>
      
      <div className="py-12 bg-neutral">
        <div className="container max-w-3xl mx-auto px-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Subscribe</CardTitle>
              <CardDescription>Complete your subscription to our trash can service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">{selectedPlan.name} Plan</h3>
                  <span className="font-medium">{formatCurrency(planPrice)}</span>
                </div>
                <p className="text-sm text-gray-500">{selectedPlan.description}</p>
                <div className="bg-neutral-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Plan Features</h4>
                  <ul className="space-y-1">
                    {selectedPlan.features.map((feature: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <Separator />
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-medium">Billing Cycle</h3>
                    <p className="text-sm text-gray-500">
                      {billingCycle === 'quarterly' ? 'Every 3 months' : 'Monthly'}
                    </p>
                  </div>
                  <span className="font-medium">{formatCurrency(planPrice)}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <SubscribeForm 
                  planName={selectedPlan.name} 
                  planPrice={planPrice} 
                  billingCycle={billingCycle} 
                />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};
