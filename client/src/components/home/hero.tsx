
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2, Calendar, Shield } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Hero Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1626806787461-102c1bfbed00?ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-black/40" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-screen flex items-center">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary/10 border border-primary/20 backdrop-blur-sm px-4 py-2 rounded-full text-white mb-6">
            <Calendar className="w-4 h-4" />
            <span>Never miss trash day again</span>
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            Your Trash Bins,
            <span className="text-primary block mt-2">Our Responsibility</span>
          </h1>
          
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            TrashMonkey's Can-to-Curb service takes your bins to the curb on trash day and returns them after collection. One less thing to worry about.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
            <Link href="/signup">
              <Button size="lg" className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white gap-2">
                Start Free Trial <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/pricing">
              <Button size="lg" variant="outline" className="w-full sm:w-auto text-white border-white hover:bg-white/10">
                View Pricing
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Trash2 className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Hassle-Free Service</h3>
              <p className="text-gray-300">We handle your bins so you can focus on what matters</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Calendar className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Never Miss a Day</h3>
              <p className="text-gray-300">We keep track of your schedule automatically</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20">
              <Shield className="w-6 h-6 text-primary mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Peace of Mind</h3>
              <p className="text-gray-300">Reliable service backed by our satisfaction guarantee</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
