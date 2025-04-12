import React from "react";
import Hero from "@/components/home/hero";
import Features from "@/components/home/features";
import PropertyTypes from "@/components/home/property-types";
import Testimonials from "@/components/home/testimonials";
import HowItWorks from "@/components/home/how-it-works";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";
import { Helmet } from "react-helmet";

export default function Home() {
  return (
    <>
      <Helmet>
        <title>TrashMonkey - Never Take The Trash Out Again</title>
        <meta name="description" content="TrashMonkey's Can-to-Curb service takes your bins to the curb on trash day and returns them after collection. One less thing to worry about." />
      </Helmet>
      
      <Hero />
      <Features />
      <PropertyTypes />
      <Testimonials />
      <HowItWorks />
      
      {/* Call to Action */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="bg-neutral rounded-xl shadow-lg overflow-hidden">
            <div className="p-8 text-center">
              <h2 className="text-3xl font-bold text-secondary mb-4">Ready to take trash day off your to-do list?</h2>
              <p className="text-xl text-gray-600 mb-6">
                Join thousands of satisfied customers who never worry about forgetting to take out the trash.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/signup">
                  <Button size="lg" className="bg-primary hover:bg-primary/90 text-white font-medium">
                    Start Your Free Trial
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="font-medium">
                    Contact Sales
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Chat Support Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button 
          className="rounded-full p-3 bg-primary hover:bg-primary/90 text-white shadow-lg flex items-center justify-center h-14 w-14"
          aria-label="Chat Support"
        >
          <MessageCircle className="h-6 w-6" />
        </Button>
      </div>
    </>
  );
}
