import React from "react";
import SignupForm from "@/components/signup/signup-form";
import { Helmet } from "react-helmet";
import { useQuery } from "@tanstack/react-query";
import { Redirect } from "wouter";

export default function Signup() {
  // Check if user is already authenticated
  const { data: authData, isLoading } = useQuery({
    queryKey: ['/api/auth-status'],
    retry: false,
  });

  // If authenticated, redirect to dashboard
  if (!isLoading && authData?.authenticated) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <>
      <Helmet>
        <title>Sign Up - TrashMonkey</title>
        <meta name="description" content="Sign up for TrashMonkey's Can-to-Curb service with a 15-day risk-free trial. No more trash day worries!" />
      </Helmet>
      
      <SignupForm />
      
      {/* Additional Info Section */}
      <section className="py-12 bg-neutral">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-3">15-Day Risk-Free Trial</h3>
              <p className="text-gray-600">
                Try our service with absolutely no risk. If you're not completely satisfied, cancel within 15 days and you won't be charged.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-3">Flexible Plans</h3>
              <p className="text-gray-600">
                Choose the plan that works for your specific needs. Upgrade, downgrade, or cancel anytime from your dashboard.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold text-secondary mb-3">Secure Payment</h3>
              <p className="text-gray-600">
                Your payment information is securely processed through Stripe. We never store your complete card details.
              </p>
            </div>
          </div>
          
          <div className="mt-8 text-center text-gray-500 text-sm">
            <p>By signing up, you agree to our <a href="#" className="text-primary underline">Terms of Service</a> and <a href="#" className="text-primary underline">Privacy Policy</a>.</p>
            <p className="mt-2">Already have an account? <a href="/login" className="text-primary underline">Log in here</a>.</p>
          </div>
        </div>
      </section>
    </>
  );
}
