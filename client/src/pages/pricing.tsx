import { useQuery } from "@tanstack/react-query";
import { UserWithSubscription } from "@/lib/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import PricingTable from "@/components/shared/pricing-table";
import TrustedBy from "@/components/home/trusted-by";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";

type PricingProps = {
  user: UserWithSubscription | null;
};

export default function Pricing({ user }: PricingProps) {
  const { data, isLoading } = useQuery({
    queryKey: ['/api/plans'],
    select: (data) => data.plans,
  });

  return (
    <>
      <Navbar user={user} />
      
      <main>
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <PricingTable 
              plans={data || []} 
              loading={isLoading}
              user={user}
            />
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="py-12 bg-light">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-secondary mb-8 text-center">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-secondary mb-2">How does the service work?</h3>
                <p className="text-gray-600">
                  Our team will come to your property on your scheduled trash day, take your bins 
                  to the curb, and return them after collection. It's that simple! You'll never 
                  have to worry about trash day again.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-secondary mb-2">What if I need to cancel or change my service?</h3>
                <p className="text-gray-600">
                  You can cancel or modify your service at any time through your account dashboard.
                  We don't lock you into long-term contracts, and you're free to adjust your 
                  service level as your needs change.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-secondary mb-2">Do I need to be home when you come?</h3>
                <p className="text-gray-600">
                  Not at all! Our service runs like clockwork whether you're home or not. 
                  We'll take care of your bins according to the schedule, and you can go about 
                  your day without interruption.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-secondary mb-2">What areas do you service?</h3>
                <p className="text-gray-600">
                  We currently service major metropolitan areas and are rapidly expanding.
                  Enter your address during signup to check if we service your area, or 
                  contact us for more information.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 bg-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">Ready to forget about trash day?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Join thousands of satisfied customers who never worry about their trash bins again.
              Start your risk-free trial today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button size="lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button size="lg">Start Your Free Trial</Button>
                </Link>
              )}
              <Link href="/contact">
                <Button variant="outline" size="lg">Contact Sales</Button>
              </Link>
            </div>
          </div>
        </section>
        
        <TrustedBy />
      </main>
      
      <Footer />
    </>
  );
}
