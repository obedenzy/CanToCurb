import { useEffect, useState } from 'react';
import { useLocation, Link } from 'wouter';
import { Helmet } from 'react-helmet';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";
import { useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery } from '@tanstack/react-query';

// Load stripe outside the component to avoid recreating on every render
if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

export default function SubscribeSuccess() {
  const [location] = useLocation();
  const [paymentStatus, setPaymentStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [paymentInfo, setPaymentInfo] = useState<{
    id: string;
    subscription: string;
  } | null>(null);
  
  // Get the user's subscription info
  const { data: userData, isLoading: userLoading, refetch } = useQuery({
    queryKey: ['/api/user'],
  });
  
  useEffect(() => {
    const queryString = location.split('?')[1];
    const params = new URLSearchParams(queryString || '');
    const paymentIntentClientSecret = params.get('payment_intent_client_secret');
    const paymentIntentId = params.get('payment_intent');
    
    if (!paymentIntentClientSecret || !paymentIntentId) {
      setPaymentStatus('failed');
      return;
    }
    
    const verifyPayment = async () => {
      try {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error('Failed to load Stripe');
        }
        
        const { paymentIntent, error } = await stripe.retrievePaymentIntent(paymentIntentClientSecret);
        
        if (error) {
          console.error('Error retrieving payment intent:', error);
          setPaymentStatus('failed');
          return;
        }
        
        if (paymentIntent && paymentIntent.status === 'succeeded') {
          setPaymentStatus('success');
          setPaymentInfo({
            id: paymentIntent.id,
            subscription: paymentIntent.description || 'Subscription'
          });
          
          // Refresh user data to get updated subscription info
          refetch();
        } else {
          setPaymentStatus('failed');
        }
      } catch (err) {
        console.error('Error in payment verification:', err);
        setPaymentStatus('failed');
      }
    };
    
    verifyPayment();
  }, [location, refetch]);
  
  if (paymentStatus === 'loading' || userLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-xl">Activating your subscription...</p>
        </div>
      </div>
    );
  }
  
  if (paymentStatus === 'failed') {
    return (
      <>
        <Helmet>
          <title>Subscription Failed | TrashMonkey</title>
        </Helmet>
        <div className="py-12 bg-neutral min-h-[calc(100vh-4rem)] flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">Subscription Failed</CardTitle>
              <CardDescription>
                We were unable to process your subscription
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="rounded-full bg-red-100 p-3 w-16 h-16 mx-auto mb-4">
                <svg
                  className="w-10 h-10 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <p className="mb-4">
                There was an issue processing your subscription. Please try again or contact our support team for assistance.
              </p>
            </CardContent>
            <CardFooter className="flex justify-center space-x-4">
              <Button asChild>
                <Link href="/pricing">Try Again</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/">Return Home</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
      </>
    );
  }
  
  // Get subscription details from user data
  const subscription = userData?.subscription;
  const plan = userData?.plan;
  
  return (
    <>
      <Helmet>
        <title>Subscription Successful | TrashMonkey</title>
      </Helmet>
      <div className="py-12 bg-neutral min-h-[calc(100vh-4rem)] flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Subscription Activated!</CardTitle>
            <CardDescription>
              Your trash can service subscription is now active
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div className="space-y-4">
              <p>
                Thank you for subscribing to TrashMonkey! Your regular trash can service is now active.
              </p>
              
              {plan && (
                <div className="bg-neutral-100 p-4 rounded-lg text-left">
                  <h3 className="font-medium mb-2">{plan.name} Plan</h3>
                  <p className="text-sm mb-2">{plan.description}</p>
                  <div className="text-sm">
                    <span className="text-gray-500">Next billing date:</span>{' '}
                    {subscription?.currentPeriodEnd 
                      ? new Date(subscription.currentPeriodEnd).toLocaleDateString() 
                      : 'N/A'}
                  </div>
                </div>
              )}
              
              {paymentInfo && (
                <div className="bg-neutral-100 p-4 rounded-lg text-left">
                  <div className="text-sm text-gray-500 mb-1">Transaction ID</div>
                  <div className="font-mono text-sm truncate">{paymentInfo.id}</div>
                </div>
              )}
              
              <p className="text-sm text-gray-500">
                A confirmation email has been sent to your registered email address with all the details.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-center space-x-4">
            <Button asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Return Home</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </>
  );
}
