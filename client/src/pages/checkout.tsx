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
import Navbar from '@/components/layout/navbar';
import Footer from '@/components/layout/footer';

// Make sure to call `loadStripe` outside of a component's render to avoid
// recreating the `Stripe` object on every render.
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

type CheckoutFormProps = {
  amount: number;
  serviceName: string;
};

const CheckoutForm = ({ amount, serviceName }: CheckoutFormProps) => {
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
          return_url: `${window.location.origin}/checkout/success`,
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
            You'll be charged {formatCurrency(amount)}
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
              "Pay Now"
            )}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default function Checkout() {
  const [clientSecret, setClientSecret] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location] = useLocation();
  
  // Get the query parameters
  const params = new URLSearchParams(location.split('?')[1] || '');
  const amount = parseFloat(params.get('amount') || '0');
  const service = params.get('service') || 'One-time service';
  
  // Validate the amount
  if (amount <= 0) {
    return <Redirect to="/on-demand" />;
  }

  useEffect(() => {
    // Create PaymentIntent as soon as the page loads
    const fetchPaymentIntent = async () => {
      try {
        setIsLoading(true);
        const response = await apiRequest("POST", "/api/create-payment-intent", { 
          amount: amount 
        });
        
        const data = await response.json();
        setClientSecret(data.clientSecret);
      } catch (err: any) {
        setError(err.message || "Failed to initialize payment");
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchPaymentIntent();
  }, [amount]);

  // Handle loading and error states
  if (isLoading) {
    return (
      <>
        <Helmet>
          <title>Checkout | CanMonkey</title>
        </Helmet>
        <Navbar user={null} />
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-xl">Initializing payment...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Helmet>
          <title>Payment Error | CanMonkey</title>
        </Helmet>
        <Navbar user={null} />
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
              <CardTitle>Payment Error</CardTitle>
              <CardDescription>There was a problem initializing your payment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-red-600">{error}</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  // Make sure we have a client secret to proceed
  if (!clientSecret) {
    return (
      <>
        <Helmet>
          <title>Payment Error | CanMonkey</title>
        </Helmet>
        <Navbar user={null} />
        <div className="min-h-[calc(100vh-12rem)] flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <AlertCircle className="h-12 w-12 mx-auto mb-2 text-red-500" />
              <CardTitle>Payment Error</CardTitle>
              <CardDescription>There was a problem with your payment</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-red-600">Unable to initialize payment. Please try again.</p>
            </CardContent>
            <CardFooter className="flex justify-center">
              <Button onClick={() => window.history.back()}>Go Back</Button>
            </CardFooter>
          </Card>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Checkout | CanMonkey</title>
        <meta name="description" content="Complete your payment for CanMonkey's on-demand service" />
      </Helmet>
      
      <Navbar user={null} />
      
      <div className="py-12 bg-neutral">
        <div className="container max-w-3xl mx-auto px-4">
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Checkout</CardTitle>
              <CardDescription>Complete your payment for on-demand service</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between">
                  <h3 className="text-lg font-medium">{service}</h3>
                  <span className="font-medium">{formatCurrency(amount)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <h3>Total</h3>
                  <span>{formatCurrency(amount)}</span>
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
                <CheckoutForm amount={amount} serviceName={service} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <Footer />
    </>
  );
};