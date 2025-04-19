import React from "react";
import PricingTable from "@/components/pricing/pricing-table";
import { Helmet } from "react-helmet";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Pricing() {
  return (
    <>
      <Helmet>
        <title>Pricing - TrashMonkey</title>
        <meta name="description" content="View our affordable trash can to curb service plans. All plans include a 15-day risk-free trial with no strings attached." />
      </Helmet>
      
      {/* Header Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-secondary mb-4">Simple, Transparent Pricing</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Choose the plan that works best for you. All plans include our signature Can-to-Curb service that helps you reclaim your time.
          </p>
        </div>
      </section>
      
      {/* Pricing Table */}
      <PricingTable />
      
      {/* FAQ Section */}
      <section className="py-16 bg-neutral">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <h2 className="text-3xl font-bold text-secondary text-center mb-8">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary mb-2">What exactly is the Can-to-Curb service?</h3>
              <p className="text-gray-600">
                Our service includes taking your trash and recycling bins to the curb before collection day and returning them to your designated spot after collection. You'll never have to worry about missing trash day again!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary mb-2">How does the 15-day free trial work?</h3>
              <p className="text-gray-600">
                You'll get full access to your selected plan for 15 days with no charge. If you decide TrashMonkey isn't for you, simply cancel before the trial ends and you won't be charged. No commitment required.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary mb-2">What if I have more than the included number of cans?</h3>
              <p className="text-gray-600">
                Each plan specifies the maximum number of cans included. If you need more, simply upgrade to the next plan or contact us for a custom solution for your specific needs.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary mb-2">Do you service my area?</h3>
              <p className="text-gray-600">
                We're rapidly expanding to new service areas. During signup, we'll confirm if your location is within our current service zone. If not, we can add you to our waitlist for when we expand to your area.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-semibold text-secondary mb-2">Can I change or cancel my plan?</h3>
              <p className="text-gray-600">
                Absolutely! You can upgrade, downgrade, or cancel your plan at any time from your account dashboard. Changes to your service will take effect in your next billing cycle.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-secondary mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Take the first step toward never having to worry about trash day again.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/signup">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white">
                Start Free Trial
              </Button>
            </Link>
            <Link href="/contact">
              <Button size="lg" variant="outline">
                Contact Sales
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
