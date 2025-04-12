import { useState, useEffect } from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

type PaymentInfoProps = {
  planId: string;
  billingCycle: string;
  updateFields: (fields: Partial<PaymentInfoProps>) => void;
};

export default function PaymentInfo({
  planId,
  billingCycle,
  updateFields,
}: PaymentInfoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const [setupComplete, setSetupComplete] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  
  // Get plan details
  const { data: plans } = useQuery({
    queryKey: ['/api/plans'],
  });
  
  const selectedPlan = plans?.find(p => p.id.toString() === planId.toString());
  
  useEffect(() => {
    if (!planId) return;
    
    const createSubscription = async () => {
      try {
        setIsLoading(true);
        const response = await stripe?.elements({
          mode: 'setup',
          currency: 'usd',
        });
        
        setSetupComplete(true);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to setup payment form",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    if (stripe && !setupComplete) {
      createSubscription();
    }
  }, [stripe, planId, toast, setupComplete]);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Get payment method
      const { error: setupError, setupIntent } = await stripe.confirmSetup({
        elements,
        redirect: 'if_required',
      });
      
      if (setupError) {
        throw new Error(setupError.message);
      }
      
      if (!setupIntent || !setupIntent.payment_method) {
        throw new Error("Failed to process payment information");
      }
      
      // Create subscription with payment method
      const subscriptionResponse = await apiRequest("POST", "/api/create-subscription", {
        planId,
        paymentMethod: setupIntent.payment_method,
        billingCycle
      });
      
      const subscriptionData = await subscriptionResponse.json();
      
      toast({
        title: "Success!",
        description: "Your subscription has been created successfully.",
      });
      
      // Let the parent component know we're done
      e.currentTarget.requestSubmit();
      
    } catch (error: any) {
      toast({
        title: "Payment Failed",
        description: error.message || "An error occurred during payment processing",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  if (isLoading || !setupComplete) {
    return (
      <div className="flex flex-col items-center justify-center space-y-4 py-8">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p>Setting up payment form...</p>
      </div>
    );
  }
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h3 className="text-lg font-medium text-gray-800 mb-4">Payment Information</h3>
      
      {selectedPlan && (
        <div className="mb-6 p-4 bg-white rounded-lg border border-gray-200">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-lg">Plan Summary</h4>
            <span className="text-gray-500">{billingCycle === 'quarterly' ? 'Quarterly' : 'Monthly'}</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{selectedPlan.name} Plan</span>
            <span className="font-bold">
              ${billingCycle === 'quarterly' 
                ? ((selectedPlan.quarterlyPrice || 0) / 100).toFixed(2)
                : ((selectedPlan.monthlyPrice || 0) / 100).toFixed(2)
              }
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Your 15-day free trial starts today. You won't be charged until your trial ends.
          </p>
        </div>
      )}
      
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
        <PaymentElement />
      </div>
      
      <div className="pt-4 flex justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={() => history.back()}
          disabled={isLoading}
        >
          Back
        </Button>
        <Button
          type="submit"
          className="bg-primary hover:bg-primary/90 text-white"
          disabled={isLoading || !stripe || !elements}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Complete Signup"
          )}
        </Button>
      </div>
    </form>
  );
}
