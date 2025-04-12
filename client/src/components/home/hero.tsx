import { Link } from "wouter";
import { UserWithSubscription } from "@/lib/types";

type HeroProps = {
  user: UserWithSubscription | null;
};

export default function Hero({ user }: HeroProps) {
  return (
    <section className="bg-white py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="md:flex md:items-center md:justify-between">
          <div className="md:w-1/2 mb-8 md:mb-0 md:pr-12">
            <h1 className="text-4xl md:text-5xl font-bold text-secondary tracking-tight mb-4">
              Never take the trash out again.
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8">
              CanMonkey takes your cans to the curb on trash day and returns them when collection is done. No more early morning rushes or forgotten pickups.
            </p>
            <div className="flex flex-wrap gap-3">
              {user ? (
                <Link href="/dashboard">
                  <a className="bg-primary text-white py-3 px-6 rounded-md font-medium inline-block hover:bg-primary/90 transition-colors">
                    Go to Dashboard
                  </a>
                </Link>
              ) : (
                <Link href="/signup">
                  <a className="bg-primary text-white py-3 px-6 rounded-md font-medium inline-block hover:bg-primary/90 transition-colors">
                    Get Started
                  </a>
                </Link>
              )}
              <a href="#how-it-works" className="border border-gray-300 text-gray-700 py-3 px-6 rounded-md font-medium inline-block hover:bg-gray-50 transition-colors">
                How It Works
              </a>
            </div>
          </div>
          <div className="md:w-1/2">
            <svg 
              className="w-full h-auto"
              viewBox="0 0 600 400" 
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
            >
              <rect width="600" height="400" fill="#F5F7FA" rx="8" />
              <path d="M150 100 H450 V350 H150 Z" fill="#333" />
              <path d="M150 100 H300 V200 H150 Z" fill="#444" />
              <path d="M300 100 H450 V250 H300 Z" fill="#555" />
              <path d="M100 350 H500 V370 H100 Z" fill="#777" />
              <rect x="400" y="300" width="30" height="50" fill="#FF7A59" rx="4" />
              <rect x="350" y="320" width="30" height="30" fill="#FF7A59" rx="4" />
              <path d="M100 120 Q120 80 140 120" stroke="#333" strokeWidth="2" />
              <path d="M130 120 L130 350" stroke="#333" strokeWidth="2" />
              <circle cx="130" cy="130" r="5" fill="#333" />
              <circle cx="130" cy="145" r="3" fill="#333" />
              <circle cx="130" cy="160" r="3" fill="#333" />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
