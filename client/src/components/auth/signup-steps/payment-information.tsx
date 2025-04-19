import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { paymentInfoSchema } from "@/lib/validations";
import { SignupFormData } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { useState, useEffect } from "react";
import { Loader2, Check } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiRequest } from "@/lib/queryClient";

// Make sure to call `loadStripe` outside of a component's render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

type PaymentInformationProps = {
  defaultValues: Partial<SignupFormData>;
  onSubmit: (data: Partial<SignupFormData>) => void;
  onBack: () => void;
};

const StripePaymentForm = ({ 
  planId, 
  isMonthlyBilling,
  promoCode,
  termsAgreement,
  onComplete 
}: { 
  planId: number; 
  isMonthlyBilling: boolean;
  promoCode?: string;
  termsAgreement: boolean;
  onComplete: (data: Partial<SignupFormData>) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setIsLoading(true);
    
    // This is just for the signup process; actual payment will be processed after trial
    // Validate the form and submit
    onComplete({
      planId,
      isMonthlyBilling,
      promoCode,
      termsAgreement
    });
    
    setIsLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement />
      
      <div className="mt-6 mb-4">
        <div className="flex items-center">
          <Checkbox 
            id="termsAgreement" 
            checked={termsAgreement} 
            disabled={true} 
          />
          <label htmlFor="termsAgreement" className="ml-2 block text-sm text-gray-700">
            I have read and agree to CanMonkey's <a href="#" className="text-primary hover:underline">Terms and Conditions</a>.
          </label>
        </div>
      </div>
      
      <div className="flex justify-between">
        <Button type="button" variant="outline" onClick={() => onComplete({ goBack: true })}>
          BACK
        </Button>
        <Button type="submit" disabled={!stripe || isLoading || !termsAgreement}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Submitting...
            </>
          ) : (
            "Submit"
          )}
        </Button>
      </div>
    </form>
  );
};

export default function PaymentInformation({ defaultValues, onSubmit, onBack }: PaymentInformationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  
  const { data: plans, isLoading: plansLoading } = useQuery({
    queryKey: ['/api/plans'],
    select: (data) => data.plans,
  });
  
  const form = useForm<Partial<SignupFormData>>({
    resolver: zodResolver(paymentInfoSchema),
    defaultValues: {
      planId: defaultValues.planId || 1,
      isMonthlyBilling: defaultValues.isMonthlyBilling || true,
      promoCode: defaultValues.promoCode || "",
      termsAgreement: defaultValues.termsAgreement || false,
    },
  });
  
  const selectedPlanId = form.watch("planId");
  const isMonthlyBilling = form.watch("isMonthlyBilling");
  const termsAgreement = form.watch("termsAgreement");
  const promoCode = form.watch("promoCode");
  
  const selectedPlan = plans?.find(plan => plan.id === selectedPlanId);
  
  const handlePromoCodeApply = () => {
    // In a real app, this would validate the promo code with the server
    alert("Promo code applied!");
  };
  
  const handleSubmit = async (data: Partial<SignupFormData>) => {
    if (data.goBack) {
      onBack();
      return;
    }
    
    setIsLoading(true);
    try {
      await onSubmit(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  // In a real implementation, we would fetch a client secret
  useEffect(() => {
    // Make a call to create a SetupIntent or PaymentIntent
    // This is a simplified version, as actual payment is taken after trial
    const fetchClientSecret = async () => {
      try {
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: 0,
          description: "Setup for Can-to-Curb service"
        });
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Failed to fetch client secret", error);
      }
    };
    
    fetchClientSecret();
  }, []);
  
  if (!clientSecret && !plansLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
      <Form {...form}>
        <form className="space-y-4">
          <div className="border border-gray-200 rounded-md p-4 mb-6">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <div className="font-medium">Product</div>
              <div className="flex justify-between w-40">
                <div className="font-medium">Price</div>
                <div className="font-medium">Qty</div>
                <div className="font-medium">Total</div>
              </div>
            </div>
            <div className="flex justify-between items-center py-3">
              <div>
                <div>{selectedPlan ? `Can-to-Curb ${selectedPlan.name} Plan | ${isMonthlyBilling ? 'Monthly' : 'Quarterly'} Pay` : 'Loading...'}</div>
                <div className="text-sm text-gray-500">
                  {selectedPlan ? `($${(selectedPlan.priceMonthly / 100).toFixed(2)}/month)` : ''}
                </div>
              </div>
              <div className="flex justify-between w-40">
                <div>0.00</div>
                <div>1</div>
                <div>0.00</div>
              </div>
            </div>
            <div className="flex justify-between items-center py-2 border-t border-gray-100">
              <div></div>
              <div className="font-medium">Total Due Today: <span className="text-primary">0.00</span></div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <div className="font-medium mb-1">Billing Start Date</div>
              <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            </div>
            <div>
              <div className="font-medium mb-1">End Date</div>
              <div>Until Cancelled</div>
            </div>
            <div>
              <div className="font-medium mb-1">Monthly Rate</div>
              <div>{selectedPlan ? `$${(selectedPlan.priceMonthly / 100).toFixed(2)} / month` : 'Loading...'}</div>
            </div>
          </div>
          
          <p className="text-sm text-gray-500 mb-6">
            Please note that the rate plan selected may be subject to change based on driveway length, 
            additional collection days, additional cans, and/or the need for special access.
          </p>
          
          <FormField
            control={form.control}
            name="planId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Plan</FormLabel>
                <Select 
                  onValueChange={(value) => field.onChange(parseInt(value))} 
                  defaultValue={field.value?.toString()}
                  disabled={isLoading || plansLoading}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a plan" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {plans?.map(plan => (
                      <SelectItem key={plan.id} value={plan.id.toString()}>
                        {plan.name} - ${(plan.priceMonthly / 100).toFixed(2)}/month
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <div className="mb-6">
            <FormLabel>Promo Code</FormLabel>
            <div className="flex">
              <FormField
                control={form.control}
                name="promoCode"
                render={({ field }) => (
                  <FormItem className="flex-grow">
                    <FormControl>
                      <Input 
                        placeholder="Enter Promo Code" 
                        {...field} 
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button 
                type="button" 
                variant="secondary" 
                className="ml-2" 
                onClick={handlePromoCodeApply}
                disabled={isLoading || !promoCode}
              >
                Apply
              </Button>
            </div>
            <div className="flex items-center mt-2">
              <FormField
                control={form.control}
                name="isMonthlyBilling"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        disabled={isLoading}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">Monthly Billing</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          <FormField
            control={form.control}
            name="termsAgreement"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>I have read and agree to CanMonkey's <a href="#" className="text-primary hover:underline">Terms and Conditions</a>.</FormLabel>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {clientSecret && (
            <div className="mt-6">
              <h4 className="text-md font-semibold mb-4">Card Information</h4>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <StripePaymentForm
                  planId={selectedPlanId}
                  isMonthlyBilling={isMonthlyBilling}
                  promoCode={promoCode}
                  termsAgreement={termsAgreement}
                  onComplete={handleSubmit}
                />
              </Elements>
            </div>
          )}
        </form>
      </Form>
    </div>
  );
}
