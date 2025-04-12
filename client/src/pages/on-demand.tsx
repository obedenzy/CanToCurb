import { UserWithSubscription } from "@/lib/types";
import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";
import TrustedBy from "@/components/home/trusted-by";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Check, Trash2, Recycle, Home } from "lucide-react";

type OnDemandProps = {
  user: UserWithSubscription | null;
};

export default function OnDemand({ user }: OnDemandProps) {
  return (
    <>
      <Navbar user={user} />
      
      <main>
        {/* Hero section */}
        <section className="bg-white py-12 md:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <div className="inline-block bg-primary/10 text-primary rounded-full px-4 py-2 mb-4">
                On-Demand Service
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-secondary tracking-tight mb-4">
                CanMonkey <span className="text-primary">OnDemand</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                Flexible, on-call trash, recycling, and CanCleaner — perfect for vacation rentals, 
                special events, or whenever you need extra service.
              </p>
              
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" asChild>
                  <Link href="#services">View Services</Link>
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <svg 
                className="w-full h-auto"
                viewBox="0 0 1200 400" 
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
              >
                <rect width="1200" height="400" fill="#F5F7FA" rx="8" />
                <circle cx="600" cy="100" r="50" fill="#FF7A59" />
                <path d="M150 100 H1050 V350 H150 Z" fill="#FFF" stroke="#EEE" />
                <path d="M400 150 L600 150 L600 300 L400 300 Z" fill="#FFF" stroke="#333" strokeWidth="2" />
                <rect x="800" y="270" width="40" height="80" fill="#444" rx="4" />
                <rect x="850" y="270" width="40" height="80" fill="#FF7A59" rx="4" />
                <path d="M100 200 Q150 100 200 200" stroke="#333" strokeWidth="2" />
                <path d="M200 200 L200 350" stroke="#333" strokeWidth="2" />
              </svg>
            </div>
          </div>
        </section>
        
        {/* Services section */}
        <section id="services" className="py-16 bg-light">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">OnDemand Services</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Book our services anytime, anywhere without a subscription. Perfect for one-time needs or to complement your regular service.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Waste Removal */}
              <Card className="bg-white overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Waste Removal</h3>
                    <span className="text-2xl font-bold text-primary">$59</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    One-time trash and recycling removal service. Includes trash, recycling, and yard waste pickup.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Up to 3 bins/bags (trash, recycle, yard waste)</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Easy text or app scheduling</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Photo confirmation of completed service</span>
                    </li>
                  </ul>
                  <Button className="w-full">Order Now</Button>
                </div>
              </Card>
              
              {/* CanCleaner */}
              <Card className="bg-white overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">CanCleaner</h3>
                    <span className="text-2xl font-bold text-primary">$45</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    Thorough cleaning of your trash cans. We deep clean and sanitize, removing odors, stains, and bacteria.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Removes odor, dirt, bugs, debris, and harmful bacteria</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Perfect for homeowners, vacation rentals, and businesses</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Eco-friendly sanitizing that kills pathogens</span>
                    </li>
                  </ul>
                  <Button className="w-full">Order Now</Button>
                </div>
              </Card>
              
              {/* Can-to-Curb */}
              <Card className="bg-white overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold">Can-to-Curb</h3>
                    <span className="text-2xl font-bold text-primary">$29</span>
                  </div>
                  <p className="text-gray-600 mb-6">
                    One-time service to take your bins to the curb for trash day and return them after collection.
                  </p>
                  <ul className="space-y-2 mb-6">
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Perfect for vacations or when you're away</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">No commitment required</span>
                    </li>
                    <li className="flex items-center">
                      <Check className="text-green-500 mr-2 h-5 w-5" />
                      <span className="text-gray-600">Book as needed with just 24-hour notice</span>
                    </li>
                  </ul>
                  <Button className="w-full">Order Now</Button>
                </div>
              </Card>
            </div>
          </div>
        </section>
        
        {/* How it works */}
        <section className="py-16 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">How OnDemand Works</h2>
              <p className="text-gray-600 max-w-3xl mx-auto">
                Easy booking for one-time services whenever you need them. No commitments, no hassle.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              <div className="text-center">
                <div className="bg-light rounded-lg p-6 mb-4 inline-flex items-center justify-center w-16 h-16 mx-auto text-primary">
                  <Home className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">1. Book Online</h3>
                <p className="text-gray-600">
                  Select your service, provide address details, and choose a convenient time for service.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-light rounded-lg p-6 mb-4 inline-flex items-center justify-center w-16 h-16 mx-auto text-primary">
                  <Trash2 className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">2. We Serve</h3>
                <p className="text-gray-600">
                  Our professional team arrives at the scheduled time and performs the requested service.
                </p>
              </div>
              
              <div className="text-center">
                <div className="bg-light rounded-lg p-6 mb-4 inline-flex items-center justify-center w-16 h-16 mx-auto text-primary">
                  <Recycle className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">3. Confirmation</h3>
                <p className="text-gray-600">
                  Receive a photo confirmation when the service is complete. Easy, reliable, and convenient.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-12 bg-primary/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-secondary mb-4">Need a regular service?</h2>
            <p className="text-lg text-gray-600 mb-8">
              Check out our subscription plans and save with regular Can-to-Curb service.
              Plans start at just $39/month with a 15-day free trial.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link href="/pricing">
                <Button size="lg">View Subscription Plans</Button>
              </Link>
              <Link href="/signup">
                <Button variant="outline" size="lg">Start Free Trial</Button>
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
