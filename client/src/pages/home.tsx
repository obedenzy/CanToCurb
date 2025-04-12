import { UserWithSubscription } from "@/lib/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import HowItWorks from "@/components/home/how-it-works";
import TrustedBy from "@/components/home/trusted-by";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { MessageCircle } from "lucide-react";

type HomeProps = {
  user: UserWithSubscription | null;
};

export default function Home({ user }: HomeProps) {
  return (
    <>
      <Navbar user={user} />
      
      <main>
        <Hero user={user} />
        <Features />
        <HowItWorks />
        
        {/* Call to Action */}
        <section className="py-12 bg-primary/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">Ready to make trash day hassle-free?</h2>
            <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
              Join thousands of happy customers who never worry about taking the trash out again.
              Start your 15-day free trial today!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {user ? (
                <Link href="/dashboard">
                  <Button className="px-8 py-6 text-lg">Go to Dashboard</Button>
                </Link>
              ) : (
                <Link href="/signup">
                  <Button className="px-8 py-6 text-lg">Start Free Trial</Button>
                </Link>
              )}
              <Link href="/pricing">
                <Button variant="outline" className="px-8 py-6 text-lg">View Pricing</Button>
              </Link>
            </div>
          </div>
        </section>
        
        <TrustedBy />
      </main>
      
      <Footer />
      
      {/* Help Widget */}
      <div className="fixed bottom-6 right-6 z-50">
        <Button 
          className="rounded-full w-12 h-12 flex items-center justify-center shadow-lg hover:shadow-xl" 
          aria-label="Need help?"
          variant="secondary"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
